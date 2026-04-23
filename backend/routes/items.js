const express = require('express');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/items → Add item
router.post('/items', auth, async (req, res) => {
  try {
    const { itemName, description, type, location, date, contactInfo } = req.body;
    if (!itemName || !description || !type || !location || !date || !contactInfo) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const item = new Item({
      user: req.user._id,
      itemName,
      description,
      type,
      location,
      date: new Date(date),
      contactInfo
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating item.' });
  }
});

// GET /api/items → View all items
router.get('/items', auth, async (req, res) => {
  try {
    const items = await Item.find().populate('user', 'name email').sort({ date: -1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching items.' });
  }
});

// GET /api/items/search?name=xyz → Search
router.get('/items/search', auth, async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Search query is required.' });
    }

    const items = await Item.find({
      $or: [
        { itemName: { $regex: name, $options: 'i' } },
        { description: { $regex: name, $options: 'i' } },
        { type: { $regex: name, $options: 'i' } },
        { location: { $regex: name, $options: 'i' } }
      ]
    }).populate('user', 'name email').sort({ date: -1 });

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching items.' });
  }
});

// GET /api/items/:id → View item by ID
router.get('/items/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('user', 'name email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching item.' });
  }
});

// PUT /api/items/:id → Update item
router.put('/items/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this item.' });
    }

    const { itemName, description, type, location, date, contactInfo } = req.body;
    item.itemName = itemName || item.itemName;
    item.description = description || item.description;
    item.type = type || item.type;
    item.location = location || item.location;
    item.date = date ? new Date(date) : item.date;
    item.contactInfo = contactInfo || item.contactInfo;

    await item.save();
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating item.' });
  }
});

// DELETE /api/items/:id → Delete item
router.delete('/items/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this item.' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting item.' });
  }
});

// GET /api/items/search?name=xyz → Search
router.get('/items/search', auth, async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Search query is required.' });
    }

    const items = await Item.find({
      $or: [
        { itemName: { $regex: name, $options: 'i' } },
        { description: { $regex: name, $options: 'i' } },
        { type: { $regex: name, $options: 'i' } },
        { location: { $regex: name, $options: 'i' } }
      ]
    }).populate('user', 'name email').sort({ date: -1 });

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching items.' });
  }
});

module.exports = router;
