module.exports = async function create(req, res) {
  const { name, url, description, category } = req.body || {};

  const project = await Project.create({
    name,
    url,
    description,
    category,
  }).fetch();
  return res.json(project);
};
