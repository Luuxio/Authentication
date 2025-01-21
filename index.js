const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const pool = require('./db'); 

const app = express();
const port = 3000;

// Middleware pour parser les données POST
app.use(bodyParser.urlencoded({ extended: true }));

// Utiliser express-session pour gérer les sessions utilisateur
app.use(session({
    secret: 'votre_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // À changer à true si vous utilisez HTTPS
}));

// Servir des fichiers statiques (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route pour afficher la page d'accueil (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route de connexion (login)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM connexion.users WHERE email = $1', [email]);
        const user = result.rows[0];

        // Encore des erreurs pour la vaidation si le mot de passse ou l'utilisateur sont incorrect
        if (!user) {
            return res.sendFile(path.join(__dirname, 'public', 'index.html'), { errorMessage: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.sendFile(path.join(__dirname, 'public', 'index.html'), { errorMessage: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        // Authentification réussie, démarrer la session
        req.session.user = { id: user.id, email: user.email };
        
        // Redirection sur la route /protected
        res.redirect('/protected');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la connexion');
    }
});

// Route d'inscription (signup)
app.post('/signup', async (req, res) => {
    const { names, surnames, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer l'utilisateur dans la base de données avec le mot de passe hashed
        await pool.query(
            'INSERT INTO connexion.users (names, surnames, email, password) VALUES ($1, $2, $3, $4)',
            [names, surnames, email, hashedPassword]
        );

        // Rediriger vers la page de login après inscription
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de l\'inscription');
    }
});

// Route protégée, accessible après connexion
app.get('/protected', (req, res) => {
    // Si l'utilisateur n'est pas connecté
    if (!req.session.user) {
        return res.redirect('/');  // Redirige vers la page de login si l'utilisateur n'est pas connecté
    }

    // Retourne le fichier Welcome.html du dossier public
    return res.sendFile(path.join(__dirname, 'public', 'welcome.html'), { errorMessage: 'Nom d\'utilisateur ou mot de passe incorrect' });
    // res.send('Page protégée. Bienvenue, ' + req.session.user.email); // Retourne un message avec l'email de l'utilisateur
});

// Route protégée (accessible avec un bouton sur le fichier Welcome.html)
app.get('/map', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'public', 'map.html'));
});

// Route de déconnexion
app.get('/logout', (req, res) => {
    // Détruire la session pour faire une déconnexion
    req.session.destroy((err) => {
        if (err) {
            // Si un problème est rencontré, il retourne un message d'erreur
            return res.status(500).send('Erreur lors de la déconnexion');
        }
        res.redirect('/');  // Redirige vers la page de login après déconnexion
    });
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
