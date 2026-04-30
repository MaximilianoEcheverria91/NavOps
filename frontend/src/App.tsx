import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login/Login';
import { DashboardAdmin } from './pages/Dashboard/admin/DashboardAdmin';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import { VerifyToken } from './pages/VerifyToken/VerifyToken';
import { ResetPassword } from './pages/ResetPassword/ResetPassword';
import { UsersList } from './pages/Users/ListUser/UsersList';
import { CreateUser } from './pages/Users/CreateUser/CreateUser';
import { EditUser } from './pages/Users/EditUser/EditUser';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardAdmin />} />
        <Route path="/usuarios" element={<UsersList />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyToken />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/users/create" element={<CreateUser />} />
        <Route path="/users/edit/:id" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



<Route path="/users/create" element={<CreateUser />} />
