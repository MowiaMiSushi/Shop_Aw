const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - pobierz wszystkie produkty
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania produktów' });
    }
});

// GET /api/products/:id - pobierz pojedynczy produkt
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produkt nie został znaleziony' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania produktu' });
    }
});

module.exports = router; 