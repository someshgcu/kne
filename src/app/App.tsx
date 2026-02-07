import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { CareersPage } from './pages/CareersPage';
import { BlogPage } from './pages/BlogPage';
import { NotFound } from './pages/NotFound';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { LayoutManager } from './pages/admin/LayoutManager';
import { ContentStudio } from './pages/admin/ContentStudio';
import { DataUpload } from './pages/admin/DataUpload';

// Principal Pages
import { PrincipalDashboard } from './pages/principal/PrincipalDashboard';

// Reception/Front Office Pages
import { ReceptionDashboard } from './pages/reception/ReceptionDashboard';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Public Routes with Header/Footer */}
          <Route path="/" element={
            <>
              <Header />
              <HomePage />
              <Footer />
              <Chatbot />
            </>
          } />
          <Route path="/admissions" element={
            <>
              <Header />
              <AdmissionsPage />
              <Footer />
              <Chatbot />
            </>
          } />
          <Route path="/faculty" element={
            <>
              <Header />
              <FacultyPage />
              <Footer />
              <Chatbot />
            </>
          } />
          <Route path="/careers" element={
            <>
              <Header />
              <CareersPage />
              <Footer />
              <Chatbot />
            </>
          } />
          <Route path="/news" element={
            <>
              <Header />
              <BlogPage />
              <Footer />
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

          {/* Principal Protected Routes - Only 'principal' role */}
          <Route path="/principal/dashboard" element={
            <ProtectedRoute allowedRoles={['principal']}>
              <PrincipalDashboard />
            </ProtectedRoute>
          } />

          {/* Reception/Front Office Protected Routes - Only 'front_office' role */}
          <Route path="/reception/dashboard" element={
            <ProtectedRoute allowedRoles={['front_office']}>
              <ReceptionDashboard />
            </ProtectedRoute>
          } />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster position="top-right" />
      </div>
    </Router>
  );
}