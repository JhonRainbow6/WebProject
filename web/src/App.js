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
import UserProfile from './components/UserProfile';
import Library from './components/Library';
import Friends from './components/Friends';
import AuthCallback from './components/AuthCallback';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/deals" element={
                            <PrivateRoute>
                                <DealsOfDay />
                            </PrivateRoute>
                        } />
                        <Route path="/whats-new" element={
                            <PrivateRoute>
                                <WhatsNew />
                            </PrivateRoute>
                        } />
                        <Route path="/profile" element={
                            <PrivateRoute>
                                <UserProfile />
                            </PrivateRoute>
                        } />
                        <Route path="/library" element={
                            <PrivateRoute>
                                <Library />
                            </PrivateRoute>
                        } />
                        <Route path="/friends" element={
                            <PrivateRoute>
                                <Friends />
                            </PrivateRoute>
                        } />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;