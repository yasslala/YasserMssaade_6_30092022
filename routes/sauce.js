//On se retrouve ici avec uniquement la logique de routing

//On importe express
const express = require('express');
//On créé un routeur avec la méthode Router d'express et on enregistre
//toutes les routes sur le routeur
const router = express.Router();

//On importe notre controleurs sauceCtrl
const sauceCtrl = require('../controllers/sauce');

//On intercèpte les requêtes POST et on a accès à req.body grâce à express.json()
router.post('/', sauceCtrl.createSauce);
//Route permettant la modification d'un objet
router.put('/:id', sauceCtrl.modifySauce);
//Route permettant la suppression d'un objet
router.delete('/:id', sauceCtrl.deleteSauce);
//L'application utilisera ce middleware pour nous renvoyer un seul objet
//grâce aux : qui rendent la route accessible
router.get('/:id', sauceCtrl.getOneSauce);
//L'application utilisera ce middleware pour nous renvoyer tous les objets
router.get('/', sauceCtrl.getAllSauces);

//On exporte le routeur de ce fichier
module.exports = router;