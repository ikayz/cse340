import express from 'express';

import { showOrganizationDetailsPage } from './organizations.js';
import { showOrganizationsPage } from './organizations.js';
import { showHomePage } from './index.js';
import { showProjectsPage } from './projects.js';
import { showCategoriesPage } from './categories.js';
import { testErrorPage } from './errors.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Error handling
router.get('/test-error', testErrorPage);

export default router;
