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

  const index = await Task.count({ project: projectId, status: "backlog" });

  console.log("index ", index);

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
