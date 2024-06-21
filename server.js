import { createServer } from "https";
import { parse } from "url";
import next from "next";
import { readFileSync } from "fs";
import express from "express";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: readFileSync("./localhost-key.pem"),
  cert: readFileSync("./localhost.pem"),
};

app.prepare().then(() => {
  const server = express();

  server.get("*", (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  createServer(httpsOptions, server).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on https://localhost:3000");
  });
});
