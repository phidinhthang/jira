module.exports = {
  attributes: {
    payload: {
      type: "string",
      required: true,
      unique: true,
    },
    userId: {
      type: "string",
      required: true,
    },
  },
};
