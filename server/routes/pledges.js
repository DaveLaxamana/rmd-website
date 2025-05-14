const express = require('express');
const {
  getPledges,
  getPledge,
  addPledge,
  updatePledge,
  deletePledge
} = require('../controllers/pledges');

const Pledge = require('../models/Pledge');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Pledge, [
      {
        path: 'project',
        select: 'title'
      },
      {
        path: 'backer',
        select: 'name avatar'
      }
    ]),
    getPledges
  )
  .post(protect, authorize('user', 'admin'), addPledge);

router
  .route('/:id')
  .get(getPledge)
  .put(protect, authorize('user', 'admin'), updatePledge)
  .delete(protect, authorize('user', 'admin'), deletePledge);

module.exports = router;
