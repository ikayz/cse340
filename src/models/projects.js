import db from './db.js';

const getAllProjects = async () => {
  const query = `
    SELECT
      sp.project_id,
      sp.title,
      sp.description,
      sp.location,
      sp.project_date,
      o.organization_id,
      o.name AS organization_name,
      o.logo_filename
    FROM service_projects sp
    JOIN organization o
      ON sp.organization_id = o.organization_id
    ORDER BY sp.project_date ASC;
  `;

  const result = await db.query(query);
  return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
  const query = `
    SELECT
      sp.project_id,
      sp.title,
      sp.description,
      sp.location,
      sp.project_date AS date,
      o.organization_id,
      o.name AS organization_name,
      o.logo_filename
    FROM service_projects sp
    JOIN organization o
      ON sp.organization_id = o.organization_id
    WHERE sp.project_date >= CURRENT_DATE
    ORDER BY sp.project_date ASC
    LIMIT $1;
  `;

  const query_params = [number_of_projects];
  const result = await db.query(query, query_params);
  return result.rows;
};

const getProjectsByOrganizationId = async organizationId => {
  const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          project_date
        FROM service_projects
        WHERE organization_id = $1
        ORDER BY project_date;
      `;

  const query_params = [organizationId];
  const result = await db.query(query, query_params);

  return result.rows;
};

const getProjectDetails = async projectId => {
  const query = `
    SELECT
      sp.project_id,
      sp.title,
      sp.description,
      sp.location,
      sp.project_date AS date,
      o.organization_id,
      o.name AS organization_name,
      o.logo_filename,
      c.category_id,
      c.name AS category_name
    FROM service_projects sp
    JOIN organization o ON sp.organization_id = o.organization_id
    LEFT JOIN project_categories pc ON sp.project_id = pc.project_id
    LEFT JOIN categories c ON pc.category_id = c.category_id
    WHERE sp.project_id = $1;
  `;

  const query_params = [projectId];
  const result = await db.query(query, query_params);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const getProjectsByCategoryId = async categoryId => {
  const query = `
    SELECT
      sp.project_id,
      sp.title,
      sp.description,
      sp.location,
      sp.project_date AS date,
      o.organization_id,
      o.name AS organization_name
    FROM service_projects sp
    JOIN organization o ON sp.organization_id = o.organization_id
    JOIN project_categories pc ON sp.project_id = pc.project_id
    WHERE pc.category_id = $1
    ORDER BY sp.project_date;
  `;

  const query_params = [categoryId];
  const result = await db.query(query, query_params);

  return result.rows;
};

const createProject = async (organizationId, title, description, location, projectDate) => {
  const query = `
    INSERT INTO service_projects (organization_id, title, description, location, project_date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;

  const query_params = [organizationId, title, description, location, projectDate];
  const result = await db.query(query, query_params);

  if (result.rows.length === 0) {
    throw new Error('Failed to create project');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Created project with ID:', result.rows[0].project_id);
  }

  return result.rows[0].project_id;
};

export { getAllProjects, getUpcomingProjects, getProjectsByOrganizationId, getProjectDetails, getProjectsByCategoryId, createProject };
