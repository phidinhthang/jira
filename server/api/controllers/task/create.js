module.exports = async function create(req, res) {
  const {
    name,
    description,
    type,
    status,
    assigneeIds,
    reporterId,
    projectId,
    priority,
    dueAt,
    estimatedAt,
  } = req.body || {};

  const index = await Task.count({ project: projectId, status });

  console.log("index ", index);

  const task = await Task.create({
    name,
    description,
    type,
    status,
    assignees: assigneeIds,
    reporter: reporterId,
    project: projectId,
    priority,
    dueAt,
    index: index + 1,
    estimatedAt,
  }).fetch();

  return res.json(task);
};
