const build = require("../app");
const initialState = require("../initial-notes-state");
const uuid = require("uuid");
jest.mock("uuid");

test("initial state is returned when GET the '/' route", async () => {
  const app = build();
  const allDataResponse = await app.inject({
    method: "GET",
    url: "/notes/"
  });
  expect(allDataResponse.statusCode).toBe(200);
  expect(allDataResponse.json().notes.length).toBe(3);
});

test("search matches note containing the text", async () => {
  const app = build();
  const allDataResponse = await app.inject({
    method: "GET",
    url: "/notes/?search=OF"
  });
  expect(allDataResponse.statusCode).toBe(200);
  expect(allDataResponse.json().notes.length).toBe(2);
});

test("search matches note containing all words in the text", async () => {
  const app = build();
  const allDataResponse = await app.inject({
    method: "GET",
    url: "/notes/?search=Star of films"
  });
  expect(allDataResponse.statusCode).toBe(200);
  expect(allDataResponse.json().notes.length).toBe(1);
});

test("POST to '/' route creates a new note", async () => {
  uuid.v4.mockImplementation(() => "fake-uuid-create");
  const app = build();
  const beforeTest = new Date().getTime();

  const createNoteResponse = await app.inject({
    method: "POST",
    url: "/notes/",
    body: {
      category: "testCategory",
      title: "testTitle",
      content: "testContent  unescape &amp; test <b>strip</b>"
    }
  });
  expect(createNoteResponse.statusCode).toBe(200);
  const {
    id,
    category,
    title,
    content,
    synopsis,
    searchIndex,
    date,
    folder
  } = createNoteResponse.json();
  expect(id).toBe("fake-uuid-create");
  expect(category).toBe("testCategory");
  expect(title).toBe("testTitle");
  expect(content).toBe("testContent  unescape &amp; test <b>strip</b>");
  expect(synopsis).toBe("testContent unescape & test strip");
  expect(date).toBeGreaterThan(beforeTest);
  expect(folder).toBe("notes");

  const allDataResponse = await app.inject({
    method: "GET",
    url: "/notes/"
  });
  expect(allDataResponse.statusCode).toBe(200);
  expect(allDataResponse.json().notes.length).toBe(4);
  expect(allDataResponse.json().notes.find(x => x.id === id)).toBeTruthy();
});

test("GET with meta returns counts by category", async () => {
  uuid.v4.mockImplementation(() => "fake-uuid-create");
  const app = build();
  await app.inject({
    method: "POST",
    url: "/notes/",
    body: {
      category: "newCategory",
      title: "testTitle 1",
      content: "testContent 1"
    }
  });

  let allDataResponse = await app.inject({
    method: "GET",
    url: "/notes/meta"
  });
  expect(allDataResponse.statusCode).toBe(200);
  expect(allDataResponse.json().categoryCounts.newCategory).toBe(1);

  await app.inject({
    method: "POST",
    url: "/notes/",
    body: {
      category: "newCategory",
      title: "testTitle 2",
      content: "testContent 2"
    }
  });

  allDataResponse = await app.inject({
    method: "GET",
    url: "/notes/meta"
  });
  expect(allDataResponse.statusCode).toBe(200);
  expect(allDataResponse.json().categoryCounts.newCategory).toBe(2);
});

test("GET with note id returns note", async () => {
  uuid.v4.mockImplementation(() => "fake-uuid-get");
  const app = build();

  const createNoteResponse = await app.inject({
    method: "POST",
    url: "/notes/",
    body: {
      category: "testCategory",
      title: "testTitle",
      content: "testContent"
    }
  });
  const { id: createdId } = createNoteResponse.json();

  const getNoteResponse = await app.inject({
    method: "GET",
    url: "/notes/" + createdId
  });
  expect(getNoteResponse.statusCode).toBe(200);
  const { id, category, title, content, date, folder } = getNoteResponse.json();
  expect(id).toBe(createdId);
  expect(category).toBe("testCategory");
  expect(title).toBe("testTitle");
  expect(content).toBe("testContent");
});

test("GET with invalid note id returns 404", async () => {
  const app = build();
  const response = await app.inject({
    method: "GET",
    url: "/notes/match-nothing"
  });
  expect(response.statusCode).toBe(404);
  expect(response.body).toBe("No note with id match-nothing found");
});

test("PATCH update to folder adjusts date, retains other fields", async () => {
  const app = build();
  const createNoteResponse = await app.inject({
    method: "POST",
    url: "/notes/",
    body: {
      category: "testCategory",
      title: "testTitle",
      content: "testContent"
    }
  });
  const { id, date: createdDate } = createNoteResponse.json();

  const updateNoteResponse = await app.inject({
    method: "PATCH",
    url: "/notes/" + id,
    body: {
      folder: "deleted"
    }
  });
  const {
    category,
    title,
    content,
    synopsis,
    folder,
    date: updatedDate
  } = updateNoteResponse.json();
  expect(category).toBe("testCategory");
  expect(title).toBe("testTitle");
  expect(content).toBe("testContent");
  expect(synopsis).toBe("testContent");
  expect(folder).toBe("deleted");
  expect(updatedDate).toBeGreaterThan(createdDate);
});

test("PATCH update to title, content adjusts date, retains other fields", async () => {
  const app = build();
  const createNoteResponse = await app.inject({
    method: "POST",
    url: "/notes/",
    body: {
      category: "testCategory",
      title: "testTitle",
      content: "testContent"
    }
  });
  const { id, date: createdDate } = createNoteResponse.json();

  const updateNoteResponse = await app.inject({
    method: "PATCH",
    url: "/notes/" + id,
    body: {
      category: "testCategory2",
      title: "testTitle2",
      content: "testContent2"
    }
  });
  const {
    category,
    title,
    content,
    synopsis,
    folder,
    date: updatedDate
  } = updateNoteResponse.json();
  expect(category).toBe("testCategory2");
  expect(title).toBe("testTitle2");
  expect(content).toBe("testContent2");
  expect(synopsis).toBe("testContent2");
  expect(folder).toBe("notes");
  expect(updatedDate).toBeGreaterThan(createdDate);
});

test("PATCH with invalid note id returns 404", async () => {
  const app = build();
  const response = await app.inject({
    method: "PATCH",
    url: "/notes/match-nothing"
  });
  expect(response.statusCode).toBe(404);
  expect(response.body).toBe("No note with id match-nothing found");
});

test("DELETE removes note", async () => {
  uuid.v4.mockImplementation(() => "fake-delete-uuid");
  const app = build();
  const createNoteResponse = await app.inject({
    method: "POST",
    url: "/notes/",
    body: {
      title: "testTitle",
      content: "testContent"
    }
  });
  const { id, date: createdDate } = createNoteResponse.json();

  await app.inject({
    method: "DELETE",
    url: "/notes/" + id
  });
  const retrieveAllResponse = await app.inject({
    method: "GET",
    url: "/notes/"
  });
  expect(retrieveAllResponse.json().notes.find(x => x.id === id)).toBeFalsy();
});

test("DELETE with invalid note id returns 404", async () => {
  const app = build();
  const response = await app.inject({
    method: "DELETE",
    url: "/notes/match-nothing"
  });
  expect(response.statusCode).toBe(404);
  expect(response.body).toBe("No note with id match-nothing found");
});
