import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebase';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Reports() {
  const [totalRequests, setTotalRequests] = useState(0);
  const [monthlyRequests, setMonthlyRequests] = useState([]);
  const [requestsByDeviceType, setRequestsByDeviceType] = useState([]);
  const [requestsByPriority, setRequestsByPriority] = useState([]);
  const [requestsByDetailedStatus, setRequestsByDetailedStatus] = useState([]);

  const database = getDatabase(app);

  useEffect(() => {
    const requestsRef = ref(database, 'requests');
    onValue(requestsRef, (snapshot) => {
      const requestsData = snapshot.val();
      if (requestsData) {
        const requestsArray = Object.values(requestsData);
        setTotalRequests(requestsArray.length);

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

        // Requests by Detailed Status
        const detailedStatusData = requestsArray.reduce((acc, request) => {
          acc[request.status] = (acc[request.status] || 0) + 1;
          return acc;
        }, {});
        setRequestsByDetailedStatus(Object.keys(detailedStatusData).map(status => ({ status, count: detailedStatusData[status] })));
      }
    });
  }, [database]);

  const generatePdfReport = () => {
    const input = document.getElementById('report-content');
    if (input) {
      html2canvas(input, {
        scale: 2, // Increase scale for better resolution
        useCORS: true, // Enable CORS if images are loaded from external sources
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save('detailed-report.pdf');
      });
    }
  };

  return (
    <div className="reports-page">
      <h1>Reports</h1>

      <div id="report-content">
        <section className="report-summary">
          <h2>Overview</h2>
          <div className="summary-cards">
            <div className="card">
              <h3>Total Requests</h3>
              <p>{totalRequests}</p>
            </div>
          </div>
        </section>

        <section className="report-charts">
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
            <h3>Requests by Detailed Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={requestsByDetailedStatus}>
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

      <button onClick={generatePdfReport} className="generate-pdf-button">
        Generate Detailed Report PDF
      </button>
    </div>
  );
}

export default Reports;