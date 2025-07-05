import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, push, remove } from 'firebase/database';
import { app } from '../firebase';
import { getAuth } from 'firebase/auth';
import RequestForm from '../components/RequestForm';

function UserDashboard() {
  const [userRequests, setUserRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const auth = getAuth(app);
  const database = getDatabase(app);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const requestsRef = ref(database, 'requests');
      onValue(requestsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const requestsList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          })).filter(request => request.userId === currentUser.uid);
          setUserRequests(requestsList);
        } else {
          setUserRequests([]);
        }
      });
    }
  }, [auth, database]);

  const handleAddRequest = async (newRequest) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await push(ref(database, 'requests'), { ...newRequest, userId: currentUser.uid, date: new Date().toISOString().split('T')[0], status: 'Pending' });
        alert('Request added successfully!');
        setIsModalOpen(false);
      } else {
        alert('You must be logged in to add a request.');
      }
    } catch (error) {
      console.error('Error adding request:', error);
      alert('Failed to add request.');
    }
  };

  const handleDeleteRequest = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await remove(ref(database, `requests/${id}`));
        alert('Request deleted successfully!');
      } catch (error) {
        console.error('Error deleting request:', error);
        alert('Failed to delete request.');
      }
    }
  };

  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>

      <button onClick={() => setIsModalOpen(true)} className="button primary">
        Add New Request
      </button>

      {isModalOpen && (
        <RequestForm
          onSave={handleAddRequest}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <section className="your-requests">
        <h2>Your Submitted Requests</h2>
        {userRequests.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Device Type</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userRequests.map(request => (
                <tr key={request.id}>
                  <td>{request.date}</td>
                  <td>{request.description}</td>
                  <td>{request.deviceType}</td>
                  <td>{request.status}</td>
                  <td>{request.priority}</td>
                  <td>{request.assignedTo || 'N/A'}</td>
                  <td>
                    <button onClick={() => handleDeleteRequest(request.id)} className="button delete-button">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No requests submitted yet.</p>
        )}
      </section>
    </div>
  );
}

export default UserDashboard;