const fastify = require("fastify");
const uuid = require("uuid");
const striptags = require("striptags");
const { unescape } = require("html-escaper");
const initialState = require("./initial-state");
const { PORT, SYNOPSIS_LENGTH } = require("./constants");

let state = [].concat(initialState);

function makeSynopsis(content) {
  const stripped = striptags(content, [], " ").replace(/\s+/g, " ").trim();
  return unescape(stripped).substring(0, SYNOPSIS_LENGTH);
}

function noNote(reply, noteId) {
  reply.status(404).send(`No note with id ${noteId} found`);
}

function build(opts = {}) {
  const app = fastify(opts);
  app.addHook("onSend", (request, reply, payload, done) => {
    reply.headers({ "access-control-allow-origin": "*" });
    done(null, payload);
  });

  app.options("/*", async (_, reply) => {
    reply
      .headers({
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST, GET, OPTIONS, PATCH, DELETE",
        "access-control-allow-headers": "*",
        "access-control-max-age": 86400
      })
      .send();
  });

  app.get("/", async (_, reply) => state);

  app.post("/", async (request, reply) => {
    const { body } = request;
    const { title, content, category } = body;
    const newNote = {
      id: uuid.v4(),
      title,
      content,
      category,
      synopsis: makeSynopsis(content),
      date: new Date().getTime(),
      folder: "notes"
    };
    state = [newNote].concat(state);
    return newNote;
  });

  app.get("/:noteId", async (request, reply) => {
    const { noteId } = request.params;
    const note = state.find(n => n.id === noteId);
    if (note) {
      return note;
    } else {
      noNote(reply, noteId);
    }
  });

  app.patch("/:noteId", async (request, reply) => {
    const { body, params } = request;
    const { noteId } = params;
    const { title, content, category, folder } = body || {};
    const hasCategory = body.hasOwnProperty('category');

    const noteIndex = state.findIndex(n => n.id === noteId);
    if (noteIndex < 0) {
      noNote(reply, noteId);
    } else {
      const previousNote = state[noteIndex];
      const newNote = {
        id: noteId,
        category: hasCategory ? category : previousNote.category,
        title: title || previousNote.title,
        content: content || previousNote.content,
        synopsis: content ? makeSynopsis(content) : previousNote.synopsis,
        date: new Date().getTime(),
        folder: folder || previousNote.folder
      };
      state[noteIndex] = newNote;
      return newNote;
    }
  });

  app.delete("/:noteId", async (request, reply) => {
    const { params } = request;
    const { noteId } = params;
    const noteIndex = state.findIndex(n => n.id === noteId);
    if (noteIndex < 0) {
      noNote(reply, noteId);
    } else {
      state = []
        .concat(state.slice(0, noteIndex))
        .concat(state.slice(noteIndex + 1, state.length));
      reply.status(204).send();
    }
  });

  return app;
}

module.exports = build;
