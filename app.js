//On importe express
const express = require('express');
//On importe mongoose
const mongoose = require('mongoose');
//On importe le routeur
const sauceRoutes = require('./routes/sauce');
//On importe le routeur
const userRoutes = require('./routes/user');

const path = require('path');
//Constante app qui permet de créer une application express
const app = express();

//Notre API est à présent connectée à notre base de données
mongoose.connect('mongodb+srv://yassla:Meknes64@cluster0.ezvpujd.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Ce middleware nous permet d'extraire le corps JSON
//afin de gérer la requête POST venant du front-end
app.use(express.json());

//CORS middleware général appliqué à toutes les routes,
//à toutes les requêtes envoyées par notre serveur
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//On indique le début de la route et pour cette route on utilise le routeur
//qui est exposé par sauceRoutes
app.use('/api/sauces', sauceRoutes);
//Pour cette route on utilise le routeur qui est exposé par userRoutes
app.use('/api/auth', userRoutes);
//Route qui sert des fichiers statiques, les images de sauces
//Cela permet le téléchargement des fichiers
app.use('/images', express.static(path.join(__dirname, 'images')));

//On exporte cette constante app pour qu'on puisse y accéder depuis
//les autres fichiers de notre projet
module.exports = app;


