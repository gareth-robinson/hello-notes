const { PORT } = require("./constants");

const server = require("./app")({
  logger: {
    level: "info",
    prettyPrint: true
  }
});

server.listen(PORT, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});
