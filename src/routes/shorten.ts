import express from "express";
import { celebrate, Joi, Segments } from "celebrate";
import ShortenUrl from "../controller/urlshortner";

const route = express.Router();
const shortenURLController = new ShortenUrl();

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

export { route as shortUrlRoute };
