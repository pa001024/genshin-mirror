import "reflect-metadata";

import { ApolloServer } from "apollo-server-fastify";
import Fastify from "fastify";
import jwt from "fastify-jwt";
import cookie from "fastify-cookie";
import middie from "middie";
import consola from "consola";
import { values } from "lodash";

require("dotenv").config();

const { build: buildNuxt, loadNuxt } = require("nuxt");

if (!process.env.BASE_URL) {
  consola.error(".env must have BASE_URL");
  process.exit(2);
}

// plugins
const build = async () => {
  const fastify = Fastify();

  await fastify.register(middie);
  // store user to context
  await fastify.register(jwt as any, {
    secret: process.env.JWT_SECRET,
    cookie: {
      cookieName: "apollo-token",
    },
  });
  fastify.register(cookie as any, {
    secret: process.env.COOKIE_SECRET, // for cookies signature
    parseOptions: {}, // options for parsing cookies
  });
  fastify.addHook("onRequest", async request => {
    try {
      await request.jwtVerify();
    } catch {}
  });

  const { createSchema } = require("./api");
  const apolloServer = new ApolloServer({
    schema: await createSchema(),
    context: ({ request, reply }) => ({ user: request.user, req: request, res: reply }),
    formatError: error => {
      if (error.message === "Argument Validation Error") {
        const msg = values(error.extensions!.exception.validationErrors[0].constraints)[0];
        error.message = msg;
        error.extensions!.code = "ARGUMENT_VALIDATION_ERROR";
        error.extensions!.exception = undefined;
      }
      return error;
    },
  });
  fastify.register(apolloServer.createHandler());
  // load nuxt with middie (a fastify-express bridge)
  const isDev = process.env.NODE_ENV !== "production";
  const nuxt = await loadNuxt(isDev ? "dev" : "start");
  if (isDev) buildNuxt(nuxt);
  fastify.use(nuxt.render);

  return fastify;
};

build()
  .then(fastify => {
    const PORT = +(process.env.PORT || 7333);
    fastify.listen(PORT, err => {
      if (err) consola.error(err);
      else consola.success(`Backend server started on ${process.env.BASE_URL}`);
    });
  })
  .catch(consola.error);
