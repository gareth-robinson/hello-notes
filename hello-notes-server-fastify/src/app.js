const fastify = require("fastify");
const uuid = require("uuid");
const striptags = require("striptags");
const { unescape } = require("html-escaper");
const initialState = require("./initial-state");
const { PORT, SYNOPSIS_LENGTH } = require("./constants");

let state = initialState.map(x => ({
  ...x,
  ...calculatedFields(x)
}));

function calculatedFields(note) {
  const { content = "", title = "" } = note;
  const cleanedContent = unescape(
    striptags(content, [], " ").replace(/\s+/g, " ").trim()
  );
  return {
    synopsis: cleanedContent.substring(0, SYNOPSIS_LENGTH),
    searchIndex: `${title} ${cleanedContent}`.toLowerCase()
  };
}

function noNote(reply, noteId) {
  reply.status(404).send(`No note with id ${noteId} found`);
}

function wrapped(note) {
  return {
    "@id": `http://localhost:${PORT}/${note.id}`,
    ...note,
    searchIndex: undefined
  };
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

  app.get("/", async (request, reply) => {
    const { query } = request;
    const { search } = query;
    if (!search) {
      return state.map(wrapped);
    }
    // very basic search implementation
    const words = search
      .split(" ")
      .map(x => x.trim().toLowerCase())
      .filter(x => x);
    return state
      .filter(x => words.every(w => x.searchIndex.includes(w)))
      .map(wrapped);
  });

  app.post("/", async (request, reply) => {
    const { body } = request;
    const { title, content, category } = body;
    const newNote = {
      id: uuid.v4(),
      title,
      content,
      category,
      date: new Date().getTime(),
      folder: "notes",
      ...calculatedFields({ title, content })
    };
    state = [newNote].concat(state);
    return newNote;
  });

  app.get("/:noteId", async (request, reply) => {
    const { noteId } = request.params;
    const note = state.find(n => n.id === noteId);
    if (note) {
      return wrapped(note);
    } else {
      noNote(reply, noteId);
    }
  });

  app.patch("/:noteId", async (request, reply) => {
    const { body, params } = request;
    const { noteId } = params;

    const noteIndex = state.findIndex(n => n.id === noteId);
    if (noteIndex < 0) {
      noNote(reply, noteId);
    } else {
      const { title, content, category, folder } = body || {};
      const hasCategory = body.hasOwnProperty("category");
      const previousNote = state[noteIndex];
      const additional = content
        ? calculatedFields({ title, content })
        : {
            synopsis: previousNote.synopsis,
            searchIndex: previousNote.searchIndex
          };
      const newNote = {
        id: noteId,
        category: hasCategory ? category : previousNote.category,
        title: title || previousNote.title,
        content: content || previousNote.content,
        date: new Date().getTime(),
        folder: folder || previousNote.folder,
        ...additional
      };
      state[noteIndex] = newNote;
      return wrapped(newNote);
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
