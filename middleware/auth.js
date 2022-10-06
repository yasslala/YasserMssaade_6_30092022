//On importe jsonwebtoken pour vérifer les tokens
const jwt = require('jsonwebtoken');

//On exporte une fonction qui sera notre middlexare
module.exports = (req, res, next) => {
    //Try...catch nous permet gérer les erreurs
   try {
        //On récupère notre token du header Authorization de la requête entrante
        //
       const token = req.headers.authorization.split(' ')[1];
        //On décode le token avec la méthode verify de jsonwaebtoken
        //on lui passe le token récupéré ainsi que la clé secrète
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        //On récupère le userId grâce à notre token décodé
       const userId = decodedToken.userId;
        //On rajoute la valeur userId à l'objet req qui est transmis
        //aux routes appelées par la suite
       req.auth = {
           userId: userId
       };
    next();
   } catch(error) {
       res.status(401).json({ error });
   }
};