//On importe notre package bcrypt qui permet le cryptage pour les mots de passe
const bcrypt = require('bcrypt');

//On importe notre modèle
const User = require('../models/User');

//Middleware permettant l'enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
    //Fonction permettant de hasher, crypter un motde passe
    //Avec le mdp du corps de la requête et le solde (combien de fois 
    //on exécute l'algorythme de hashage)
    bcrypt.hash(req.body.password, 10)
    //On récupère le hash de mdp qu'on enregistre dans un nouveau user
    //qu'on enregistre dans la base de données
    .then(hash => {
        //On créé notre nouvel untilisateur avec notre modèle
        const user = new User({
            email: req.body.email,
            password: hash
        });
        //Avec save on l'enregistre dans notre base de données
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé ! '}))
        .catch(error => res.status(400).json({ error}));
    })
    .catch(error => res.status(500).json({ error }));
};


//Middleware permettant aux utilisateurs existant de se connecter
exports.login = (req, res, next) => {
    //Avec findOne on cherche si notre utilisateur existe dans notre base
    //et on filtre avec email pour vérifier l'adresse rentrée
   User.findOne({ email: req.body.email })
       .then(user => {
            //L'utilisateur n'existe pas dans la base
           if (!user) {
               res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
           }else{
           //Si l'utilisateur est enregistré dans la base on compare le mdp
           //de la base avec celui qui a été transmis avec compare
           bcrypt.compare(req.body.password, user.password)
               .then(valid => {
                    //Mdp incorrecte
                   if (!valid) {
                       res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    //mdp correcte on retourne un objet avec l'id utilisateur
                    //et un token
                   }else{
                        res.status(200).json({
                            userId: user._id,
                            token: 'TOKEN'
                        });
                    }
               })
               .catch(error => res.status(500).json({ error }));
            }
       })
       .catch(error => res.status(500).json({ error }));
};