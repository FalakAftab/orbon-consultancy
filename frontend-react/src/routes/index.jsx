import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';
import { PageLoader } from '../components/feedback/PageLoader';
import { LoadingScreen } from '../components/feedback/LoadingScreen';
import HomePage from '../pages/HomePage';

// Lazy-loaded auth & public pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const HowItWorksPage = lazy(() => import('../pages/HowItWorksPage'));
const PublicProgramsPage = lazy(() => import('../pages/PublicProgramsPage'));
const PublicProgramDetailPage = lazy(() => import('../pages/PublicProgramDetailPage'));
const PublicUniversitiesPage = lazy(() => import('../pages/PublicUniversitiesPage'));
const PublicUniversityDetailPage = lazy(() => import('../pages/PublicUniversityDetailPage'));

// Student pages
const StudentDashboard = lazy(() => import('../pages/student/StudentDashboard'));
const RecommendWizard = lazy(() => import('../pages/student/RecommendationWizard'));
const ResultsPage = lazy(() => import('../pages/student/ResultsPage'));
const ProgramsPage = lazy(() => import('../pages/student/ProgramsPage'));
const ProgramDetailPage = lazy(() => import('../pages/student/ProgramDetailPage'));
const UniversitiesPage = lazy(() => import('../pages/student/UniversitiesPage'));
const UniversityDetailPage = lazy(() => import('../pages/student/UniversityDetailPage'));
const ShortlistPage = lazy(() => import('../pages/student/ShortlistPage'));
const ApplyForMePage = lazy(() => import('../pages/student/ApplyForMePage'));
const HistoryPage = lazy(() => import('../pages/student/HistoryPage'));
const StudentProfilePage = lazy(() => import('../pages/student/StudentProfilePage'));
const NotificationsPage = lazy(() => import('../pages/student/NotificationsPage'));

// Admin pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminUniversities = lazy(() => import('../pages/admin/AdminUniversities'));
const AdminPrograms = lazy(() => import('../pages/admin/AdminPrograms'));
const AdminStudents = lazy(() => import('../pages/admin/AdminStudents'));
const AdminPremiumApplications = lazy(() => import('../pages/admin/AdminPremiumApplications'));
const AdminImport = lazy(() => import('../pages/admin/AdminImport'));
const AdminAnalytics = lazy(() => import('../pages/admin/AdminAnalytics'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  }
  return children;
}

function withFallback(node) {
  return <Suspense fallback={<PageLoader />}>{node}</Suspense>;
}

export default function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace /> : <HomePage />}
      />

      {/* Public */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
          ) : (
            <Suspense fallback={<LoadingScreen />}>
              <LoginPage />
            </Suspense>
          )
        }
      />
      <Route
        path="/register"
        element={
          user ? (
            <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
          ) : (
            <Suspense fallback={<LoadingScreen />}>
              <RegisterPage />
            </Suspense>
          )
        }
      />
      <Route
        path="/forgot-password"
        element={
          user ? (
            <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
          ) : (
            <Suspense fallback={<LoadingScreen />}>
              <ForgotPasswordPage />
            </Suspense>
          )
        }
      />
      <Route
        path="/reset-password"
        element={
          user ? (
            <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
          ) : (
            <Suspense fallback={<LoadingScreen />}>
              <ResetPasswordPage />
            </Suspense>
          )
        }
      />
      <Route path="/about" element={withFallback(<AboutPage />)} />
      <Route path="/contact" element={withFallback(<ContactPage />)} />
      <Route path="/how-it-works" element={withFallback(<HowItWorksPage />)} />
      <Route path="/check-eligibility" element={withFallback(<RecommendWizard />)} />
      {/* Guest results: same ResultsPage component, but reached without an
          account (see RecommendationWizard's guest submit branch). Never put
          this behind ProtectedRoute or a guest who just answered 6 steps of
          questions would be bounced to /login before seeing anything. */}
      <Route path="/results" element={withFallback(<ResultsPage />)} />
      <Route path="/programs" element={withFallback(<PublicProgramsPage />)} />
      <Route path="/programs/:id" element={withFallback(<PublicProgramDetailPage />)} />
      <Route path="/universities" element={withFallback(<PublicUniversitiesPage />)} />
      <Route path="/universities/:id" element={withFallback(<PublicUniversityDetailPage />)} />

      {/* Student portal */}
      <Route
        element={
          <ProtectedRoute role="student">
            <AppLayout role="student" />
          </ProtectedRoute>
        }
      >
        <Route path="/student" element={withFallback(<StudentDashboard />)} />
        <Route path="/student/wizard" element={withFallback(<RecommendWizard />)} />
        <Route path="/student/results" element={withFallback(<ResultsPage />)} />
        <Route path="/student/programs" element={withFallback(<ProgramsPage />)} />
        <Route path="/student/programs/:id" element={withFallback(<ProgramDetailPage />)} />
        <Route path="/student/universities" element={withFallback(<UniversitiesPage />)} />
        <Route path="/student/universities/:id" element={withFallback(<UniversityDetailPage />)} />
        <Route path="/student/shortlist" element={withFallback(<ShortlistPage />)} />
        <Route path="/student/apply-for-me" element={withFallback(<ApplyForMePage />)} />
        <Route path="/student/history" element={withFallback(<HistoryPage />)} />
        <Route path="/student/notifications" element={withFallback(<NotificationsPage />)} />
        <Route path="/student/profile" element={withFallback(<StudentProfilePage />)} />
      </Route>

      {/* Admin portal */}
      <Route
        element={
          <ProtectedRoute role="admin">
            <AppLayout role="admin" />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={withFallback(<AdminDashboard />)} />
        <Route path="/admin/universities" element={withFallback(<AdminUniversities />)} />
        <Route path="/admin/programs" element={withFallback(<AdminPrograms />)} />
        <Route path="/admin/students" element={withFallback(<AdminStudents />)} />
        <Route path="/admin/premium-applications" element={withFallback(<AdminPremiumApplications />)} />
        {/* Part 2 — admin runs the SAME wizard/results components used by
            students, just mounted under the admin-protected route group.
            location.state.adminStudentId (set by AdminStudents.jsx) tells
            the wizard to submit via the admin API instead of the student one. */}
        <Route path="/admin/students/wizard" element={withFallback(<RecommendWizard />)} />
        <Route path="/admin/students/results" element={withFallback(<ResultsPage />)} />
        <Route path="/admin/imports" element={withFallback(<AdminImport />)} />
        <Route path="/admin/analytics" element={withFallback(<AdminAnalytics />)} />
        <Route path="/admin/settings" element={withFallback(<AdminSettings />)} />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={
          <Navigate
            to={user ? (user.role === 'admin' ? '/admin' : '/student') : '/login'}
            replace
          />
        }
      />
    </Routes>
  );
}
