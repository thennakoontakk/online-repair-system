import React, { useState } from 'react';
import { rtdb } from '../firebase';
import { ref, push } from 'firebase/database';
import { useAuth } from '../AuthContext';

const RequestForm = ({ onFormSubmit }) => {
  const { currentUser } = useAuth();
  const [deviceType, setDeviceType] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [deviceId, setDeviceId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setMessage('You must be logged in to submit a request.');
      return;
    }

    try {
      await push(ref(rtdb, 'requests'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        deviceType,
        problemDescription,
        imageUrl: image ? 'placeholder_for_image_url' : null, // Placeholder for image upload logic
        status: 'Pending',
        priority: 'Low', // Default priority
        createdAt: new Date().toISOString(),
        device_id: deviceId,
        technician_id: null, // Will be assigned later
        vendor_id: null, // Will be assigned later
      });
      setMessage('Request submitted successfully!');
      setDeviceType('');
      setProblemDescription('');
      setImage(null);
      setDeviceId('');
      if (onFormSubmit) {
        onFormSubmit();
      }
    } catch (error) {
      console.error('Error adding document: ', error);
      setMessage('Error submitting request: ' + error.message);
    }
  };

  return (
    <div style={styles.authInner}>
      <form style={styles.form} onSubmit={handleSubmit}>
            <h3 style={styles.title}>Submit a Repair Request</h3>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="deviceType">Device Type:</label>
              <input
                type="text"
                id="deviceType"
                style={styles.formControl}
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="deviceId">Device ID:</label>
              <input
                type="text"
                id="deviceId"
                style={styles.formControl}
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="problemDescription">Problem Description:</label>
              <textarea
                id="problemDescription"
                style={styles.formControl}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                rows="5"
                required
              ></textarea>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="image">Attach Image (Optional):</label>
              <input
                type="file"
                id="image"
                style={styles.formControl}
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div style={styles.dGrid}>
              <button type="submit" style={styles.button}>
                Submit Request
              </button>
            </div>
            {message && <p style={styles.message}>{message}</p>}
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
    color: 'green',
    textAlign: 'center',
    marginTop: '10px',
  },
};

export default RequestForm;