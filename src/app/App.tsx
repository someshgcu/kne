import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { ScrollToTop } from './components/ScrollToTop';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { FacultyPage } from './pages/FacultyPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailsPage } from './pages/CourseDetailsPage';
import { CareersPage } from './pages/CareersPage';
import { BlogPage } from './pages/BlogPage';
import { NotFound } from './pages/NotFound';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { LayoutManager } from './pages/admin/LayoutManager';
import { ContentStudio } from './pages/admin/ContentStudio';
import { DataUpload } from './pages/admin/DataUpload';
import { AIContentGenerator } from './pages/admin/AIContentGenerator';
import { BlogEditor } from './pages/admin/BlogEditor';
import  AdminFacultyPage  from './pages/admin/AdminFacultyPage';

// Principal Pages
import { PrincipalDashboard } from './pages/principal/PrincipalDashboard';
import { PrincipalContentEditor } from './pages/principal/PrincipalContentEditor';
import { AuditLog } from './pages/principal/AuditLog';
import { PrincipalNewsManager } from './pages/principal/PrincipalNewsManager';
import { PrincipalFacultyManager } from './pages/principal/PrincipalFacultyManager';
import { PrincipalReceptionView } from './pages/principal/PrincipalReceptionView';
import { VisualContentEditor } from './pages/principal/VisualContentEditor';
import { PrincipalCourseManager } from './pages/principal/PrincipalCourseManager';

// Reception/Front Office Pages
import { ReceptionDashboard } from './pages/reception/ReceptionDashboard';

// Component to conditionally render footer
function ConditionalFooter() {
  const location = useLocation();
  const publicRoutes = ['/', '/admissions', '/faculty', '/courses', '/careers', '/news'];
  const showFooter = publicRoutes.includes(location.pathname) || location.pathname.startsWith('/courses/');
  return showFooter ? <Footer /> : null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        {/* Universal Header - appears on all pages */}
        <Header />

        <Routes>
          {/* Public Routes - Now without duplicate headers */}
          <Route path="/" element={
            <>
              <HomePage />
              <Chatbot />
            </>
          } />
          <Route path="/admissions" element={
            <>
              <AdmissionsPage />
              <Chatbot />
            </>
          } />
          <Route path="/faculty" element={
            <>
              <FacultyPage />
              <Chatbot />
            </>
          } />
          <Route path="/courses" element={
            <>
              <CoursesPage />
              <Chatbot />
            </>
          } />
          <Route path="/courses/:courseId" element={
            <>
              <CourseDetailsPage />
              <Chatbot />
            </>
          } />
          <Route path="/careers" element={
            <>
              <CareersPage />
              <Chatbot />
            </>
          } />
          <Route path="/news" element={
            <>
              <BlogPage />
              <Chatbot />
            </>
          } />

          {/* Auth Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLogin />} />

          {/* Admin Protected Routes - Only 'admin' role */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/layout" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <LayoutManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/content-studio" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ContentStudio />
            </ProtectedRoute>
          } />
          <Route path="/admin/data-upload" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DataUpload />
            </ProtectedRoute>
          } />
          <Route path="/admin/ai-generator" element={
            <ProtectedRoute allowedRoles={['admin', 'principal']}>
              <AIContentGenerator />
            </ProtectedRoute>
          } />
          <Route path="/admin/blog-editor" element={
            <ProtectedRoute allowedRoles={['admin', 'principal']}>
              <BlogEditor />
            </ProtectedRoute>
          } />
          <Route path='/admin/faculty' element={
            <ProtectedRoute allowedRoles={['admin', 'principal']}>
              <AdminFacultyPage />
            </ProtectedRoute>
          } />

          {/* Principal Protected Routes - 'principal' role has full access */}
          <Route path="/principal" element={
            <ProtectedRoute allowedRoles={['principal']}>
              <PrincipalDashboard />
            </ProtectedRoute>
          } />
          <Route path="/principal/dashboard" element={
            <ProtectedRoute allowedRoles={['principal']}>
              <PrincipalDashboard />
            </ProtectedRoute>
          } />
          <Route path="/principal/news" element={
            <ProtectedRoute allowedRoles={['principal']}>
              <PrincipalNewsManager />
            </ProtectedRoute>
          } />
          <Route path="/principal/faculty" element={
            <ProtectedRoute allowedRoles={['principal']}>
              <PrincipalFacultyManager />
            </ProtectedRoute>
          } />
          <Route path="/principal/courses" element={
            <ProtectedRoute allowedRoles={['principal']}>
              <PrincipalCourseManager />
            </ProtectedRoute>
          } />
          <Route path="/principal/reception-view" element={
            <ProtectedRoute allowedRoles={['principal']}>
              <PrincipalReceptionView />
            </ProtectedRoute>
          } />
          <Route path="/principal/content" element={
            <ProtectedRoute allowedRoles={['principal']}>
              <VisualContentEditor />
            </ProtectedRoute>
          } />
          <Route path="/principal/editor" element={
            <ProtectedRoute allowedRoles={['principal']}>
              <PrincipalContentEditor />
            </ProtectedRoute>
          } />
          <Route path="/principal/audit" element={
            <ProtectedRoute allowedRoles={['principal']}>
              <AuditLog />
            </ProtectedRoute>
          } />

          {/* Reception/Front Office Protected Routes - 'front_office' role */}
          <Route path="/reception" element={
            <ProtectedRoute allowedRoles={['front_office', 'principal']}>
              <ReceptionDashboard />
            </ProtectedRoute>
          } />
          <Route path="/reception/dashboard" element={
            <ProtectedRoute allowedRoles={['front_office', 'principal']}>
              <ReceptionDashboard />
            </ProtectedRoute>
          } />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Conditional Footer - only on public pages */}
        <ConditionalFooter />

        <Toaster position="top-right" />
      </div>
    </Router>
  );
}