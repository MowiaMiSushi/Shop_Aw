const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    translations: {
        pl: {
            name: { type: String, required: true },
            description: { type: String, required: true }
        },
        en: {
            name: { type: String, required: true },
            description: { type: String, required: true }
        }
    },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema); 