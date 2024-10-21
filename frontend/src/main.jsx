import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importar el componente principal
import './index.css'; // Si tienes estilos globales
import './app.css'; // Importar los estilos específicos del dashboard
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
