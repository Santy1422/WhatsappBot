// import { OAuth2Client } from "google-auth-library";

// import { GOOGLE_CLIENT_ID } from "./env";

// const client = new OAuth2Client(GOOGLE_CLIENT_ID);


//   async function verifyGoogleToken(token:string) {
//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: GOOGLE_CLIENT_ID,
//     });
//     return { payload: ticket.getPayload() };
//   } catch (error) {
//     return { error: "Invalid user detected. Please try again" };
//   }
// }
// export default verifyGoogleToken