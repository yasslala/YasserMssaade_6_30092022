//On se retrouve ici avec uniquement la logique de routing

//On importe express
const express = require('express');
//On créé un routeur avec la méthode Router d'express et on enregistre
//toutes les routes sur le routeur
const router = express.Router();
//On importe notre middleware
const auth = require('../middleware/auth');
//On importe notre middleware
const multer = require('../middleware/multer-config');

//On importe notre controleurs sauceCtrl
const sauceCtrl = require('../controllers/sauce');

//On intercèpte les requêtes POST et on a accès à req.body grâce à express.json()
router.post('/', auth, multer,sauceCtrl.createSauce);
//Route permettant la modification d'un objet
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
//Route permettant la suppression d'un objet
router.delete('/:id', auth, sauceCtrl.deleteSauce);
//L'application utilisera cette route pour nous renvoyer un seul objet
//grâce aux : qui rendent la route accessible
router.get('/:id', auth, sauceCtrl.getOneSauce);
//L'application utilisera cette route pour nous renvoyer tous les objets
router.get('/', auth, sauceCtrl.getAllSauces);
//L'application utilisera cette route pour liker ou disliker une sauce
router.post('/:id/like', auth, sauceCtrl.likeAndDislikeSauce);
//On exporte le routeur de ce fichier
module.exports = router;