const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Esquema de validación del registro
const registerSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});

// Esquema de validación del login
const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});

// Registrar un nuevo usuario
router.post('/register', async (req, res) => {
    // Validacion de los datos antes de crear el usuario
    const { error } = registerSchema.validate(req.body);
    if (error) {
        // Validación de formato de email o contraseña
        let message = error.details[0].message;
        if (message.includes('email')) {
            message = 'El correo electrónico no es válido o es demasiado corto (mínimo 6 caracteres).';
        } else if (message.includes('password')) {
            message = 'La contraseña debe tener al menos 6 caracteres.';
        }
        return res.status(400).json({ error: message });
    }

    try {
        // Verificar si el email ya existe
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
            return res.status(409).json({ error: 'El email ya está registrado.' });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Crear un nuevo usuario
        const user = new User({
            email: req.body.email,
            password: hashedPassword
        });

        const savedUser = await user.save();
        res.status(201).json({ userId: savedUser._id });

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor. Intenta más tarde.' });
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    // Validar los datos
    const { error } = loginSchema.validate(req.body);
    if (error) {
        let message = error.details[0].message;
        if (message.includes('email')) {
            message = 'El correo electrónico no es válido o es demasiado corto (mínimo 6 caracteres).';
        } else if (message.includes('password')) {
            message = 'La contraseña debe tener al menos 6 caracteres.';
        }
        return res.status(400).json({ error: message });
    }

    try {
        // Verificar si el usuario existe
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ error: 'El usuario no existe. Verifica el correo electrónico.' });
        }

        // 3. Verificar la contraseña
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'La contraseña es incorrecta.' });
        }

        // Crear y firmar el token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.header('auth-token', token).json({ token });

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor. Intenta más tarde.' });
    }
});

module.exports = router;
