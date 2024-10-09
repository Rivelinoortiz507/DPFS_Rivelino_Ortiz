import React, { useEffect, useState } from 'react';
import './App.css'; // Asegúrate de tener estilos CSS para este componente

const App = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch('http://localhost:3001/api/products');
        const usersResponse = await fetch('http://localhost:3001/api/users');
        const categoriesResponse = await fetch('http://localhost:3001/api/categories');

        // Verifica si las respuestas son exitosas
        if (!productsResponse.ok || !usersResponse.ok || !categoriesResponse.ok) {
          throw new Error('Error en la respuesta de la API');
        }


        const productsData = await productsResponse.json();
        const usersData = await usersResponse.json();
        const categoriesData = await categoriesResponse.json();

        setProducts(productsData);
        setUsers(usersData);
        setCategories(categoriesData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  // Último usuario creado
  const lastUser = users[users.length - 1];

  // Totales
  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalCategories = categories.length;

  return (
    <div className="dashboard container">
      {error && <p className="error text-danger">{error}</p>}
      <div className="row">
        <div className="col-md-4">
          <div className="panel card text-center bg-info text-white mb-4">
            <div className="card-body">
              <h2>Total de Productos</h2>
              <p className="display-4">{totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="panel card text-center bg-success text-white mb-4">
            <div className="card-body">
              <h2>Total de Usuarios</h2>
              <p className="display-4">{totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="panel card text-center bg-warning text-white mb-4">
            <div className="card-body">
              <h2>Total de Categorías</h2>
              <p className="display-4">{totalCategories}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="panel card mb-4">
        <div className="card-body">
          <h2>Último Usuario Creado</h2>
          {lastUser ? (
            <div>
              <p>Nombre: <strong>{lastUser.name}</strong></p>
              <p>Email: <strong>{lastUser.email}</strong></p>
            </div>
          ) : (
            <p>No hay usuarios creados.</p>
          )}
        </div>
      </div>
      <div className="panel card mb-4">
        <div className="card-body">
          <h2>Categorías</h2>
          <ul className="list-group">
            {categories.map((category) => (
              <li key={category.id} className="list-group-item">
                {category.name}: <strong>{category.productCount}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="panel card mb-4">
        <div className="card-body">
          <h2>Listado de Productos</h2>
          <ul className="list-group">
            {products.map((product) => (
              <li key={product.id} className="list-group-item">{product.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
