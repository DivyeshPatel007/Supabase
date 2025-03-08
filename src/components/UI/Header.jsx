import React from 'react'
import { useAuth } from '../../contexts/AuthProvider';
import { Link } from 'react-router-dom';

const Header = () => {
    const { user, userRole, isAdmin, isTeacher, isStudent } = useAuth();
  
    return (
      <header>
        {user ? (
          <>
            <span>Welcome, {user.email}</span>
            {/* {isAdmin && <Link to="/admin">Admin Dashboard</Link>}
            {(isAdmin || isTeacher) && <Link to="/courses/manage">Manage Courses</Link>}
            {userRole && <span>Role: {userRole}</span>} */}
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </header>
    );
}

export default Header