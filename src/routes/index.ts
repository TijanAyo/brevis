import express, { query } from "express";
import { z } from "zod";
import { celebrate, Joi, Segments } from "celebrate";
import ShortenUrl from "../controller/shortenUrl";

const route = express.Router();
const shortenURLController = new ShortenUrl();

// http://localhost:<port>/api/v1/unshorten?code=qwerty
// http://localhost:<port>/brevis/v1/unshorten?code=qwerty
route.get(
  "/unshorten",
  celebrate({
    [Segments.QUERY]: Joi.object({
      code: Joi.string().trim().required().min(7).max(7),
    }),
  }),
  shortenURLController.redirectShortenUrl
);

// http://localhost:<port>/api/v1/shorten
// http://localhost:<port>/brevis/v1/shorten
route.post(
  "/shorten",
  celebrate({
    [Segments.BODY]: Joi.object({
      longURL: Joi.string().trim().required(),
    }).required(),
  }),
  shortenURLController.shortenUrl
);

export { route as shortUrlRoute };
