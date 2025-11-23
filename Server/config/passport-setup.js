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
            console.log('Google Profile:', profile.id, profile.emails[0].value);

            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                console.log('Usuario existente encontrado:', user._id);
                return done(null, user);
            } else {
                user = await User.findOne({ email: profile.emails[0].value });
                if (user) {
                    console.log('Usuario por email encontrado:', user._id);
                    user.googleId = profile.id;
                    user.profileImage = user.profileImage || profile.photos[0].value;
                    await user.save();
                    return done(null, user);
                } else {
                    console.log('Creando nuevo usuario');
                    const newUser = new User({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        profileImage: profile.photos[0].value,
                    });
                    await newUser.save();
                    console.log('Nuevo usuario creado:', newUser._id);
                    return done(null, newUser);
                }
            }
        } catch (error) {
            console.error('Error en Google Strategy:', error);
            return done(error, false);
        }
    }
));
