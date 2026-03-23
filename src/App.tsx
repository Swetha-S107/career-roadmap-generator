import { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Selection from './pages/Selection';
import Form from './pages/Form';
import Dashboard from './pages/Dashboard';
import Test from './pages/Test';
import Roadmap from './pages/Roadmap';
import Courses from './pages/Courses';
import Resume from './pages/Resume';
import Profile from './pages/Profile';
import Layout from './components/Layout';

interface User {
  id: number;
  name: string;
  email: string;
  profile?: any;
  testScore?: number;
  roadmap?: any;
  resume?: any;
  courseProgress?: Record<string, string[]>; // courseId -> list of completed topic IDs (e.g. "courseId-week-day")
}

interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
          
          <Route element={<ProtectedRoute user={user} />}>
            <Route path="/selection" element={<Selection />} />
            <Route path="/form" element={<Form />} />
            
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/test" element={<Test />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

function ProtectedRoute({ user }: { user: User | null }) {
  if (!user) return <Navigate to="/auth" />;
  return <Outlet />;
}

function DashboardLayout() {
  const { user } = useUser();
  if (!user?.profile) return <Navigate to="/selection" />;
  return <Layout />;
}
