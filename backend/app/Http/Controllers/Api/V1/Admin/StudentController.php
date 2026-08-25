<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class StudentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $students = User::query()
            ->where('role', 'student')
            ->with('studentProfile')
            ->when($request->filled('search'), function ($query) use ($request): void {
                $search = trim((string) $request->string('search'));
                $query->where(function ($builder) use ($search): void {
                    $builder->where('name', 'like', '%'.$search.'%')
                        ->orWhere('email', 'like', '%'.$search.'%');

                });
            })
            ->latest()
            ->paginate((int) $request->integer('per_page', 15));

        return response()->json($students->through(fn (User $user) => UserResource::make($user)));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'country' => ['nullable', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:30'],
        ]);

        $student = User::query()->create([
            'name' => trim($data['first_name'].' '.$data['last_name']),
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'country' => $data['country'] ?? null,
            'role' => 'student',
            'password' => Hash::make($data['password']),
        ]);

        event(new Registered($student));

        return response()->json([
            'message' => 'Student created successfully.',
            'student' => UserResource::make($student->fresh('studentProfile')),
        ], Response::HTTP_CREATED);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $student = User::query()->where('id', $id)->where('role', 'student')->firstOrFail();

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', 'unique:users,email,'.$student->id],
            'phone' => ['nullable', 'string', 'max:30'],
            'country' => ['nullable', 'string', 'max:100'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        if (array_key_exists('password', $data) && $data['password'] !== null) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $student->fill($data)->save();

        return response()->json([
            'message' => 'Student updated successfully.',
            'student' => UserResource::make($student->fresh('studentProfile')),
        ]);
    }

    public function destroy($id): JsonResponse
    {
        try {
            $student = User::withTrashed()->where('id', $id)->first();
            if (!$student) {
                return response()->json(['message' => 'Student not found.'], Response::HTTP_NOT_FOUND);
            }

            \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
            DB::transaction(function () use ($student) {
                // Delete all linked child table records safely
                if (DB::getSchemaBuilder()->hasTable('student_profiles')) {
                    DB::table('student_profiles')->where('user_id', $student->id)->delete();
                }
                if (DB::getSchemaBuilder()->hasTable('favorites')) {
                    DB::table('favorites')->where('user_id', $student->id)->delete();
                }
                if (DB::getSchemaBuilder()->hasTable('comparisons')) {
                    DB::table('comparisons')->where('user_id', $student->id)->delete();
                }
                if (DB::getSchemaBuilder()->hasTable('recommendations')) {
                    DB::table('recommendations')->where('user_id', $student->id)->delete();
                }
                if (DB::getSchemaBuilder()->hasTable('recommendation_histories')) {
                    DB::table('recommendation_histories')->where('user_id', $student->id)->delete();
                }
                if (DB::getSchemaBuilder()->hasTable('premium_applications')) {
                    DB::table('premium_applications')->where('user_id', $student->id)->delete();
                }
                if (DB::getSchemaBuilder()->hasTable('notifications')) {
                    DB::table('notifications')->where('user_id', $student->id)->delete();
                }
                if (DB::getSchemaBuilder()->hasTable('personal_access_tokens')) {
                    DB::table('personal_access_tokens')->where('tokenable_id', $student->id)->delete();
                }

                // Permanently delete user record from database
                DB::table('users')->where('id', $student->id)->delete();
            });
            \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

            return response()->json(['message' => 'Student deleted successfully.']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'DB Error: ' . $e->getMessage()], 500);
        }
    }
}