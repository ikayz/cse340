import {
  getAllOrganizations,
  getOrganizationDetails,
} from '../models/organizations.js';
import { getProjectsByOrganizationId, getProjectsByCategoryId, getProjectDetails } from '../models/projects.js';
import { getAllCategories, getCategoryDetails, getCategoriesByProjectId, updateCategoryAssignments } from '../models/categories.js';

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

export { showCategoriesPage, showOrganizationDetailsPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm };
