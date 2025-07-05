import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { app } from '../firebase';
import { getAuth } from 'firebase/auth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ManagerDashboard() {
  const [totalRequests, setTotalRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [inProgressRequests, setInProgressRequests] = useState(0);
  const [completedRequests, setCompletedRequests] = useState(0);
  const [monthlyRequests, setMonthlyRequests] = useState([]);
  const [requestsByDeviceType, setRequestsByDeviceType] = useState([]);
  const [requestsByPriority, setRequestsByPriority] = useState([]);
  const [requestsByStatus, setRequestsByStatus] = useState([]);

  const auth = getAuth(app);
  const database = getDatabase(app);

  useEffect(() => {
    const requestsRef = ref(database, 'requests');
    onValue(requestsRef, (snapshot) => {
      const requestsData = snapshot.val();
      if (requestsData) {
        const requestsArray = Object.values(requestsData);
        setTotalRequests(requestsArray.length);
        setPendingRequests(requestsArray.filter(req => req.status === 'Pending').length);
        setInProgressRequests(requestsArray.filter(req => req.status === 'In Progress').length);
        setCompletedRequests(requestsArray.filter(req => req.status === 'Completed').length);

        // Monthly Requests
        const monthlyData = requestsArray.reduce((acc, request) => {
          const month = new Date(request.date).toLocaleString('default', { month: 'short', year: 'numeric' });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});
        setMonthlyRequests(Object.keys(monthlyData).map(month => ({ month, count: monthlyData[month] })));

        // Requests by Device Type
        const deviceTypeData = requestsArray.reduce((acc, request) => {
          acc[request.deviceType] = (acc[request.deviceType] || 0) + 1;
          return acc;
        }, {});
        setRequestsByDeviceType(Object.keys(deviceTypeData).map(type => ({ type, count: deviceTypeData[type] })));

        // Requests by Priority
        const priorityData = requestsArray.reduce((acc, request) => {
          acc[request.priority] = (acc[request.priority] || 0) + 1;
          return acc;
        }, {});
        setRequestsByPriority(Object.keys(priorityData).map(priority => ({ priority, count: priorityData[priority] })));

        // Requests by Status
        const statusData = requestsArray.reduce((acc, request) => {
          acc[request.status] = (acc[request.status] || 0) + 1;
          return acc;
        }, {});
        setRequestsByStatus(Object.keys(statusData).map(status => ({ status, count: statusData[status] })));
      }
    });
  }, [database]);

  return (
    <div className="manager-dashboard">
      <h1>Manager Dashboard</h1>

      <section className="dashboard-summary">
        <h2>Overview</h2>
        <div className="summary-cards">
          <div className="card">
            <h3>Total Requests</h3>
            <p>{totalRequests}</p>
          </div>
          <div className="card">
            <h3>Pending Requests</h3>
            <p>{pendingRequests}</p>
          </div>
          <div className="card">
            <h3>In Progress Requests</h3>
            <p>{inProgressRequests}</p>
          </div>
          <div className="card">
            <h3>Completed Requests</h3>
            <p>{completedRequests}</p>
          </div>
        </div>
      </section>

      <section className="dashboard-charts">
        <h2>Detailed Analytics</h2>

        <div className="chart-container">
          <h3>Monthly Requests</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRequests}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Requests by Device Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestsByDeviceType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" name="Requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Requests by Priority</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestsByPriority}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ffc658" name="Requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Requests by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestsByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ff7300" name="Requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default ManagerDashboard;