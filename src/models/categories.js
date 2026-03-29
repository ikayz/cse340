import db from './db.js';

const getAllCategories = async () => {
  const query = `
    SELECT category_id, name
    FROM categories;
  `;

  const result = await db.query(query);
  return result.rows;
};
const getCategoryDetails = async categoryId => {
  const query = `
    SELECT category_id, name
    FROM categories
    WHERE category_id = $1;
  `;

  const query_params = [categoryId];
  const result = await db.query(query, query_params);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async projectId => {
  const query = `
    SELECT
      c.category_id,
      c.name
    FROM categories c
    JOIN project_categories pc ON c.category_id = pc.category_id
    WHERE pc.project_id = $1;
  `;

  const query_params = [projectId];
  const result = await db.query(query, query_params);
  return result.rows;
};

const assignCategoryToProject = async (projectId, categoryId) => {
  const query = `
    INSERT INTO project_categories (project_id, category_id)
    VALUES ($1, $2)
  `;

  const query_params = [projectId, categoryId];
  await db.query(query, query_params);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
  // First, remove existing category assignments for the project
  const deleteQuery = `
      DELETE FROM project_categories
      WHERE project_id = $1;
  `;
  await db.query(deleteQuery, [projectId]);

  // Next, add the new category assignments
  // Ensure we use the correct array or handle undefined
  const ids = Array.isArray(categoryIds) ? categoryIds : (categoryIds ? [categoryIds] : []);
  for (const categoryId of ids) {
      await assignCategoryToProject(projectId, categoryId);
  }
};

const createCategory = async (name) => {
  const query = `
    INSERT INTO categories (name)
    VALUES ($1)
    RETURNING category_id;
  `;

  const query_params = [name];
  const result = await db.query(query, query_params);

  if (result.rows.length === 0) {
    throw new Error('Failed to create category');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Created category with ID:', result.rows[0].category_id);
  }

  return result.rows[0].category_id;
};

const updateCategory = async (categoryId, name) => {
  const query = `
    UPDATE categories
    SET name = $1
    WHERE category_id = $2
    RETURNING category_id;
  `;

  const query_params = [name, categoryId];
  const result = await db.query(query, query_params);

  if (result.rows.length === 0) {
    throw new Error('Category not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated category with ID:', result.rows[0].category_id);
  }

  return result.rows[0].category_id;
};

export { getAllCategories, getCategoryDetails, getCategoriesByProjectId, assignCategoryToProject, updateCategoryAssignments, createCategory, updateCategory };
