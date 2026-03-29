import {
  getAllOrganizations,
  getOrganizationDetails,
} from '../models/organizations.js';
import { getProjectsByOrganizationId, getProjectsByCategoryId, getProjectDetails } from '../models/projects.js';
import { getAllCategories, getCategoryDetails, getCategoriesByProjectId, updateCategoryAssignments, createCategory, updateCategory } from '../models/categories.js';
import { body, validationResult } from 'express-validator';

const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = 'Categories';

  res.render('categories', { title, categories, path: req.path });
};

const showOrganizationDetailsPage = async (req, res) => {
  const organizationId = req.params.organizationId;
  const organizationDetails = await getOrganizationDetails(organizationId);
  const projects = await getProjectsByOrganizationId(organizationId);
  const title = 'Organization Details';

  res.render('organization', {
    title,
    organizationDetails,
    projects,
    path: req.path,
  });
};

const showCategoryDetailsPage = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryDetails(categoryId);

    if (!categoryDetails) {
      const err = new Error('Category Not Found');
      err.status = 404;
      return next(err);
    }

    const projects = await getProjectsByCategoryId(categoryId);
    const title = `${categoryDetails.name} Projects`;

    res.render('category', {
      title,
      categoryDetails,
      projects,
      path: '/categories',
    });
  } catch (error) {
    next(error);
  }
};

const showAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const projectDetails = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByProjectId(projectId);
  const title = 'Assign Categories to Project';

  res.render('assign-categories', {
    title,
    projectDetails,
    categories,
    assignedCategories,
    path: req.path,
  });
};

const processAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const { categories } = req.body;

  await updateCategoryAssignments(projectId, categories);

  req.flash('success', 'Categories assigned successfully');
  res.redirect(`/project/${projectId}`);
};

const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Category name must be between 3 and 100 characters')
];

const showNewCategoryForm = async (req, res) => {
  const title = 'Add New Category';
  res.render('new-category', { title, path: req.path });
};

const processNewCategoryForm = async (req, res) => {
  const { name } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach(error => {
      req.flash('error', error.msg);
    });
    return res.redirect('/new-category');
  }

  try {
    const categoryId = await createCategory(name);
    req.flash('success', 'Category created successfully');
    res.redirect(`/category/${categoryId}`);
  } catch (error) {
    console.error('Error creating category:', error);
    req.flash('error', 'Failed to create category');
    res.redirect('/new-category');
  }
};

const showEditCategoryForm = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryDetails(categoryId);

    if (!categoryDetails) {
      const err = new Error('Category Not Found');
      err.status = 404;
      return next(err);
    }

    const title = 'Edit Category';
    res.render('edit-category', { title, categoryDetails, path: req.path });
  } catch (error) {
    next(error);
  }
};

const processEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach(error => {
      req.flash('error', error.msg);
    });
    return res.redirect(`/edit-category/${categoryId}`);
  }

  try {
    await updateCategory(categoryId, name);
    req.flash('success', 'Category updated successfully');
    res.redirect(`/category/${categoryId}`);
  } catch (error) {
    console.error('Error updating category:', error);
    req.flash('error', 'Failed to update category');
    res.redirect(`/edit-category/${categoryId}`);
  }
};

export {
  showCategoriesPage,
  showOrganizationDetailsPage,
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryValidation
};
