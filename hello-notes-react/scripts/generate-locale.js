const readable = process.stdin;
const fs = require("fs");

let stream = "";
readable.on("readable", () => {
  while (null !== (chunk = readable.read())) {
    stream += chunk;
  }
});
readable.on("end", () => {
  const enJson = JSON.parse(stream);
  const neJson = Object.keys(enJson).reduce((acc, key) => {
    acc[key] = enJson[key].split("").reverse().join("");
    return acc;
  }, {});

  const en = `module.exports = ${JSON.stringify(enJson, null, 2)};`;
  fs.writeFileSync("./src/js/i18n/en.js", en);

  const ne = `module.exports = ${JSON.stringify(neJson, null, 2)};`;
  fs.writeFileSync("./src/js/i18n/ne.js", ne);
});
