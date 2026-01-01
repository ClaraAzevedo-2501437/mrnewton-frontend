import { Router } from 'express';
import {
  getAllConfigs,
  getConfig,
  createConfig,
  getConfigParams,
  updateConfigParams,
  deployActivity,
  getInstance,
  getInstancesByActivity,
  recordSubmission,
  getSubmissionsByInstance,
  getSubmissionByInstanceAndStudent
} from '../controllers/activityController';

const router = Router();

// Configuration routes
router.get('/config/params', getConfigParams);
router.put('/config/params', updateConfigParams);
router.get('/config/new', createConfig);
router.get('/config/:activityId', getConfig);
router.get('/config', getAllConfigs);

// Deployment instance routes
router.post('/deploy', deployActivity);
router.get('/deploy/:instanceId', getInstance);
router.get('/deploy/activity/:activityId', getInstancesByActivity);

// Submission routes
router.post('/submissions', recordSubmission);
router.get('/submissions/instance/:instanceId', getSubmissionsByInstance);
router.get('/submissions/instance/:instanceId/student/:studentId', getSubmissionByInstanceAndStudent);

export { router as activityRoutes };
