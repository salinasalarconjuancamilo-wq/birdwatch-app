const mongoose = require('mongoose');

// ✅ PEGA AQUÍ TU CADENA DE CONEXIÓN QUE COPIASTE
const cadenaConexion = "mongodb+srv://usuario:contrase%C3%B1a@cluster0.mongodb.net/birdwatch"

mongoose.connect(cadenaConexion)
  .then(() => {
    console.log('✅ ¡CONECTADO A MONGODB EXITOSAMENTE! 🎉');
  })
  .catch((error) => {
    console.log('❌ ERROR al conectar:', error.message);
  });

module.exports = mongoose;