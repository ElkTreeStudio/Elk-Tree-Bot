const { router, text, slack } = require('bottender/router');

async function sayHi(context) {
  await context.sendText('Hi~~~');
  await echo(context);
}

function log(context) {
  console.log(context.platform);
  console.log(context.client);
  console.log(context.event);
}

async function sayHello(context) {
  await context.sendText('Hello');
  await context.sendText('哇細呆丸郎');
}

async function echo(context) {
  await context.sendText(`Echo: ${ context.event.text }`);
}

module.exports = async function App(context) {
  return router([
    // return the `SayHi` action when receiving "hi" text messages
    text('hi', sayHi),
    // return the `SayHello` action when receiving "hello" text messages
    text('hello', sayHello),
    text('*', log),
  ]);
};
