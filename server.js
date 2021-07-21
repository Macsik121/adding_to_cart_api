require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const passportJwt = require('passport-jwt');
const { connectToDB, getDb } = require('./db');
const { installHandler } = require('./installHandler');
const app = express();
let db;

const port = process.env.PORT || 3000;

const JWTStrategy = passportJwt.Strategy;
const user = {
    id: 1,
    email: 'akmaksa65@gmail.com',
    password: 'AsDf1234@!'
};

app.use(passport.initialize());

passport.use(new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    if (user.email == email && password == user.password) {
        return done(null, user)
    } else {
        return done(null, false, {
            message: 'user wasnot found'
        })
    }
}));

passport.use(new JWTStrategy({
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'Morgenshtern_show-is-imba@!!@',
}, (jwt_payload, done) => {
    if (user.id === jwt_payload.user.id) {
        return done(null, user)
    } else {
        return done(null, false, {
            message: 'Token is wrong'
        })
    }
}));

installHandler(app);

app.use('/', express.static('public'));

(
    async () => {
        try {
            await connectToDB();
            const db = getDb();
            app.listen(port, () => console.log(`Server has been starting with port ${port}`));
        } catch (error) {
            console.log(error);
            client.close();
        }
    }
)()
