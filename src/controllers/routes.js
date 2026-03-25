import express from 'express';

import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
} from './organizations.js';
import { showHomePage } from './index.js';
import { showProjectsPage, showProjectDetailsPage } from './projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from './categories.js';
import { showNewOrganizationForm, processNewOrganizationForm } from './organizations.js';
import { testErrorPage } from './errors.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', processNewOrganizationForm);

// Error handling
router.get('/test-error', testErrorPage);

export default router;
