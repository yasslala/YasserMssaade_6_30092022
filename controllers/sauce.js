//Ici nous créons des controleurs, on récupèrera donc toute la logique métier
//appliquée à chaque route

//On importe notre nouveau modèle
const Sauce = require('../models/Sauce');

//On exporte la fonction createSauce pour la création d'une sauce
exports.createSauce = (req, res, next) => {
    
    //Nouvelle instance de notre modèle Sauce avec un objet
    //contenant toutes les infos en utilisant le raccourci ...req.body
    const sauce = new Sauce({
      ...req.body
    });
    //On enregistre l'objet dans la base de données
    sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

//On exporte la fonction modifySauce pour la modification d'une sauce
exports.modifySauce = (req, res, next) => {
    //UpdateOne permet de mettre à jour un sauce dans la base de données
    //Le 1er argument est l'objet à modifier et le 2eme e nouvelle objet
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      //On renvoie la réponse
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
};

//On exporte la fonction deleteSauce pour la suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    //DeleteOne permet de supprimer un sauce dans la base de données
    //Argument l'objet de comparaison donc l'id des paramètres de route
    Sauce.deleteOne({ _id: req.params.id })
      //On renvoie la réponse
      .then(() => res.status(204))
      .catch(error => res.status(400).json({ error }));
};

//On exporte la fonction getOneSauce pour afficher une sauce
exports.getOneSauce = (req, res, next) => {
    //FindOne nous permet de trouver le sauce ayant la même _id que
    //le paramètre de requête
    Sauce.findOne({ _id: req.params.id })
      //On retourne le sauce retourné par la base
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

//On exporte la fonction getAllSauce pour afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
    //Find ici nous permet de renvoyer un tableau contenant
    //tous les objets Sauces dans notre base de données
    Sauce.find()
      //On retourne le tableau de tous les sauces retournés par la base
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};