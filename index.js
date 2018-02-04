const logger = require('koa-logger');
const router = require('koa-router')();
const koaBody = require('koa-body');
const render = require('./lib/render');

const Koa = require('koa');
const app = (module.exports = new Koa());

// "database"

const posts = [];

// middleware

app.use(logger());

app.use(render);

app.use(koaBody());

app.use(render);

router.get('/', list).get('/post/new', add);

app.use(router.routes());

/**
 * Post listing.
 */

async function list(ctx) {
  await ctx.render('index');
}

/**
 * Show creation form.
 */

async function add(ctx) {
  await console.log('add');
}

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

app.listen(3000);
