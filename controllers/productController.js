const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania produktów' });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produkt nie został znaleziony' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania produktu' });
    }
};

// Dodaj pozostałe metody CRUD 