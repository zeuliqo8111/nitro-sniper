const express = require('express');
const fetch = require('node-fetch');

module.exports = class Dashboard {
  constructor() {
    this.server = null;
    this.port = null;
    this.listener = null;

    this.start();
  }
  
  keepAlive() {
    const { REPL_SLUG, REPL_OWNER } = process.env;
    if (!REPL_OWNER || !REPL_SLUG) return;

    const url = `https://${REPL_SLUG}.${REPL_OWNER}.repl.co/`;
    setInterval(async () => {
      await fetch(url).then(res => {
        if(res.status == 200) logger.debug(`Pinged URL ${url}`)
      })
    }, 1000)
  }

  start() {
    this.server = express();
    this.attachListeners();
    this.keepAlive();

    // To be continued...
  }

  attachListeners() {
    this.listener = this.server.listen(process.env.PORT, () => {
      this.port = this.listener.address().port;
      logger.debug(`Pinger listening on ${this.port}.`);
    })

    this.server.all('/', (req, res) => {
      res.send('Your bot is alive!');
    })
  }
}