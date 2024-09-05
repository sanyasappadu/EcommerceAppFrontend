// main.jsx or index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client'; // Use ReactDOM.createRoot
import App from './App';
import { AuthProvider } from './AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
