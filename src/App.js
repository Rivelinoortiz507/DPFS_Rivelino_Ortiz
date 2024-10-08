import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard'; // Asegúrate de que esta ruta sea correcta

function App() {
  return (
    <Router>
      <Switch>
        {/* Aquí puedes agregar otras rutas de tu aplicación */}
        <Route path="/dashboard" component={Dashboard} />
        {/* Otras rutas */}
      </Switch>
    </Router>
  );
}

export default App;
