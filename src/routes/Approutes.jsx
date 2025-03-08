import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AdminDashBoard from "../pages/AdminDashBoard";
import TeacherPage from "../pages/TeacherPage";
import Register from "../pages/Register";
import AccessDenied from "../pages/AccessDenied";
import Layout from "../layout/Layout";
import { useAuth } from "../contexts/AuthProvider";
import RoleProtectedRoute from "./RoleProtectedRoute";
import UserManagement from "../pages/UserManagement";
import CourseManagement from "../pages/CourseManagment";
import StudentPortal from "../pages/StudentPortal";
import AuthCallbackHandler from "../components/auth/AuthCallBackHandler";


const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/auth/callback" element={<AuthCallbackHandler />} />
      <Route path="/unauthorize" element={<AccessDenied />} />

      {/* Protected routes with Layout */}
      <Route element={<Layout />}>
        {/* Dashboard - accessible to all authenticated users */}
        <Route
          path="/"
          element={
            <RoleProtectedRoute roles={["student", "teacher", "admin"]}>
              <Dashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/access"
          element={<div>Access</div>}

        />


        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute roles={["admin"]}>
              <AdminDashBoard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <RoleProtectedRoute roles={["admin"]}>
              <UserManagement />
            </RoleProtectedRoute>
          }
        />

        {/* Teacher routes */}
        <Route
          path="/teacher"
          element={
            <RoleProtectedRoute roles={["teacher", "admin"]}>
              <TeacherPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/courses/manage"
          element={
            <RoleProtectedRoute roles={["teacher", "admin"]}>
              <CourseManagement />
            </RoleProtectedRoute>
          }
        />

        {/* Student routes */}
        <Route
          path="/student"
          element={
            <RoleProtectedRoute roles={["student", "teacher", "admin"]}>
              <StudentPortal />
            </RoleProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
