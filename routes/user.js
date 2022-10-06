//On importe express
const express = require('express');
//On créé un routeur avec la méthode Router d'express et on enregistre
//toutes les routes sur le routeur
const router = express.Router();

//On importe notre controleurs sauceCtrl
const userCtrl = require('../controllers/user');

//Route post avec l'adresse mail et le mot de passe
router.post('/signup', userCtrl.signup);
//Route post avec l'adresse mail et le mot de passe
router.post('/login', userCtrl.login);

//On exporte le routeur de ce fichier
module.exports = router;