const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Buscar si el usuario ya existe con este googleId
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                // Si el usuario existe, continuar
                return done(null, user);
            } else {
                // Si no existe, buscar por email por si ya se registró de forma tradicional
                user = await User.findOne({ email: profile.emails[0].value });
                if (user) {
                    // Si existe por email, enlazar la cuenta de Google
                    user.googleId = profile.id;
                    user.profileImage = user.profileImage || profile.photos[0].value;
                    await user.save();
                    return done(null, user);
                } else {
                    // Si no existe, crear un nuevo usuario
                    const newUser = new User({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        profileImage: profile.photos[0].value,
                    });
                    await newUser.save();
                    return done(null, newUser);
                }
            }
        } catch (error) {
            return done(error, false);
        }
    }
));
