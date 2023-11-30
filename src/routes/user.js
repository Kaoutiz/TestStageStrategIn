const express = require("express");
const User = require("../models/user");
const authentification = require("../middlewares/authentification");
const router = new express.Router();

router.get("/register", authentification, async (req, res, next) =>{
    res.render("register")
});

router.get("/login", authentification, async (req, res, next) =>{
    res.render("login")
});

router.get("/home", authentification, async (req, res, next) =>{
    const emailConnectedUser = req.user.email;

    const user = await User.find({});
    
    res.render("home", { users: user, emailConnectedUser: emailConnectedUser })
});

router.post("/register", authentification, async (req, res, next) =>{
    const user = new User(req.body);
    try{
        const saveUser = await user.save();

        // Redirection vers la page de connexion (/login) après l'inscription réussie
        res.redirect("/login");
    }catch(e){
        res.render("register", { error: e.message })
    }
    
});

router.post('/login', async (req,res) => {
    try {
        const user = await User.findUser(req.body.email, req.body.password);
        const authToken = await user.generateAuthTokenAndSaveUser();

        // Envoi du token dans un cookie depuis le serveur (Node.js/Express)
        res.cookie('authToken', authToken);
   
        res.redirect("/home");
            
    } catch (e) {
        if (e.message === "L'adresse email ou le mot de passe est invalide!") {
            return res.status(401).render('login', { error: e.message });
        }
        res.status(400).send();
    }
});

router.get('/logout', async (req, res) => {
    try {
        // Supprimer le cookie contenant le token
        res.clearCookie('authToken'); 

        // Redirection vers la page de login après le logout
        res.redirect('/login'); 
    } catch (e) {
        console.error(e);
    }
});

module.exports = router;