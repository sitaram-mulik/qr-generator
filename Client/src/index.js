import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import 'leaflet/dist/leaflet.css';
import '@fontsource/fira-code'; // Defaults to weight 400
// import '@fontsource/fira-code/400.css'; // Specify weight
// import '@fontsource/fira-code/400-italic.css'; // Specify weight and style

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
