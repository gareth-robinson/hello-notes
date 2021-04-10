const uuid = require("uuid");
const striptags = require("striptags");
const { unescape } = require("html-escaper");
const { NOTES, META, SYNOPSIS_LENGTH } = require("../constants");

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

function wrapped(request, note) {
  return {
    _links: {
      self: `http://${request.hostname}/${NOTES}/${note.id}`
    },
    ...note,
    searchIndex: undefined
  };
}

module.exports = function (initialState) {
  let state = initialState.notes.map(x => ({
    ...x,
    ...calculatedFields(x)
  }));

  return function (app, opts, done) {
    app.get("/", async (request, reply) => {
      const { query } = request;
      const { search } = query;
      const asList = notes => ({
        _links: {
          self: `http://${request.hostname}${request.url}`,
          meta: `http://${request.hostname}/${NOTES}/${META}`
        },
        notes: notes.map(n => wrapped(request, n))
      });

      if (!search) {
        return asList(state);
      }
      // very basic search implementation
      const words = search
        .split(" ")
        .map(x => x.trim().toLowerCase())
        .filter(x => x);
      const found = state.filter(x =>
        words.every(w => x.searchIndex.includes(w))
      );
      return asList(found);
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
      return wrapped(request, newNote);
    });

    app.get("/meta", async (request, reply) => {
      const meta = state.reduce((acc, val) => {
        const { category = "none" } = val;
        if (acc[category]) {
          acc[category]++;
        } else {
          acc[category] = 1;
        }
        return acc;
      }, {});
      const data = {
        _links: {
          self: `http://${request.hostname}/${NOTES}/${META}`
        },
        categoryCounts: meta
      };
      reply.status(200).send(data);
    });

    app.get("/:noteId", async (request, reply) => {
      const { noteId } = request.params;
      const note = state.find(n => n.id === noteId);
      if (note) {
        return wrapped(request, note);
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
        return wrapped(request, newNote);
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

    done();
  };
};
