const build = require("./app");
const initialState = require("./initial-state");
const uuid = require("uuid");
const striptags = require("striptags");

jest.mock("uuid");
jest.mock("striptags");

test("initial state is returned when GET the '/' route", async () => {
  const app = build();
  const response = await app.inject({
    method: "GET",
    url: "/"
  });
  expect(response.statusCode).toBe(200);
  expect(response.json().length).toBe(3);
});

test("POST to '/' route creates a new note", async () => {
  uuid.v4.mockImplementation(() => "fake-uuid");
  striptags.mockImplementation(() => "stripped");
  const app = build();
  const beforeTest = new Date().getTime();

  const response = await app.inject({
    method: "POST",
    url: "/",
    body: {
      title: "testTitle",
      content: "testContent"
    }
  });
  expect(response.statusCode).toBe(200);
  expect(response.json().id).toBe("fake-uuid");
  expect(response.json().title).toBe("testTitle");
  expect(response.json().content).toBe("testContent");
  expect(response.json().synopsis).toBe("stripped");
  expect(response.json().date).toBeGreaterThan(beforeTest);
  expect(response.json().folder).toBe("notes");

  const allData = await app.inject({
    method: "GET",
    url: "/"
  });
  expect(allData.statusCode).toBe(200);
  expect(allData.json().length).toBe(4);
  expect(allData.json().find(x => x.id === "fake-uuid")).toBeTruthy();
});

test("GET with note id returns note", async () => {
  uuid.v4.mockImplementation(() => "fake-uuid");
  striptags.mockImplementation(() => "stripped");
  const app = build();
  const beforeTest = new Date().getTime();

  await app.inject({
    method: "POST",
    url: "/",
    body: {
      title: "testTitle",
      content: "testContent"
    }
  });

  const response = await app.inject({
    method: "GET",
    url: "/fake-uuid"
  });
  expect(response.statusCode).toBe(200);
  const {id, title, content, synopsis, date, folder} = response.json();
  expect(id).toBe("fake-uuid");
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
  expect(response.body).toBe("No note with id match-nothing found")
});

test("PATCH update to folder adjusts date, retains other fields", async () => {
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
  const { title, content, folder, date: updatedDate } = updateNoteResponse.json();
  expect(title).toBe("testTitle");
  expect(content).toBe("testContent");
  expect(folder).toBe("deleted");
  expect(updatedDate).toBeGreaterThan(createdDate);
});

test("PATCH update to title, content adjusts date, retains other fields", async () => {
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
  const { title, content, folder, date: updatedDate } = updateNoteResponse.json();
  expect(title).toBe("testTitle2");
  expect(content).toBe("testContent2");
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
  expect(response.body).toBe("No note with id match-nothing found")
});