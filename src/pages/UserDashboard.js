import { rtdb } from '../firebase';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const requestsRef = ref(rtdb, 'requests');
    const q = query(
      requestsRef,
      orderByChild('userId'),
      equalTo(currentUser.uid)
    );

    const unsubscribe = onValue(q, (snapshot) => {
      const fetchedRequests = [];
      snapshot.forEach((childSnapshot) => {
        fetchedRequests.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      setRequests(fetchedRequests.filter(req => req.userId === currentUser.uid).reverse()); // Filter by userId and then reverse for createdAt desc order
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
            <div style={styles.headerContainer}>
        <h2>My Repair Requests</h2>
        <button style={styles.createButton} onClick={() => navigate('/request-form')}>Create New Request</button>
      </div>
      {requests.length === 0 ? (
        <p>No repair requests submitted yet.</p>
      ) : (
        <div className="requests-list" style={styles.requestsList}>
          {requests.map((request) => (
            <div key={request.id} style={styles.requestCard}>
              <h3>Request ID: {request.id}</h3>
              <p><strong>Device Type:</strong> {request.deviceType}</p>
              <p><strong>Problem:</strong> {request.problemDescription}</p>
              <p><strong>Status:</strong> {request.status}</p>
              <p><strong>Submitted On:</strong> {new Date(request.createdAt).toLocaleString()}</p>
              {/* Add more details as needed, e.g., image, notes */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  createButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  requestsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  requestCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    width: '300px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
};

export default UserDashboard;
