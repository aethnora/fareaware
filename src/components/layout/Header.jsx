import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Plane, PlusCircle, User } from 'lucide-react'; // <<< ADD 'User' ICON
import { useAuth } from '../../context/AuthContext'; 

const Header = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); 
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Plane className="w-8 h-8" />
          <span>FareAware</span>
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={({isActive}) => `font-semibold hidden sm:block ${isActive ? 'text-primary' : 'text-gray-600'} hover:text-primary-dark`}>
                Dashboard
              </NavLink>
              
              {/* <<< NEW LINK TO ACCOUNT PAGE >>> */}
              <NavLink to="/account" className={({isActive}) => `font-semibold hidden sm:block ${isActive ? 'text-primary' : 'text-gray-600'} hover:text-primary-dark`}>
                My Account
              </NavLink>

              <Link to="/manual-entry" className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                <PlusCircle className="w-5 h-5" />
                <span>Add Trip</span>
              </Link>
              <button onClick={handleLogout} className="text-gray-600 hover:text-primary-dark font-semibold">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-gray-600 font-semibold hover:text-primary-dark mr-2">
                Login
              </NavLink>
              <NavLink to="/signup" className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;