//On importe mongoose
const mongoose = require('mongoose');

//Plugin unique-validator qui permet de ne pas avoir plusieurs utilisateurs
//avec la même adresse mail
const uniqueValidator = require('mongoose-unique-validator');

//Création de notre schéma de données grâce à la fonction Schéma
//du package mongoose
const userSchema = mongoose.Schema({
    //Unique permet une seule adresse mail par inscription
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

//Grâce à la méthode plugin, on applique le plugin au schéma
userSchema.plugin(uniqueValidator);

//On exporte le modèle terminé avec son nom et le schéma utilisé
module.exports = mongoose.model('User', userSchema);