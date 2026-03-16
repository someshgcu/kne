import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { ScrollToTop } from "./components/ScrollToTop";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

/* Layouts */
import { PublicLayout } from "../layouts/PublicLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { PrincipalLayout } from "../layouts/PrincipalLayout";
import { ReceptionLayout } from "../layouts/ReceptionLayout";

/* Public Pages */
import { HomePage } from "./pages/HomePage";
import { AdmissionsPage } from "./pages/AdmissionsPage";
import { FacultyPage } from "./pages/FacultyPage";
import { CoursesPage } from "./pages/CoursesPage";
import { CourseDetailsPage } from "./pages/CourseDetailsPage";
import { CareersPage } from "./pages/CareersPage";
import { BlogPage } from "./pages/BlogPage";
import { NotFound } from "./pages/NotFound";

/* Admin Pages */
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { LayoutManager } from "./pages/admin/LayoutManager";
import { ContentStudio } from "./pages/admin/ContentStudio";
import { DataUpload } from "./pages/admin/DataUpload";
import { AIContentGenerator } from "./pages/admin/AIContentGenerator";
import { BlogEditor } from "./pages/admin/BlogEditor";
import AdminFacultyPage from "./pages/admin/AdminFacultyPage";

/* Principal Pages */
import { PrincipalDashboard } from "./pages/principal/PrincipalDashboard";
import { PrincipalContentEditor } from "./pages/principal/PrincipalContentEditor";
import { AuditLog } from "./pages/principal/AuditLog";
import { PrincipalNewsManager } from "./pages/principal/PrincipalNewsManager";
import { PrincipalFacultyManager } from "./pages/principal/PrincipalFacultyManager";
import { PrincipalReceptionView } from "./pages/principal/PrincipalReceptionView";
import { VisualContentEditor } from "./pages/principal/VisualContentEditor";
import { PrincipalCourseManager } from "./pages/principal/PrincipalCourseManager";

/* Reception Pages */
import { ReceptionDashboard } from "./pages/reception/ReceptionDashboard";
import { JSX } from "react";

export default function App(): JSX.Element {
  return (
    <Router>
      <ScrollToTop />

      <Routes>

        {/* PUBLIC WEBSITE */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/faculty" element={<FacultyPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/news" element={<BlogPage />} />
        </Route>


        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<AdminLogin />} />


        {/* ADMIN PANEL */}
        <Route element={<AdminLayout />}>
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/layout"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <LayoutManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/content-studio"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ContentStudio />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/data-upload"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DataUpload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/ai-generator"
            element={
              <ProtectedRoute allowedRoles={["admin", "principal"]}>
                <AIContentGenerator />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/blog-editor"
            element={
              <ProtectedRoute allowedRoles={["admin", "principal"]}>
                <BlogEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/faculty"
            element={
              <ProtectedRoute allowedRoles={["admin", "principal"]}>
                <AdminFacultyPage />
              </ProtectedRoute>
            }
          />
        </Route>


        {/* PRINCIPAL PANEL */}
        <Route element={<PrincipalLayout />}>
          <Route
            path="/principal/dashboard"
            element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <PrincipalDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/principal/news"
            element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <PrincipalNewsManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="/principal/faculty"
            element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <PrincipalFacultyManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="/principal/courses"
            element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <PrincipalCourseManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="/principal/reception-view"
            element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <PrincipalReceptionView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/principal/content"
            element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <VisualContentEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/principal/editor"
            element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <PrincipalContentEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/principal/audit"
            element={
              <ProtectedRoute allowedRoles={["principal"]}>
                <AuditLog />
              </ProtectedRoute>
            }
          />
        </Route>


        {/* RECEPTION PANEL */}
        <Route element={<ReceptionLayout />}>
          <Route
            path="/reception/dashboard"
            element={
              <ProtectedRoute allowedRoles={["front_office", "principal"]}>
                <ReceptionDashboard />
              </ProtectedRoute>
            }
          />
        </Route>


        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>

      <Toaster position="top-right" />
    </Router>
  );
}