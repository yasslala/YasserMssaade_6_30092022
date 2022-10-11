//Ici nous créons des controleurs, on récupèrera donc toute la logique métier
//appliquée à chaque route

//On importe notre nouveau modèle
const Sauce = require('../models/Sauce');
//On importe fs
const fs = require('fs');

//On exporte la fonction createSauce pour la création d'une sauce
exports.createSauce = (req, res, next) => {
    //On parse l'objet pour récupérer ses infos
    const sauceObject = JSON.parse(req.body.sauce);
    //On supprime l'_id car il va être généré automatiquement par la base
    delete sauceObject._id;
    //On supprime l'userId car nous nous utilisons l'userId du token
    delete sauceObject._userId;
    //Nouvelle instance de notre modèle Sauce avec un objet
    //contenant toutes les infos en utilisant le raccourci ...sauceObject
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    //On enregistre l'objet dans la base de données
    sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

//On exporte la fonction modifySauce pour la modification d'une sauce
exports.modifySauce = (req, res, next) => {
    //On cherche s'il y a un champ file dans notre objet requête
    const sauceObject = req.file ? {
      //Si oui on parse notre objet et on créé l'url de l'image
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      //Si non on récupère l'objet dans le corps de la requête
    } : { ...req.body};
    //On supprime l'userId car nous nous utilisons l'userId du token
    delete sauceObject._userId;
    //On récupère notre objet en base de données
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      //Si userId de notre base est différent de l'userId de notre token
      if(sauce.userId != req.auth.userId){
        res.status(401).json({ message: 'Non_autorisé'});
        //Si c'est le bon utilisateur
      }else{
        //UpdateOne permet de mettre à jour un sauce dans la base de données
        //Le 1er argument le filtre pour savoir quelle sauce mettre à jour
        //Le 2ème quelle objet on modifie
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        //On renvoie la réponse
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//On exporte la fonction deleteSauce pour la suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  //On récupère notre objet en base de données
  Sauce.findOne({_id: req.params.id})
  .then(sauce => {
    //Si userId de notre base est différent de l'userId de notre token
    if (sauce.userId != req.auth.userId) {
      res.status(401).json({ message : 'Non_autorisé'});
      //Si c'est le bon utilisateur
    } else {
      //On récupère le filename
      const filename = sauce.imageUrl.split('/images/')[1];
      //On va supprimer avec la méthode unlink de fs en utilisant images/ et
      //le filename
      fs.unlink(`images/${filename}`, () => {
        //DeleteOne permet de supprimer un sauce dans la base de données
        //Argument l'objet de comparaison donc l'id des paramètres de route
        Sauce.deleteOne({_id: req.params.id})
            .then(()  => res.status(200).json ({message: 'Sauce supprimée !'}))
            .catch(error => res.status(401).json ({error}));
      });
    }
  })
  .catch(error => res.status(500).json ({error}));
    
   /* Sauce.deleteOne({ _id: req.params.id })
      //On renvoie la réponse
      .then(() => res.status(204))
      .catch(error => res.status(400).json({ error }));*/
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