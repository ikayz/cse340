import { getUpcomingProjects, getProjectDetails, createProject, updateProject, addVolunteer, removeVolunteer, checkIfUserVolunteered } from '../models/projects.js';
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

  let isVolunteered = false;
  if (req.session && req.session.user) {
    isVolunteered = await checkIfUserVolunteered(projectId, req.session.user.user_id);
  }

  res.render('project', { title, projectDetails, categories, isVolunteered, path: req.path });
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

const showEditProjectForm = async (req, res) => {
  const projectId = req.params.id;
  const projectDetails = await getProjectDetails(projectId);
  const organizations = await getAllOrganizations();
  const title = 'Edit Project';

  if (projectDetails && projectDetails.date) {
    projectDetails.formattedDate = new Date(projectDetails.date).toISOString().split('T')[0];
  }

  res.render('edit-project', { title, projectDetails, organizations, path: req.path });
};

const processEditProjectForm = async (req, res) => {
  const projectId = req.params.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach(error => {
      req.flash('error', error.msg);
    });
    return res.redirect(`/edit-project/${projectId}`);
  }

  const { title, description, location, projectDate, organizationId } = req.body;

  try {
    await updateProject(projectId, organizationId, title, description, location, projectDate);

    req.flash('success', 'Project updated successfully');
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error('Error updating project:', error);
    req.flash('error', 'Failed to update project');
    res.redirect(`/edit-project/${projectId}`);
  }
};

const processAddVolunteer = async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.session.user.user_id;

  try {
    await addVolunteer(projectId, userId);
    req.flash('success', 'You have successfully signed up to volunteer for this project!');
  } catch (error) {
    console.error('Error volunteering:', error);
    req.flash('error', 'Failed to sign up for volunteering.');
  }
  
  res.redirect(`/project/${projectId}`);
};

const processRemoveVolunteer = async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.session.user.user_id;

  try {
    await removeVolunteer(projectId, userId);
    req.flash('success', 'You have been removed from the volunteer list.');
  } catch (error) {
    console.error('Error un-volunteering:', error);
    req.flash('error', 'Failed to remove volunteer status.');
  }

  const referer = req.get('Referrer') || `/project/${projectId}`;
  res.redirect(referer);
};

export { 
  showProjectsPage, 
  showProjectDetailsPage, 
  showNewProjectForm, 
  processNewProjectForm, 
  showEditProjectForm, 
  processEditProjectForm, 
  projectValidation,
  processAddVolunteer,
  processRemoveVolunteer
};
