const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemName: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: ['Lost', 'Found'] },
  location: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  contactInfo: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
