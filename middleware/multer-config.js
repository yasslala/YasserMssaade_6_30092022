//On importe multer
const multer = require('multer');

//Dictionnaire: grâce aux mimetypes on génère l'extension du fichier
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//On créé un objet de configuration pour multer
//On utilise la fonction diskStorage de multer pour dire qu'on va l'enregistrer
//sur le disque
const storage = multer.diskStorage({
    //Destination d'où on enregistre les fichiers (dans le dossier images)
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //Explique à multer quelle nom de fichier utiliser
  filename: (req, file, callback) => {
    //On récupère le nom d'origine et à la place des espaces
    //on met des underscores 
    const name = file.originalname.split(' ').join('_');
    //Extension du fichier qui correspond à l'élément de notre dictionnaire
    //qui correspond mimitypes du fichier envoyé par le front-end
    const extension = MIME_TYPES[file.mimetype];
    //Création du filename final avec le name, plus le timestamp, un point
    //et l'extension du fichier
    callback(null, name + Date.now() + '.' + extension);
  }
});

//On exporte notre middleware multer avec notre objet storage
//et on indique qu'on gère uniquement le téléchargelent de fichiers images
module.exports = multer({storage: storage}).single('image');