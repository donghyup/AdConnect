import React from 'react';
import { CheckCircle2, AlertTriangle, Bell } from 'lucide-react';

export default function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} color="var(--secondary)" />}
          {toast.type === 'error' && <AlertTriangle size={18} color="var(--accent)" />}
          {toast.type === 'warning' && <AlertTriangle size={18} color="var(--warning)" />}
          {toast.type === 'info' && <Bell size={18} color="var(--primary)" />}
          <span style={{ fontSize: '13px', fontWeight: '500' }}>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
