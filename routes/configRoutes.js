const indexR = require("./index");
const studentsR = require("./students");

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/students", studentsR);

}

