const build = require("../app");
const initialState = require("../initial-categories-state");
const uuid = require("uuid");
jest.mock("uuid");

test("initial state is returned when GET the '/' route", async () => {
  const app = build();
  const allDataResponse = await app.inject({
    method: "GET",
    url: "/categories/"
  });
  expect(allDataResponse.statusCode).toBe(200);
  const { categories } = allDataResponse.json();
  expect(categories).toStrictEqual(initialState);
});

test("PUT to '/' replaces the state", async () => {
  const app = build();
  const newState = {
    mauve: {
      title: "Mauve",
      enabled: true
    }
  };
  const putDataResponse = await app.inject({
    method: "PUT",
    url: "/categories/",
    body: newState
  });
  expect(putDataResponse.statusCode).toBe(200);
  const { categories: putCategories } = putDataResponse.json();
  expect(putCategories).toStrictEqual(newState);

  const allDataResponse = await app.inject({
    method: "GET",
    url: "/categories/"
  });
  expect(allDataResponse.statusCode).toBe(200);
  const { categories: getCategories } = allDataResponse.json();
  expect(getCategories).toStrictEqual(newState);
});
