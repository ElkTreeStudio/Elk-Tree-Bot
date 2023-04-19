import * as functions from "firebase-functions";

export const healthCheck = functions.https.onRequest((req, res) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  res.send("Hello from Firebase!");
});
