import React from 'react';
import Sidebar from '../Sidebar';

export default function Analytics() {
  return (
    <div className="admin-dashboard-root">
      <Sidebar />
      <div className="admin-main-content">
        <div className="admin-content">
          <h2 className="admin-title">Analytics</h2>
          <p>View analytics and reports about appointments, revenue, and customer trends here.</p>
          {/* Add analytics charts and stats here */}
        </div>
      </div>
    </div>
  );
}
