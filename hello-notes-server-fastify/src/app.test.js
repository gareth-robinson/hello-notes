const build = require("./app");

test("links returned when GET the '/' route", async () => {
  const app = build();
  const allDataResponse = await app.inject({
    method: "GET",
    url: "/"
  });

  expect(allDataResponse.statusCode).toBe(200);
  const responseJson = allDataResponse.json();
  const { _links } = responseJson;
  expect(_links.self).toBe("http://localhost:80/");
  expect(_links.categories).toBe("http://localhost:80/categories/");
  expect(_links.notes).toBe("http://localhost:80/notes/");
});
