module.exports = {
  attributes: {
    displayName: { type: "string", required: true },
    avatar: { type: "string" },
    assignedTasks: {
      collection: "task",
      via: "assignees",
    },
    reportedTasks: {
      collection: "task",
      via: "reporter",
    },
    auth: {
      collection: "auth",
      via: "user",
    },
  },
};
