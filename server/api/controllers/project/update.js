module.exports = async function update(req, res) {
  const projectId = req.param("id");
  const body = req.body;
  console.log("body ", body);
  const updatedProject = await Project.updateOne({ id: projectId }).set({
    ...body,
  });

  return res.json(updatedProject);
};
