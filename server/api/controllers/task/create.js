module.exports = async function create(req, res) {
  const {
    name,
    description,
    type,
    assigneeIds,
    reporterId,
    projectId,
    priority,
  } = req.body || {};

  const errors = {};

  if (!name) {
    errors["emptyName"] = true;
  }
  if (!description) {
    errors["emptyDescription"] = true;
  }
  if (!type) {
    errors["emptyType"] = true;
  }
  if (!projectId) {
    errors["emptyProjectId"] = true;
  }
  if (!priority) {
    errors["emptyPriority"] = true;
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const index = await Task.count({ project: projectId, status: "backlog" });

  const task = await Task.create({
    name,
    description,
    type,
    status: "backlog",
    assignees: assigneeIds,
    reporter: reporterId,
    project: projectId,
    priority,
    index: index + 1,
  }).fetch();

  const taskId = task.id;

  return res.json(await Task.findOne({ id: taskId }).populate("assignees"));
};
