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
    } : { ...req.body}; // req.body.sauce ??
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

//On exporte la fonction likeAndDislikeSauce qui permet de liker et disliker
exports.likeAndDislikeSauce = (req, res, next) => {
  // On récupère le like de la requête du body
  let like = req.body.like;
  // On récupère l'userId
  let userId = req.body.userId;
  // On récupère l'id de la sauce
  let sauceId = req.params.id;

  //On cherche la sauce ayant le même _id que le paramètre de requête
  Sauce.findOne({ _id: sauceId})
    .then((sauce) => {

      //Si l'utlisateur like
      if(!sauce.usersLiked.includes(userId) && like ===1){
        //On met à jour la sauce ayant l'id correspondant à sauceId
        Sauce.updateOne({ _id: sauceId},
          //Grâce à l'opérateur $inc on incrémente à likes
          //Grâce à l'opérateur $push on ajoute l'userId au tableau usersLiked
          {$inc: {likes: 1}, $push: {usersLiked: userId}})
            .then(()  => res.status(201).json ({message: "L'utilisateur a bien ajouté un like."}))
            .catch(error => res.status(400).json ({error}));
      }

      //Si l'utlisateur dislike
      if(!sauce.usersDisliked.includes(userId) && like ===-1){
        //On met à jour la sauce ayant l'id correspondant à sauceId
        Sauce.updateOne({ _id: sauceId},
          //On ajoute l'userId au tableau usersDisliked et on incrémente dislikes
          {$inc: {dislikes: 1}, $push: {usersDisliked: userId}})
            .then(()  => res.status(201).json ({message: "L'utilisateur a bien ajouté un dislike."}))
            .catch(error => res.status(400).json ({error}));
      }

       //Si l'uilisateur enlève son like
      if(sauce.usersLiked.includes(userId)){
        //On met à jour la sauce ayant l'id correspondant à sauceId
        Sauce.updateOne({ _id: sauceId},
          //On décrémente likes et grâce à l'opérateur $pull
          // on supprime userId du tableau usersLiked
          {$inc: {likes: -1}, $pull: {usersLiked: userId}})
            .then(()  => res.status(201).json ({message: "L'utilisateur a bien retiré son like."}))
            .catch(error => res.status(400).json ({error}));
      };
      //Si l'uilisateur enlève son dislike
      if(sauce.usersDisliked.includes(userId)){
        //On met à jour la sauce ayant l'id correspondant à sauceId
        Sauce.updateOne({ _id: sauceId},
          //On décrémente dislikes et
          //on supprime l'userId du tableau usersDisliked       
          {$inc: {dislikes: -1}, $pull: {usersDisliked: userId}})
            .then(()  => res.status(201).json ({message: "L'utilisateur a bien retiré son dislike."}))
            .catch(error => res.status(400).json ({error}));
        }
          
    })
    .catch(error => res.status(404).json ({error}));
};

