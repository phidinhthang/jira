module.exports = {
  attributes: {
    name: {
      type: "string",
      required: true,
    },
    index: {
      type: "number",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    type: {
      type: "string",
      isIn: ["task", "bug", "story"],
      required: true,
    },
    status: {
      type: "string",
      isIn: ["backlog", "selected_for_development", "in_progress", "done"],
      required: true,
    },
    assignees: {
      collection: "user",
      via: "assignedTasks",
    },
    reporter: {
      model: "user",
      required: true,
    },
    project: {
      model: "project",
      required: true,
    },
    priority: {
      type: "string",
      isIn: ["lowest", "low", "medium", "high", "highest"],
      required: true,
    },
    estimatedTime: {
      type: "number",
      allowNull: true,
    },
    spentTime: {
      type: "number",
      allowNull: true,
    },
    remainingTime: {
      type: "number",
      allowNull: true,
    },
    createdAt: {
      type: "ref",
      columnType: "datetime",
      autoCreatedAt: true,
    },
    updatedAt: {
      type: "ref",
      columnType: "datetime",
      autoUpdatedAt: true,
    },
  },
};
