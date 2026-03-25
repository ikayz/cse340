import {
  getAllOrganizations,
  getOrganizationDetails,
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

const showOrganizationsPage = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = 'Our Partner Organizations';

  res.render('organizations', { title, organizations, path: req.path });
};

const showOrganizationDetailsPage = async (req, res) => {
  const organizationId = req.params.id;
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

const showNewOrganizationForm = async (req, res) => {
  const title = 'Add New Organization';
  res.render('new-organization', { title, path: req.path });
};

export {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
};
