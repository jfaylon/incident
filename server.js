require('dotenv').config();
const express = require('express');
const cors = require('cors');
const expressSession = require('express-session');
const next = require('next');
const passport = require('passport');
const { createServer } = require('https');
const { parse } = require('url');
const dev = process.env.NODE_ENV !== 'production';
const port = 3000;
const dbConnect = require('./lib/dbConnect');

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(expressSession({ secret: process.env.SESSION_SECRET, maxAge: null })); //session secret
  server.use(passport.initialize());
  server.use(passport.session()); //persistent login session
  server.use(
    cors({
      credentials: true,
      exposedHeaders: ['set-cookie'],
    })
  );
  server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  server.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });
  if (dev) {
    server.listen(port, async err => {
      if (err) throw err;
      await dbConnect();
      console.log(`> Ready on http://localhost:${port}`);
    });
  } else {
    createServer({}, (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(3000, err => {
      if (err) throw err;
      console.log('> Server started on https://localhost:3000');
    });
  }
});
