import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../AuthContext';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'requests'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRequests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(fetchedRequests);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return <div className="UserDashboard-container">Loading requests...</div>;
  }

  if (error) {
    return <div className="UserDashboard-container">Error: {error}</div>;
  }

  return (
    <div className="UserDashboard-container">
      <h2>All Repair Requests</h2>
      {requests.length === 0 ? (
        <p>No repair requests submitted yet.</p>
      ) : (
        <div className="requests-list">
          {requests.map((request) => (
            <div key={request.id} className="request-card">
              <h3>Request ID: {request.id}</h3>
              <p><strong>Device Type:</strong> {request.deviceType}</p>
              <p><strong>Problem:</strong> {request.problemDescription}</p>
              <p><strong>Status:</strong> {request.status}</p>
              <p><strong>Priority:</strong> {request.priority}</p>
              <p><strong>Submitted On:</strong> {request.createdAt?.toDate().toLocaleString()}</p>
              {/* Add more details as needed, e.g., image, notes */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;