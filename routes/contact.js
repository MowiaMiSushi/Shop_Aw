const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// POST /api/contact - wyślij wiadomość kontaktową
router.post('/', async (req, res) => {
    try {
        const { name, email, message, subject } = req.body;
        
        // Walidacja
        if (!name || !email || !message) {
            return res.status(400).json({ 
                error: 'Wszystkie pola są wymagane' 
            });
        }

        // Tutaj możesz dodać logikę wysyłania maila
        console.log('Otrzymano wiadomość:', {
            name,
            email,
            subject,
            message
        });

        // Wysyłamy odpowiedź sukcesu
        res.status(200).json({ 
            message: 'Wiadomość została wysłana',
            success: true 
        });
    } catch (error) {
        console.error('Błąd:', error);
        res.status(500).json({ 
            error: 'Błąd podczas wysyłania wiadomości',
            details: error.message 
        });
    }
});

module.exports = router; 