const express = require('express');
const Restaurant = require('../models/Restaurant');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true }).select('-__v');
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const { name, cuisine, rating } = req.body;
    if (!name || !cuisine) {
      return res.status(400).json({ message: 'Name and cuisine are required' });
    }

    const restaurant = await Restaurant.create({
      name,
      cuisine,
      rating: rating || 0,
    });

    res.status(201).json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    const deleted = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/:id/menu', protect, requireRole('admin'), async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    restaurant.menu.push({ name, price });
    await restaurant.save();

    res.status(201).json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/menu/:itemId', protect, requireRole('admin'), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const item = restaurant.menu.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    Object.assign(item, req.body);
    await restaurant.save();

    res.json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id/menu/:itemId', protect, requireRole('admin'), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const item = restaurant.menu.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    item.remove();
    await restaurant.save();

    res.json({ message: 'Menu item removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
