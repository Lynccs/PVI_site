/*
// Описуємо структуру документа для чату з повідомленнями
const messageSchema = new mongoose.Schema({
    chatName: { type: String, required: true }, // Назва чату
    messages: [{
        text: { type: String, required: true }, // Текст повідомлення
        sender: { type: String, required: true }, // Відправник повідомлення
        timestamp: { type: Date, default: Date.now } // Час відправлення
    }],
    lastMessageTimestamp: { type: Date, default: Date.now },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }], // Масив ідентифікаторів учасників чату (через ObjectId)
    createdAt: { type: Date, default: Date.now } // Дата створення чату
});

// Створюємо модель Message
module.exports = mongoose.model('Message', messageSchema);*/

const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    lastMessageTimestamp: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
