import React, { useEffect, useState, useCallback } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebase';

function UsersByRolePage() {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('All');
  const database = getDatabase(app);

  const fetchUsers = useCallback(() => {
    const usersRef = ref(database, 'users');
    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      if (usersData) {
        const usersArray = Object.keys(usersData).map(key => ({
          id: key,
          ...usersData[key]
        }));
        setUsers(usersArray);
      }
    });
  }, [database]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const filteredUsers = selectedRole === 'All'
    ? users
    : users.filter(user => user.role === selectedRole);

  return (
    <div className="users-by-role-page">
      <h1>Users by Role</h1>

      <div className="role-filter">
        <label htmlFor="role-select">Filter by Role:</label>
        <select id="role-select" onChange={handleRoleChange} value={selectedRole}>
          <option value="All">All</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Technician">Technician</option>
          <option value="Engineer">Engineer</option>
          <option value="User">User</option>
        </select>
      </div>

      <div className="users-list">
        {filteredUsers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found for the selected role.</p>
        )}
      </div>
    </div>
  );
}

export default UsersByRolePage;