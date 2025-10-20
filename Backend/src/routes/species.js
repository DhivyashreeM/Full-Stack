import express from 'express';
import Species from '../models/Species.js';

const router = express.Router();

// Get all species with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const species = await Species.find()
      .skip(skip)
      .limit(limit)
      .sort({ scientificName: 1 });

    const total = await Species.countDocuments();

    res.json({
      species,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch species',
      message: error.message
    });
  }
});

// Get species by ID
router.get('/:id', async (req, res) => {
  try {
    const species = await Species.findById(req.params.id);
    
    if (!species) {
      return res.status(404).json({ error: 'Species not found' });
    }

    res.json(species);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch species',
      message: error.message
    });
  }
});

// Search species
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const species = await Species.find({
      $or: [
        { scientificName: { $regex: query, $options: 'i' } },
        { commonName: { $regex: query, $options: 'i' } },
        { family: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);

    res.json(species);
  } catch (error) {
    res.status(500).json({
      error: 'Search failed',
      message: error.message
    });
  }
});

export default router;
