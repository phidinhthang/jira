module.exports = {
  attributes: {
    username: { type: "string", required: true, unique: true },
    password: { type: "string", required: true },
    user: {
      model: "user",
      unique: true,
    },
  },
};
