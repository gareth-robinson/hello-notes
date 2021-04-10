const fastify = require("fastify");
const initialCategoriesState = require("./initial-categories-state");
const initialNotesState = require("./initial-notes-state");
const { NOTES, CATEGORIES } = require("./constants");

function build(opts = {}) {
  const app = fastify(opts);
  const state = {
    notes: initialNotesState,
    categories: initialCategoriesState
  };

  app.addHook("onSend", (request, reply, payload, done) => {
    reply.headers({ "access-control-allow-origin": "*" });
    done(null, payload);
  });

  app.options("/*", async (_, reply) => {
    reply
      .headers({
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "OPTIONS, GET, POST, PATCH, PUT,DELETE",
        "access-control-allow-headers": "*",
        "access-control-max-age": 86400
      })
      .send();
  });

  app.get("/", async (request, rep) => {
    return {
      _links: {
        self: `http://${request.hostname}/`,
        categories: `http://${request.hostname}/${CATEGORIES}/`,
        notes: `http://${request.hostname}/${NOTES}/`
      }
    };
  });

  app.register(require("./routes/categories")(state), {
    prefix: `/${CATEGORIES}`
  });
  app.register(require("./routes/notes")(state), { prefix: `/${NOTES}` });

  return app;
}

module.exports = build;
