import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import RoleSelection from './pages/RoleSelection';
import PassengerHome from './pages/passenger/Home';
import RideRequest from './pages/passenger/RideRequest';
import ErrandRequest from './pages/passenger/ErrandRequest';
import WaitingForProvider from './pages/passenger/WaitingForProvider';
import Tracking from './pages/passenger/Tracking';
import PassengerServiceComplete from './pages/passenger/ServiceComplete';
import ProviderHome from './pages/provider/Home';
import ProviderServiceComplete from './pages/provider/ServiceComplete';

function PassengerRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === null) return <Navigate to="/role-selection" replace />;
  if (user.role !== 'passenger') return <Navigate to="/provider" replace />;
  return <>{children}</>;
}

function ProviderRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === null) return <Navigate to="/role-selection" replace />;
  if (user.role !== 'provider') return <Navigate to="/passenger" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route
          path="/passenger"
          element={
            <PassengerRoute>
              <PassengerHome />
            </PassengerRoute>
          }
        />
        <Route
          path="/passenger/ride"
          element={<PassengerRoute><RideRequest /></PassengerRoute>}
        />
        <Route
          path="/passenger/errand"
          element={<PassengerRoute><ErrandRequest /></PassengerRoute>}
        />
        <Route
          path="/passenger/waiting/:requestId"
          element={<PassengerRoute><WaitingForProvider /></PassengerRoute>}
        />
        <Route
          path="/passenger/tracking/:requestId"
          element={<PassengerRoute><Tracking /></PassengerRoute>}
        />
        <Route
          path="/passenger/complete/:requestId"
          element={<PassengerRoute><PassengerServiceComplete /></PassengerRoute>}
        />
        <Route
          path="/passenger/*"
          element={
            <PassengerRoute>
              <div>Passenger sub-routes — coming soon</div>
            </PassengerRoute>
          }
        />
        <Route
          path="/provider"
          element={
            <ProviderRoute>
              <ProviderHome />
            </ProviderRoute>
          }
        />
        <Route
          path="/provider/complete"
          element={<ProviderRoute><ProviderServiceComplete /></ProviderRoute>}
        />
        <Route
          path="/provider/*"
          element={
            <ProviderRoute>
              <div>Provider sub-routes — coming soon</div>
            </ProviderRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
