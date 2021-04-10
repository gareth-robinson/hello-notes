const { CATEGORIES, META } = require("../constants");

module.exports = function (initialState) {
  let state = initialState.categories;
  const wrapped = request => {
    return {
      _links: {
        self: `http://${request.hostname}/${CATEGORIES}`
      },
      categories: state
    };
  };

  return function (app, opts, done) {
    app.get("/", async (request, reply) => {
      return wrapped(request);
    });

    app.put("/", async (request, reply) => {
      const { body } = request;
      state = body;
      return wrapped(request);
    });

    done();
  };
};
