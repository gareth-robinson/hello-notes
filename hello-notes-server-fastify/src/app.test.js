const build = require("./app");
const initialState = require("./initial-state");
const uuid = require("uuid");
const striptags = require("striptags");

jest.mock("uuid");
jest.mock("striptags");

test("initial state is returned when GET the '/' route", async () => {
  const app = build();
  const allDataResponse = await app.inject({
    method: "GET",
    url: "/"
  });
  expect(allDataResponse.statusCode).toBe(200);
  expect(allDataResponse.json().length).toBe(3);
});

test("POST to '/' route creates a new note", async () => {
  uuid.v4.mockImplementation(() => "fake-uuid-create");
  striptags.mockImplementation(() => "stripped");
  const app = build();
  const beforeTest = new Date().getTime();

  const createNoteResponse = await app.inject({
    method: "POST",
    url: "/",
    body: {
      title: "testTitle",
      content: "testContent"
    }
  });
  expect(createNoteResponse.statusCode).toBe(200);
  const {
    id,
    title,
    content,
    synopsis,
    date,
    folder
  } = createNoteResponse.json();
  expect(id).toBe("fake-uuid-create");
  expect(title).toBe("testTitle");
  expect(content).toBe("testContent");
  expect(synopsis).toBe("stripped");
  expect(date).toBeGreaterThan(beforeTest);
  expect(folder).toBe("notes");

  const allDataResponse = await app.inject({
    method: "GET",
    url: "/"
  });
  expect(allDataResponse.statusCode).toBe(200);
  expect(allDataResponse.json().length).toBe(4);
  expect(allDataResponse.json().find(x => x.id === id)).toBeTruthy();
});

test("GET with note id returns note", async () => {
  uuid.v4.mockImplementation(() => "fake-uuid-get");
  striptags.mockImplementation(() => "stripped");
  const app = build();
  const beforeTest = new Date().getTime();

  const createNoteResponse = await app.inject({
    method: "POST",
    url: "/",
    body: {
      title: "testTitle",
      content: "testContent"
    }
  });
  const { id: createdId } = createNoteResponse.json();

  const getNoteResponse = await app.inject({
    method: "GET",
    url: "/" + createdId
  });
  expect(getNoteResponse.statusCode).toBe(200);
  const { id, title, content, synopsis, date, folder } = getNoteResponse.json();
  expect(id).toBe(createdId);
  expect(title).toBe("testTitle");
  expect(content).toBe("testContent");
  expect(synopsis).toBe("stripped");
  expect(date).toBeGreaterThan(beforeTest);
  expect(folder).toBe("notes");
});

test("GET with invalid note id returns 404", async () => {
  const app = build();
  const response = await app.inject({
    method: "GET",
    url: "/match-nothing"
  });
  expect(response.statusCode).toBe(404);
  expect(response.body).toBe("No note with id match-nothing found");
});

test("PATCH update to folder adjusts date, retains other fields", async () => {
  striptags.mockImplementation(x => x);
  const app = build();
  const createNoteResponse = await app.inject({
    method: "POST",
    url: "/",
    body: {
      title: "testTitle",
      content: "testContent"
    }
  });
  const { id, date: createdDate } = createNoteResponse.json();

  const updateNoteResponse = await app.inject({
    method: "PATCH",
    url: "/" + id,
    body: {
      folder: "deleted"
    }
  });
  const {
    title,
    content,
    synopsis,
    folder,
    date: updatedDate
  } = updateNoteResponse.json();
  expect(title).toBe("testTitle");
  expect(content).toBe("testContent");
  expect(synopsis).toBe("testContent");
  expect(folder).toBe("deleted");
  expect(updatedDate).toBeGreaterThan(createdDate);
});

test("PATCH update to title, content adjusts date, retains other fields", async () => {
  striptags.mockImplementation(x => x);
  const app = build();
  const createNoteResponse = await app.inject({
    method: "POST",
    url: "/",
    body: {
      title: "testTitle",
      content: "testContent"
    }
  });
  const { id, date: createdDate } = createNoteResponse.json();

  const updateNoteResponse = await app.inject({
    method: "PATCH",
    url: "/" + id,
    body: {
      title: "testTitle2",
      content: "testContent2"
    }
  });
  const {
    title,
    content,
    synopsis,
    folder,
    date: updatedDate
  } = updateNoteResponse.json();
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
    url: "/match-nothing"
  });
  expect(response.statusCode).toBe(404);
  expect(response.body).toBe("No note with id match-nothing found");
});

test("DELETE removes note", async () => {
  uuid.v4.mockImplementation(() => "fake-delete-uuid");
  const app = build();
  const createNoteResponse = await app.inject({
    method: "POST",
    url: "/",
    body: {
      title: "testTitle",
      content: "testContent"
    }
  });
  const { id, date: createdDate } = createNoteResponse.json();

  await app.inject({
    method: "DELETE",
    url: "/" + id
  });
  const retrieveAllResponse = await app.inject({
    method: "GET",
    url: "/"
  });
  expect(retrieveAllResponse.json().find(x => x.id === id)).toBeFalsy();
});

test("DELETE with invalid note id returns 404", async () => {
  const app = build();
  const response = await app.inject({
    method: "DELETE",
    url: "/match-nothing"
  });
  expect(response.statusCode).toBe(404);
  expect(response.body).toBe("No note with id match-nothing found");
});
