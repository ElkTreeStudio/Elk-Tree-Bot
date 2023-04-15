import * as functions from "firebase-functions";

export const slackNotify = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send({
    query: request.query,
    params: request.params,
    body: request.body,
  });
});
