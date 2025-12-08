import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Admin/Dashboard.jsx';
import Contracts from './pages/Admin/Contracts.jsx';
import Stations from './pages/Admin/Stations.jsx';
import Progress from './pages/Admin/Progress.jsx';
import Comparison from './pages/Admin/Comparison.jsx';
import ChenhLech from './pages/Admin/ChenhLech.jsx';
import Reports from './pages/Admin/Reports.jsx';
import Columns from './pages/Admin/Columns.jsx';
import VolumeOther from './pages/Admin/VolumeOther.jsx';
import KhuVuc from './pages/Admin/KhuVuc.jsx';
import TinhThanh from './pages/Admin/TinhThanh.jsx';
import Duan from './pages/Admin/Duan.jsx';
import Users from './pages/Admin/Users.jsx';
import Profile from './pages/Profile.jsx';
import HopDongCanKhaoSat from './pages/KTV/HopDongCanKhaoSat.jsx';
import LichSuKhaoSat from './pages/KTV/LichSuKhaoSat.jsx';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page - không có sidebar */}
        <Route path="/login" element={<Login />} />
        
        {/* Các trang khác - có sidebar và yêu cầu đăng nhập */}
        <Route element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Admin Pages */}
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/stations" element={<Stations />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/chenhlech" element={<ChenhLech />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/columns" element={<Columns />} />
          <Route path="/volume-other" element={<VolumeOther />} />
          <Route path="/khuvuc" element={<KhuVuc />} />
          <Route path="/tinhthanh" element={<TinhThanh />} />
          <Route path="/duan" element={<Duan />} />
          <Route path="/users" element={<Users />} />
          
          {/* KTV Pages */}
          <Route path="/hopdong-can-khaosat" element={<HopDongCanKhaoSat />} />
          <Route path="/lichsu-khaosat" element={<LichSuKhaoSat />} />
          
          {/* Common Pages */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
        
        {/* Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
