module.exports = {
  attributes: {
    name: { type: "string", required: true },
    url: { type: "string", required: true },
    description: { type: "string", required: true },
    category: {
      type: "string",
      required: true,
      isIn: ["software", "marketing", "business"],
    },
    tasks: {
      collection: "task",
      via: "project",
    },
  },
};
