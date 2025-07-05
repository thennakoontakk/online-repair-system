import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, query, orderByChild, equalTo, update } from 'firebase/database';
import { app } from '../firebase';
import { getAuth } from 'firebase/auth';

function TechnicianDashboard() {
  const [technicianRequests, setTechnicianRequests] = useState([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [inProgressRequests, setInProgressRequests] = useState(0);
  const [completedRequests, setCompletedRequests] = useState(0);

  const auth = getAuth(app);
  const database = getDatabase(app);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const requestsRef = ref(database, 'requests');
      const technicianRequestsQuery = query(requestsRef, orderByChild('assignedTo'), equalTo(currentUser.email));

      onValue(technicianRequestsQuery, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const requestsList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setTechnicianRequests(requestsList);

          setTotalRequests(requestsList.length);
          setPendingRequests(requestsList.filter(req => req.status === 'Pending').length);
          setInProgressRequests(requestsList.filter(req => req.status === 'In Progress').length);
          setCompletedRequests(requestsList.filter(req => req.status === 'Completed').length);
        } else {
          setTechnicianRequests([]);
          setTotalRequests(0);
          setPendingRequests(0);
          setInProgressRequests(0);
          setCompletedRequests(0);
        }
      });
    }
  }, [auth, database]);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await update(ref(database, `requests/${requestId}`), { status: newStatus });
      alert('Request status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    }
  };

  return (
    <div className="technician-dashboard">
      <h1>Technician Dashboard</h1>

      <section className="dashboard-summary">
        <h2>Your Request Overview</h2>
        <div className="summary-cards">
          <div className="card">
            <h3>Total Assigned</h3>
            <p>{totalRequests}</p>
          </div>
          <div className="card">
            <h3>Pending</h3>
            <p>{pendingRequests}</p>
          </div>
          <div className="card">
            <h3>In Progress</h3>
            <p>{inProgressRequests}</p>
          </div>
          <div className="card">
            <h3>Completed</h3>
            <p>{completedRequests}</p>
          </div>
        </div>
      </section>

      <section className="your-requests">
        <h2>Your Assigned Requests</h2>
        {technicianRequests.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Device Type</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {technicianRequests.map(request => (
                <tr key={request.id}>
                  <td>{request.date}</td>
                  <td>{request.description}</td>
                  <td>{request.deviceType}</td>
                  <td>
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusChange(request.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{request.priority}</td>
                  <td>
                    {/* Additional actions can be added here */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No requests assigned to you.</p>
        )}
      </section>
    </div>
  );
}

export default TechnicianDashboard;