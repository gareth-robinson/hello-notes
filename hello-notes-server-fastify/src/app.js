const fastify = require("fastify");
const uuid = require("uuid");
const striptags = require("striptags");
const initialState = require("./initial-state");
const { PORT, SYNOPSIS_LENGTH } = require("./constants");

let state = [].concat(initialState);

function makeSynopsis(content) {
  return striptags(content, [], " ")
    .replace(/\s+/g, " ")
    .substring(0, SYNOPSIS_LENGTH);
}

function noNote(reply, noteId) {
  reply.status(404).send(`No note with id ${noteId} found`);
}

function build(opts = {}) {
  const app = fastify(opts);
  app.get("/", async (request, reply) => state);

  app.post("/", async (request, reply) => {
    const { body } = request;
    const { title, content } = body;
    const newNote = {
      id: uuid.v4(),
      title,
      content,
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
      reply.send(note);
    } else {
      noNote(reply, noteId);
    }
  });

  app.patch("/:noteId", async (request, reply) => {
    const { body, params } = request;
    const { noteId } = params;
    const { title, content, folder } = body || {};

    const noteIndex = state.findIndex(n => n.id === noteId);
    if (noteIndex < 0) {
      noNote(reply, noteId);
    } else {
      const previousNote = state[noteIndex];
      const newNote = {
        id: noteId,
        title: title || previousNote.title,
        content: content || previousNote.content,
        synposis: content ? makeSynopsis(content) : previousNote.content,
        date: new Date().getTime(),
        folder: folder || previousNote.folder
      };
      state[noteIndex] = newNote;
      return newNote;
    }
  });

  return app;
}

module.exports = build;
