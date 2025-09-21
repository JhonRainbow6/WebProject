import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate(); // 1. Inicializar useNavigate

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);

            //Guardado del token en localStorage
            localStorage.setItem('token', res.data.token);
            setError(''); // Limpia errores si el login es exitoso
            //Redirigir a Dashboard
            navigate('/dashboard');

        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || 'Ocurrió un error');
            } else {
                setError('No se pudo conectar con el servidor.');
            }
        }
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <h2>Iniciar Sesión</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
                <input type="password" name="password" value={password} onChange={onChange} placeholder="Contraseña" required />
                <button type="submit">Iniciar Sesión</button>
            </form>
            <p>
                ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
            </p>
        </div>
    );
};

export default Login;
