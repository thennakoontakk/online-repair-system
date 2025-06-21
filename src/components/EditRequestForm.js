import React, { useState, useEffect } from 'react';
import { rtdb } from '../firebase';
import { ref, update } from 'firebase/database';

const EditRequestForm = ({ request, onFormSubmit }) => {
  const [deviceType, setDeviceType] = useState(request.deviceType || '');
  const [problemDescription, setProblemDescription] = useState(request.problemDescription || '');
  const [status, setStatus] = useState(request.status || 'Pending');
  const [priority, setPriority] = useState(request.priority || 'Medium');
  const [technician, setTechnician] = useState(request.technician || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (request) {
      setDeviceType(request.deviceType || '');
      setProblemDescription(request.problemDescription || '');
      setStatus(request.status || 'Pending');
      setPriority(request.priority || 'Medium');
      setTechnician(request.technician || '');
    }
  }, [request]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const requestRef = ref(rtdb, `requests/${request.id}`);
      await update(requestRef, {
        deviceType,
        problemDescription,
        status,
        priority,
        technician,
        updatedAt: new Date(),
      });
      onFormSubmit();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.authInner}>
      <h3 style={styles.title}>Edit Request: {request.id}</h3>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Device Type:</label>
          <input
            type="text"
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            required
            style={styles.formControl}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Problem Description:</label>
          <textarea
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            required
            style={styles.formControl}
          ></textarea>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.formControl}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Priority:</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} style={styles.formControl}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Technician (Optional):</label>
          <input
            type="text"
            value={technician}
            onChange={(e) => setTechnician(e.target.value)}
            style={styles.formControl}
          />
        </div>
        <div style={styles.dGrid}>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Updating...' : 'Update Request'}
          </button>
        </div>
        {error && <p style={styles.message}>Error: {error}</p>}
      </form>
    </div>
  );
};

const styles = {
  authInner: {
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    padding: '30px',
  },
  form: {},
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  formControl: {
    display: 'block',
    width: '100%',
    padding: '10px',
    fontSize: '1rem',
    lineHeight: '1.5',
    color: '#495057',
    backgroundColor: '#fff',
    backgroundClip: 'padding-box',
    border: '1px solid #ced4da',
    borderRadius: '0.25rem',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  },
  dGrid: {
    display: 'grid',
    gap: '10px',
  },
  button: {
    width: '100%',
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '0.25rem',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
  },
  message: {
    color: 'red',
    textAlign: 'center',
    marginTop: '10px',
  },
};

export default EditRequestForm;