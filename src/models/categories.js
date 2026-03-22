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

export { getAllCategories, getCategoryDetails, getCategoriesByProjectId };
