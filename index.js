const config = require("./config/config");

const { NODE_ENV = config.NODE_ENV } = process.env;

if (NODE_ENV !== "production") {
  require("dotenv").config();
}

const v1ApiRoutes = require("./routes/v1/");

const { 
  HOST = config.HOST,
  PORT = config.PORT
} = process.env;

const fastify = require("fastify")({
  logger: NODE_ENV !== "production" ? process.env.LOGGER : false
});

fastify.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "origin, token, x-origin, auth");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
  next();
});

fastify.get("/", (req, res) => res.send("Welcome to The MedicSoft"));

// register API routes
for (let apiRoute of v1ApiRoutes) {
  for (let route of apiRoute) {
    fastify.route(route);
  }
}

fastify.listen(PORT, HOST, err => {
  try {
    if (err) throw err;

    if (!HOST || !PORT) {
      throw new Error("either HOST or, PORT is undefined");
    }

    console.log(`App Running on, http://${HOST}:${PORT}/`);
  } catch (err) {
    console.error(err.message);
  }
});

exports.fastify = fastify;
