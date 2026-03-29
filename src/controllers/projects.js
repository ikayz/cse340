import { getUpcomingProjects, getProjectDetails, createProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
  const title = 'Upcoming Service Projects';

  res.render('projects', { title, projects, path: req.path });
};

const showProjectDetailsPage = async (req, res) => {
  const projectId = req.params.id;
  const projectDetails = await getProjectDetails(projectId);
  const categories = await getCategoriesByProjectId(projectId);
  const title = 'Project Details';

  res.render('project', { title, projectDetails, categories, path: req.path });
};

const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = 'Add New Project';

  res.render('new-project', { title, organizations, path: req.path });
};

const processNewProjectForm = async (req, res) => {
  const { title, description, location, projectDate, organizationId } = req.body;

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Validation failed - loop through errors
    errors.array().forEach(error => {
      req.flash('error', error.msg);
    });

    // Redirect back to the new project form
    return res.redirect('/new-project');
  }

  try {
    const projectId = await createProject(organizationId, title, description, location, projectDate);

    req.flash('success', 'Project created successfully');
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error('Error creating project:', error);
    req.flash('error', 'Failed to create project');
    res.redirect('/new-project');
  }
};

const projectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Project title must be between 3 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ max: 1000 })
    .withMessage('Project description cannot exceed 1000 characters'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('projectDate')
    .notEmpty()
    .withMessage('Project date is required')
    .isDate()
    .withMessage('Please provide a valid date'),
  body('organizationId')
    .notEmpty()
    .withMessage('Organization selection is required')
    .isInt()
    .withMessage('Please select a valid organization')
];

export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation };
