const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const multer = require('multer');
const path = require('path');
const passport = require('passport');

// Configuración de multer para el almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profiles/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // límite de 5MB
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes (jpeg, jpg, png)'));
    }
});

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

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        console.log('Token recibido:', token); // Log para depuración

        if (!token) {
            console.log('No se proporcionó token');
            return res.status(401).json({ error: 'Acceso denegado - Token no proporcionado' });
        }

        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log('Token verificado:', verified); // Log para depuración
        req.user = verified;
        next();
    } catch (error) {
        console.error('Error al verificar token:', error.message);
        res.status(400).json({ error: 'Token no válido - ' + error.message });
    }
}

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
        res.json({
            error: null,
            data: { userId: savedUser._id }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor. Intenta más tarde.' });
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    // Validación de los datos
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
        // Verificar si el email existe
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: 'Email no encontrado.' });
        }

        // Verificar la contraseña
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Contraseña incorrecta.' });
        }

        // Crear y asignar un token
        const token = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.TOKEN_SECRET,
            { expiresIn: '24h' } // Token válido por 24 horas
        );

        console.log('Token generado:', token); // Log para depuración

        res.json({
            error: null,
            data: {
                token,
                user: {
                    email: user.email,
                    id: user._id
                }
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Esquema de validación para cambiar contraseña
const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required()
});

// Cambiar la contraseña del usuario
router.post('/change-password', verifyToken, async (req, res) => {
    // Validar los datos del body
    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
        let message = error.details[0].message;
        if (message.includes('currentPassword')) {
            message = 'La contraseña actual debe tener al menos 6 caracteres.';
        } else if (message.includes('newPassword')) {
            message = 'La nueva contraseña debe tener al menos 6 caracteres.';
        }
        return res.status(400).json({ error: message });
    }

    try {
        // Encontrar al usuario
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Verificar la contraseña actual
        const validPassword = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'La contraseña actual es incorrecta.' });
        }

        // Hashear la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(req.body.newPassword, salt);

        // Actualizar la contraseña
        user.password = hashedNewPassword;
        await user.save();

        res.json({ message: 'Contraseña actualizada correctamente.' });

    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Obtener información del usuario
router.get('/user', verifyToken, async (req, res) => {
    try {
        console.log('ID de usuario en la petición:', req.user._id); // Log para depuración
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            console.log('Usuario no encontrado en la base de datos');
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        console.log('Usuario encontrado:', user); // Log para depuración
        res.json({
            error: null,
            data: { user }
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para actualizar la imagen de perfil
router.post('/update-profile-image', verifyToken, upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
        }

        const imageUrl = `/uploads/profiles/${req.file.filename}`;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profileImage: imageUrl },
            { new: true }
        ).select('-password');

        res.json({
            error: null,
            data: { user }
        });
    } catch (error) {
        console.error('Error al actualizar la imagen de perfil:', error);
        res.status(500).json({ error: 'Error al actualizar la imagen de perfil' });
    }
});
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
    session: false
}), (req, res) => {
    try {

        const token = jwt.sign(
            {
                id: req.user._id,
                _id: req.user._id,
                email: req.user.email
            },
            process.env.TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Token generado para Google OAuth:', token);
        console.log('Usuario:', req.user);

        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (error) {
        console.error('Error en Google OAuth callback:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
});

module.exports = router;
