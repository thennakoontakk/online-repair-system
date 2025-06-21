import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../AuthContext';

import '../App.css';

const Navbar = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navbarBrand}>
        <Link to="/" style={styles.navbarBrandLink}>Online Repair System</Link>
      </div>
      <ul style={styles.navbarNav}>
        {currentUser ? (
          <>
            <li style={styles.navItem}>
              {userRole && <Link to={`/${userRole}-dashboard`} style={styles.navLink}>Dashboard</Link>}
            </li>
            <li style={styles.navItem}>
              <Link to="/admin/all-requests" style={styles.navLink}>Requests</Link>
            </li>
            {userRole === 'admin' && (
              <li style={styles.navItem}>
                <Link to="/admin/users-by-role" style={styles.navLink}>Users</Link>
              </li>
            )}
            <li style={styles.navItem}>
              <button onClick={handleSignOut} style={styles.logoutButton}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li style={styles.navItem}>
              <Link to="/login" style={styles.navLink}>Login</Link>
            </li>
            <li style={styles.navItem}>
              <Link to="/signup" style={styles.navLink}>Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#0000FF',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  navbarBrand: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  navbarBrandLink: {
    color: '#fff',
    textDecoration: 'none',
  },
  navbarNav: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
  },
  navItem: {
    marginLeft: '20px',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '17px',
    padding: '5px 10px',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '17px',
    cursor: 'pointer',
    padding: '5px 10px',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
};

export default Navbar;