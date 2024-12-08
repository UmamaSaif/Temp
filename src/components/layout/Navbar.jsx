import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">Patient Panel</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                <Link to="/appointments" className="text-gray-600 hover:text-gray-900">Appointments</Link>
                <Link to="/prescriptions" className="text-gray-600 hover:text-gray-900">Prescriptions</Link>
                <Link to="/health-records" className="text-gray-600 hover:text-gray-900">Health Records</Link>
                <Link to="/queue" className="text-gray-600 hover:text-gray-900">Queue</Link>
                <Link to="/chat" className="text-gray-600 hover:text-gray-900">Chat</Link>
                <Link to="/symptoms" className="text-gray-600 hover:text-gray-900">Symptoms</Link>
                <button
                  onClick={logout}
                  className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                <Link to="/register" className="text-gray-600 hover:text-gray-900">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;