import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, ClipboardCheck, Map, BookOpen, FileText, LogOut, Menu, X, User as UserIcon, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '../App';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { name: 'Home', icon: Home, path: '/dashboard' },
  { name: 'Profile', icon: UserIcon, path: '/profile' },
  { name: 'Screening Test', icon: ClipboardCheck, path: '/test' },
  { name: 'Roadmap', icon: Map, path: '/roadmap' },
  { name: 'Courses', icon: BookOpen, path: '/courses' },
  { name: 'Resume', icon: FileText, path: '/resume' },
];

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-stone-50 font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-10 shadow-2xl border border-stone-200"
            >
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">Sign Out?</h3>
              <p className="text-stone-500 mb-8 leading-relaxed">
                Are you sure you want to log out of your account? Your progress is saved.
              </p>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                >
                  Yes, Sign Out
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-4 bg-stone-100 text-stone-900 font-bold rounded-2xl hover:bg-stone-200 transition-all"
                >
                  No, Stay
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-stone-200 transform transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-bottom border-stone-100">
            <h1 className="text-xl font-bold tracking-tight text-stone-900">CareerPath AI</h1>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-lg shadow-stone-200'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-stone-100">
            <Link 
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center p-3 mb-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-bold group-hover:bg-stone-900 group-hover:text-white transition-colors">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-stone-900 truncate">{user?.name}</p>
                <p className="text-xs text-stone-500 truncate">{user?.email}</p>
              </div>
            </Link>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-stone-200 lg:hidden">
          <h1 className="text-lg font-bold text-stone-900">CareerPath AI</h1>
          <button onClick={() => setIsOpen(true)} className="p-2 text-stone-600">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 p-6 lg:p-10">
          <div className="w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
