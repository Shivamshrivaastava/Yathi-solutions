const express = require('express');
const { protect, requireRole } = require('../middleware/auth');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }

    const preparedItems = [];
    let total = 0;

    for (const it of items) {
      if (!it.restaurant || !it.itemId || !it.quantity) {
        return res.status(400).json({ message: 'Invalid item data' });
      }

      const restaurant = await Restaurant.findById(it.restaurant);
      if (!restaurant) return res.status(400).json({ message: 'Invalid restaurant' });

      const menuItem = restaurant.menu.id(it.itemId);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ message: 'Invalid or unavailable menu item' });
      }

      const price = Number(menuItem.price);
      const quantity = Number(it.quantity);
      total += price * quantity;
      preparedItems.push({
        restaurant: restaurant._id,
        itemId: menuItem._id,
        name: menuItem.name,
        price,
        quantity
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: preparedItems,
      total
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/status', protect, requireRole('admin'), async (req, res) => {
  try {
    const allowed = ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    const { status } = req.body;
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
