import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { app } from '../firebase';
import EditRequestForm from '../components/EditRequestForm';

function AllRequests() {
  const [requests, setRequests] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const database = getDatabase(app);

  useEffect(() => {
    const requestsRef = ref(database, 'requests');
    onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const requestsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setRequests(requestsList);
      } else {
        setRequests([]);
      }
    });
  }, [database]);

  const handleDelete = async (id) => {
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

  const handleEdit = (request) => {
    setCurrentRequest(request);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedRequest) => {
    try {
      await update(ref(database, `requests/${updatedRequest.id}`), updatedRequest);
      alert('Request updated successfully!');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request.');
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === '' ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.priority.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' || request.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || request.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="all-requests-page">
      <h1>All Requests</h1>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Search requests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      {filteredRequests.length > 0 ? (
        <div className="requests-list">
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
              {filteredRequests.map(request => (
                <tr key={request.id}>
                  <td>{request.date}</td>
                  <td>{request.description}</td>
                  <td>{request.deviceType}</td>
                  <td>{request.status}</td>
                  <td>{request.priority}</td>
                  <td>{request.assignedTo || 'N/A'}</td>
                  <td>
                    <button onClick={() => handleEdit(request)} className="button edit-button">Edit</button>
                    <button onClick={() => handleDelete(request.id)} className="button delete-button">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No requests found.</p>
      )}

      {isEditModalOpen && (
        <EditRequestForm
          request={currentRequest}
          onSave={handleSaveEdit}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}

export default AllRequests;