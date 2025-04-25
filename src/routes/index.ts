import express from "express";
import { celebrate, Joi, Segments } from "celebrate";
import ShortenUrl from "../controller/urlshortner";

const route = express.Router();
const shortenURLController = new ShortenUrl();

// http://localhost:<port>/api/v1/shorten
// http://localhost:<port>/brevis/v1/shorten
route.post(
  "/shorten",
  celebrate({
    [Segments.BODY]: Joi.object({
      longURL: Joi.string().required().uri().messages({
        "string.empty": "URL is required",
        "string.uri": "Please provide a valid URL",
      }),
    }).required(),
  }),
  shortenURLController.shortenUrl
);

route.get(
  "/:code",
  celebrate({
    [Segments.PARAMS]: Joi.object({
      code: Joi.string().required().messages({
        "string.empty": "Short code is required",
        "any.required": "Short code is required",
      }),
    }),
  }),
  shortenURLController.redirectShortenUrl
);

export { route as shortUrlRoute };
