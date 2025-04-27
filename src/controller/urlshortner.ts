import { Request, Response } from "express";
import UrlShortnerService from "../services/urlshortner";

class URLShortnerController {
  public async shortenUrl(req: Request, res: Response) {
    const response = await UrlShortnerService.shortenUrl(req.body);
    return res.status(200).json(response);
  }

  public async redirectShortenUrl(req: Request, res: Response) {
    const { code } = req.params;
    const originalUrl = await UrlShortnerService.getOriginalUrl(code);
    return res.redirect(originalUrl);
  }
}

export default URLShortnerController;
