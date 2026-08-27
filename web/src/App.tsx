import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "@/modules/auth/AuthContext";
import LoginPage from "@/modules/auth/LoginPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { ROLE_HOME } from "@/lib/roles";

const AdminApp = lazy(() => import("@/modules/admin/AdminApp"));
const ReceptionApp = lazy(() => import("@/modules/reception/ReceptionApp"));
const DoctorApp = lazy(() => import("@/modules/doctor/DoctorApp"));
const NurseApp = lazy(() => import("@/modules/nurse/NurseApp"));
const LabApp = lazy(() => import("@/modules/lab/LabApp"));
const PharmacyApp = lazy(() => import("@/modules/pharmacy/PharmacyApp"));

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[user.role]} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="p-8 text-slate-500">Loading…</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RootRedirect />} />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reception/*"
            element={
              <ProtectedRoute roles={["receptionist"]}>
                <ReceptionApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/*"
            element={
              <ProtectedRoute roles={["doctor"]}>
                <DoctorApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nurse/*"
            element={
              <ProtectedRoute roles={["head_nurse"]}>
                <NurseApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab/*"
            element={
              <ProtectedRoute roles={["lab_staff"]}>
                <LabApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/*"
            element={
              <ProtectedRoute roles={["pharmacist"]}>
                <PharmacyApp />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
