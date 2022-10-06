//On importe mongoose pour créer notre schéma pour notre sauce
const mongoose = require('mongoose');

//Création de notre schéma de données grâce à la fonction Schéma
//du package mongoose
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true},
    name: { type: String, required: true},
    manufacturer: { type: String, required: true},
    description: { type: String, required: true},
    mainPepper: { type: String, required: true},
    imageUrl: { type: String, required: true},
    heat: { type: Number, required: true},
    likes: { type: Number, default: 0},
    dislikes: { type: Number, default: 0},
    usersLiked: { type: [String]},
    usersDisliked: { type: [String]}
});

//On exporte le modèle terminé avec son nom et le schéma utilisé
module.exports = mongoose.model('Sauce', sauceSchema);