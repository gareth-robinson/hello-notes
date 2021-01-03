const fs = require("fs");
const en = require("./src/js/i18n/en");
const neJson = Object
  .keys(en)
  .reduce((acc, key) => {
    acc[key] = en[key].split("").reverse().join("");
    return acc;
  }, {});
const neCleaned = JSON.stringify(neJson, null, 2);
const neString = `module.exports = ${neCleaned};
`;

fs.writeFileSync("./src/js/i18n/ne.js", neString);
