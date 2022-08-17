module.exports = async function _delete(req, res) {
  const taskId = req.param("id");

  const deletedTask = await Task.destroyOne({ id: taskId });

  return res.json(deletedTask);
};
