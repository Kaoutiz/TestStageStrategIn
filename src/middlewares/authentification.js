const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authentification = async (req, res, next) => {
    try {
        const authToken = req.cookies.authToken; // Récupère le token depuis les cookies

        // Vérifie si l'utilisateur est déjà connecté
        if (authToken) {
            // Redirige vers la page home s'il est déjà connecté et tente d'accéder à /login ou /register
            if (req.path === '/login' || req.path === '/register' || req.path === '/') {
                return res.redirect('/home');
            }
            // Votre vérification de token et de l'utilisateur ici...
            // Si l'utilisateur est déjà connecté, il peut accéder à d'autres routes sécurisées (home, etc.)
            return next();
        }

        // Si aucun token n'est présent dans les cookies, l'utilisateur peut accéder à /login ou /register
        if (req.path === '/login' || req.path === '/register' || req.path === '/') {
            return next();
        }

        // Si l'utilisateur tente d'accéder à d'autres routes sécurisées sans être connecté, redirection vers /login
        res.redirect('/login');
    } catch (e) {
        res.status(401).send("Merci de vous logger!");
    }
}

module.exports = authentification;
