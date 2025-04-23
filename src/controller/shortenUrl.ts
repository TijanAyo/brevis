import { Request, Response } from "express";

class ShortenUrl {
  public async shortenUrl(req: Request, res: Response) {
    return res.send("shorten url here");
  }

  public async redirectShortenUrl(req: Request, res: Response) {
    let query = req.query.code;
    return res.json(query);
  }
}

export default ShortenUrl;
