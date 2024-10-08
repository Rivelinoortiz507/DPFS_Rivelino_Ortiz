// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalCategories: 0,
    latestProduct: null,
    latestUser: null,
    categories: [],
    products: [],
  });

  const fetchData = async () => {
    try {
      const productsResponse = await axios.get('/api/products');
      const usersResponse = await axios.get('/api/users');
      const categoriesResponse = await axios.get('/api/categories');

      const productsData = productsResponse.data;
      const usersData = usersResponse.data;
      const categoriesData = categoriesResponse.data;

      setData({
        totalProducts: productsData.length,
        totalUsers: usersData.length,
        totalCategories: categoriesData.length,
        latestProduct: productsData[productsData.length - 1],
        latestUser: usersData[usersData.length - 1],
        categories: categoriesData,
        products: productsData,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Total de Productos: {data.totalProducts}</h2>
        <h2>Total de Usuarios: {data.totalUsers}</h2>
        <h2>Total de Categorías: {data.totalCategories}</h2>
        {data.latestProduct && (
          <div>
            <h3>Último Producto Creado:</h3>
            <p>{data.latestProduct.name}</p>
          </div>
        )}
        {data.latestUser && (
          <div>
            <h3>Último Usuario Creado:</h3>
            <p>{data.latestUser.name}</p>
          </div>
        )}
      </div>
      <h2>Categorías</h2>
      <ul>
        {data.categories.map((category) => (
          <li key={category.id}>
            {category.name} - Total Productos: {category.productsCount}
          </li>
        ))}
      </ul>
      <h2>Listado de Productos</h2>
      <ul>
        {data.products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
