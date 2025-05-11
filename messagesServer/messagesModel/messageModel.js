const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true }
});

module.exports = mongoose.model('Chat', messageSchema);