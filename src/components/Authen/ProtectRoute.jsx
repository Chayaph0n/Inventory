import React from 'react';
import { Navigate, Route } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem('token');
    return token ? element : <Navigate to="/" />;
}

export default ProtectedRoute;
