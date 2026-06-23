import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login/Login';
import { DashboardAdmin } from './pages/Dashboard/admin/DashboardAdmin';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import { VerifyToken } from './pages/VerifyToken/VerifyToken';
import { ResetPassword } from './pages/ResetPassword/ResetPassword';
import { UsersList } from './pages/Users/ListUser/UsersList';
import { CreateUser } from './pages/Users/CreateUser/CreateUser';
import { EditUser } from './pages/Users/EditUser/EditUser';
import { ListPorts } from './pages/ports/ListPorts/ListPorts';
import { CreatePort } from './pages/ports/CreatePort/CreatePort';
import { EditPort } from "./pages/ports/EditPort/EditPort.tsx";
import { ListShips } from "./pages/ships/ListShips/ListShips.tsx";
import { CreateShip } from "./pages/ships/CreateShip/CreateShip.tsx";
import { UpdateShip } from "./pages/ships/UpdateShip/UpdateShip.tsx";
import { ProtectedRoute } from './components/ProtectedRoute';
import { NavigationMenu } from './pages/navigation/NavigationMenu/NavigationMenu.tsx'; 
import { CreateVoyagePlan } from './pages/navigation/CreateVoyagePlan/CreateVoyagePlan';
import { TravelPlanList } from './pages/navigation/ListTravelPlan/TravelPlanList.tsx';
import { MyTravelPlanList } from './pages/navigation/MyTravelPlanList/MyTravelPlanList';
import { VoyageDashboard } from './pages/navigation/Dashboard/VoyageDashboard.tsx';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Raíz del sitio */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* ========================================================
            RUTAS EXCLUSIVAS: ADMINISTRADOR (ADMIN)
           ======================================================== */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><DashboardAdmin /></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute allowedRoles={['ADMIN']}><UsersList /></ProtectedRoute>} />
        <Route path="/puertos" element={<ProtectedRoute allowedRoles={['ADMIN']}><ListPorts /></ProtectedRoute>} />
        <Route path="/puertos/create" element={<ProtectedRoute allowedRoles={['ADMIN']}><CreatePort /></ProtectedRoute>} />
        <Route path="/puertos/edit/:id" element={<ProtectedRoute allowedRoles={['ADMIN']}><EditPort /></ProtectedRoute>} />
        <Route path="/barcos" element={<ProtectedRoute allowedRoles={['ADMIN']}><ListShips /></ProtectedRoute>} />
        <Route path="/barcos/:id" element={<ProtectedRoute allowedRoles={['ADMIN']}><ListShips /></ProtectedRoute>} />
        <Route path="/users/create" element={<ProtectedRoute allowedRoles={['ADMIN']}><CreateUser /></ProtectedRoute>} />
        <Route path="/users/edit/:id" element={<ProtectedRoute allowedRoles={['ADMIN']}><EditUser /></ProtectedRoute>} />
        <Route path="/barcos/nuevo" element={<ProtectedRoute allowedRoles={['ADMIN']}><CreateShip /></ProtectedRoute>} />
        <Route path="/barcos/edit/:id" element={<ProtectedRoute allowedRoles={['ADMIN']}><UpdateShip /></ProtectedRoute>} />

        {/* ========================================================
            RUTAS EXCLUSIVAS: JEFE DE NAVEGACIÓN (CHIEF_NAVIGATION)
           ======================================================== */}
        {/* Pantalla principal de las 3 cards (Plan, Viajes Activos, Historial) */}
        <Route path="/navigation/menu" element={<ProtectedRoute allowedRoles={['CHIEF_NAVIGATION']}><NavigationMenu /></ProtectedRoute>} />
        
        {/* Asistente de 4 pasos */}
        <Route path="/navigation/create-plan" element={<ProtectedRoute allowedRoles={['CHIEF_NAVIGATION']}><CreateVoyagePlan /></ProtectedRoute>} />

        <Route path="/navigation/travel-plans" element={<ProtectedRoute allowedRoles={['CHIEF_NAVIGATION']}><TravelPlanList /></ProtectedRoute>} />
        <Route path="/navigation/my-voyages" element={<ProtectedRoute allowedRoles={['CHIEF_NAVIGATION']}><MyTravelPlanList /></ProtectedRoute>} />
        <Route path="/navigation/dashboard" element={<ProtectedRoute allowedRoles={['CHIEF_NAVIGATION']}><VoyageDashboard /></ProtectedRoute>} />

        {/* Rutas Públicas de Recuperación */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyToken />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Fallback de seguridad: cualquier ruta inválida te rebota al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;