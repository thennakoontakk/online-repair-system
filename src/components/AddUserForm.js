import React, { useState } from 'react';
import { auth, rtdb } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';

const AddUserForm = ({ roleToAdd, onUserAdded }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(rtdb, 'users/' + user.uid), {
        email: email,
        role: roleToAdd,
      });

      setSuccess(`User ${email} (${roleToAdd}) added successfully!`);
      setEmail('');
      setPassword('');
      if (onUserAdded) {
        onUserAdded();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const styles = {
    form: {
      width: '100%',
      maxWidth: '400px',
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      margin: '20px auto',
    },
    title: {
      textAlign: 'center',
      marginBottom: '15px',
      color: '#333',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    formGroup: {
      marginBottom: '10px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: '500',
      color: '#555',
      textAlign: 'left',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ced4da',
      borderRadius: '5px',
      fontSize: '16px',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#28a745', // Green for add user
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease-in-out',
    },
    errorMessage: {
      color: '#dc3545',
      textAlign: 'center',
      marginBottom: '10px',
      fontSize: '14px',
    },
    successMessage: {
      color: '#28a745',
      textAlign: 'center',
      marginBottom: '10px',
      fontSize: '14px',
    },
  };

  return (
    <form style={styles.form} onSubmit={handleAddUser}>
      <h3 style={styles.title}>Add New {roleToAdd.charAt(0).toUpperCase() + roleToAdd.slice(1)}</h3>
      {error && <p style={styles.errorMessage}>{error}</p>}
      {success && <p style={styles.successMessage}>{success}</p>}
      <div style={styles.formGroup}>
        <label style={styles.label}>Email address</label>
        <input
          type="email"
          style={styles.input}
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Password</label>
        <input
          type="password"
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" style={styles.button}>
        Add User
      </button>
    </form>
  );
};

export default AddUserForm;