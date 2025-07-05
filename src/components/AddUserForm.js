import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { app } from '../firebase';

function AddUserForm({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const auth = getAuth(app);
  const database = getDatabase(app);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(database, `users/${user.uid}`), {
        email: user.email,
        username: username,
        role: role,
        createdAt: new Date().toISOString()
      });

      setSuccess('User added successfully!');
      setEmail('');
      setPassword('');
      setUsername('');
      setRole('User');
      onClose(); // Close form after successful addition
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New User</h2>
        <form onSubmit={handleAddUser}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Technician">Technician</option>
              <option value="Engineer">Engineer</option>
            </select>
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="form-actions">
            <button type="submit" className="button primary">Add User</button>
            <button type="button" onClick={onClose} className="button secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUserForm;