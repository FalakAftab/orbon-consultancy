<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'country' => $this->country,
            'role' => $this->role,
            'student_id' => $this->student_id,
            'fee_status' => $this->fee_status,
            'subscription_status' => $this->subscription_status,
            'subscription_plan' => $this->subscription_plan,
            'email_verified_at' => $this->email_verified_at,
            'email_verified' => (bool) $this->hasVerifiedEmail(),
            'student_profile' => StudentProfileResource::make($this->whenLoaded('studentProfile')),

        ];
    }
}
