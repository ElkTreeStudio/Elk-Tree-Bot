import * as functions from 'firebase-functions';
import { sendMessageFromBot } from './sendSlackMessage';
import * as cors from "cors";

const corsSettings = cors({ origin: true });

export const slackToContact = functions.https.onRequest(async(request, response) => {
  corsSettings(request, response, async() => {
    const {
      companyTitle,
      name,
      email,
      info
    } = request.body;
    const message = `
      ✨✨✨✨✨✨ Order Notification ✨✨✨✨✨✨ \n
      🔖 Company: ${ companyTitle } \n
      🌈 Name: ${ name } \n
      🚀 Email: ${ email } \n
      👷 Info: ${ info } \n
    `;
    const result = await sendMessageFromBot('contact_from_web', message);

    response.send({
      query: request.query,
      params: request.params,
      body: request.body,
      project: process.env.PROJECT_NAME,
      result: result
    });
  });
  
});
