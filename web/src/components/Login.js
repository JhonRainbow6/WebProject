import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            console.log(res.data); // Recibir token
            setError(''); // Limpia errores si el login es exitoso
            // Guardar token y redirigir
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || 'Ocurrió un error');
            } else {
                setError('No se pudo conectar con el servidor.');
            }
        }
    };

    return (
        <form onSubmit={onSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
            <input type="password" name="password" value={password} onChange={onChange} placeholder="Contraseña" required />
            <button type="submit">Iniciar Sesión</button>
        </form>
    );
};

export default Login;
