const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  projectPhotoUpload,
  createProjectUpdate,
  createProjectFaq
} = require('../controllers/projects');

const Project = require('../models/Project');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// Re-route into other resource routers
router.use('/:projectId/pledges', require('./pledges'));

router
  .route('/')
  .get(
    advancedResults(Project, [
      {
        path: 'creator',
        select: 'name avatar'
      },
      {
        path: 'category'
      }
    ]),
    getProjects
  )
  .post(protect, authorize('user', 'admin'), createProject);

router
  .route('/:id')
  .get(getProject)
  .put(protect, authorize('user', 'admin'), updateProject)
  .delete(protect, authorize('user', 'admin'), deleteProject);

router
  .route('/:id/photo')
  .put(protect, authorize('user', 'admin'), projectPhotoUpload);

router
  .route('/:id/updates')
  .post(protect, authorize('user', 'admin'), createProjectUpdate);

router
  .route('/:id/faqs')
  .post(protect, authorize('user', 'admin'), createProjectFaq);

module.exports = router;
