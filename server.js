// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/images', express.static('public/images'));

// Routing dla stron statycznych
const routes = {
    '/': 'index.html',
    '/o-nas': 'pages/o-nas.html',
    '/kontakt': 'pages/contact.html',
    '/faq': 'pages/faq.html',
    '/regulamin': 'pages/regulamin.html',
    '/prywatnosc': 'pages/polityka-prywatnosci.html',
    '/platnosci': 'pages/platnosci.html',
    '/zwroty': 'pages/zwroty.html',
    '/koszyk': 'pages/cart.html',
    '/cookies': 'pages/cookies.html',
    '/konto': 'pages/account.html',
    '/newsletter': 'pages/newsletter.html',
    '/zamowienia': 'pages/orders.html',
    '/ustawienia': 'pages/settings.html',
    '/darmowe-zwroty': 'pages/free-returns.html',
    '/reklamacje': 'pages/complaints.html',
    '/korzysci': 'pages/benefits.html',
    '/gwarancja': 'pages/authenticity.html',
    '/rozmiar-pierscienia': 'pages/ring-size.html',
    '/obraczki': 'pages/wedding-rings.html',
    '/korekta-rozmiaru': 'pages/ring-correction.html',
    '/korekta-obraczki': 'pages/wedding-ring-correction.html',
    '/certyfikaty': 'pages/certificates.html',
    '/grawerowanie': 'pages/engraving.html',
    '/kategoria/pierscionki': 'pages/category.html',
    '/kategoria/naszyjniki': 'pages/category.html',
    '/kategoria/bransoletki': 'pages/category.html'
};

// Rejestracja routingu dla wszystkich ścieżek
Object.entries(routes).forEach(([route, file]) => {
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', file));
    });
});

// Tymczasowe API dla produktów
app.get('/api/products', (req, res) => {
    res.json([
        {
            id: 1,
            name: 'Pierścionek złoty',
            price: 299.99,
            image: '/images/ring1.jpg'
        },
        // Dodaj więcej przykładowych produktów
    ]);
});

// Obsługa błędów
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Coś poszło nie tak!' });
});

// Obsługa nieznalezionych ścieżek (404)
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
});

// Dodaj obsługę kategorii
app.get('/kategoria/:kategoria', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'category.html'));
});

// Dodaj obsługę plików .js jako modułów
app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.type('application/javascript');
    }
    next();
});

// Routing dla stron HTML
app.get('/logowanie', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/login.html'));
});

app.get('/rejestracja', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/register.html'));
});

// Przekierowanie wszystkich nieobsłużonych ścieżek na stronę główną
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Dodaj obsługę favicon.ico
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// Uruchomienie serwera
app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
}).on('error', (err) => {
    console.error('Błąd podczas uruchamiania serwera:', err.message);
});