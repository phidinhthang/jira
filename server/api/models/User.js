module.exports = {
  attributes: {
    displayName: { type: "string", required: true },
    avatar: {
      type: "string",
      defaultsTo:
        "https://res.cloudinary.com/dx1jwn9cz/image/upload/v1660810434/jira/default-avatar-2_r0vfmt.webp",
    },
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
    isVerified: { type: "boolean", defaultsTo: false },
  },
};
