module.exports = async function create(req, res) {
  const { name, url, description, category } = req.body || {};
  const errors = {};

  if (!name) {
    errors["emptyName"] = true;
  }
  if (!url) {
    errors["emptyUrl"] = true;
  }
  if (!description) {
    errors["emptyDescription"] = true;
  }
  if (!category) {
    errors["emptyCategory"] = true;
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  const project = await Project.create({
    name,
    url,
    description,
    category,
  }).fetch();
  return res.json(project);
};
