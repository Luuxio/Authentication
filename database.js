// database.js
const { Pool } = require('pg');

// Configuration de la base de données PöstgreSQL
const pool = new Pool({
  user: '', // User de la base      
  host: '', // Host (localhost/ip)
  database: '', // Nom de la database
  password: '', // Mot de pass de la base
  port: '', // Port de base de la base de données
});
module.exports = pool;

// Configuration de la base de données MySQL
const mySql = mysql.createPool({
    host: '',
    user: '', // À adapter avec vos informations MySQL
    database: '', // À adapter avec votre base de données MySQL
    password: '', // Le nom de votre mot de passe MySQL
    port: '',
});
// module.exports = mySql;
