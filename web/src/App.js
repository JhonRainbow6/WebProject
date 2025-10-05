import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import DealsOfDay from './components/DealsOfDay';
import WhatsNew from './components/WhatsNew';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/deals" element={
                            <PrivateRoute>
                                <div className="layout-container">
                                    <aside className="sidebar">
                                        <div className="sidebar-icons">
                                            <div className="icon-group">
                                                <button className="sidebar-icon" onClick={() => window.location.href='/dashboard'}>
                                                    <i className="fas fa-th"></i>
                                                </button>
                                                <button className="sidebar-icon">
                                                    <i className="fas fa-gamepad"></i>
                                                </button>
                                                <button className="sidebar-icon">
                                                    <i className="fas fa-shopping-cart"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </aside>
                                    <DealsOfDay />
                                </div>
                            </PrivateRoute>
                        } />
                        <Route path="/whats-new" element={
                            <PrivateRoute>
                                <WhatsNew />
                            </PrivateRoute>
                        } />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
