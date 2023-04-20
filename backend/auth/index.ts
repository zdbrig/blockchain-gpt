import express from "express";
import cors from "cors";
const helmet = require("helmet");

import supertokens from "supertokens-node";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import {
  middleware,
  errorHandler,
  SessionRequest,
} from "supertokens-node/framework/express";
import { getWebsiteDomain, SuperTokensConfig } from "./config";

import { executeCommand } from "./callBlockchainGPT";
import bodyParser from "body-parser";


supertokens.init(SuperTokensConfig);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: getWebsiteDomain(),
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(
  helmet({
      contentSecurityPolicy: false,
  })
);
// This exposes all the APIs from SuperTokens to the client.
app.use(middleware());

// sessionIno API requires session verification
app.get("/sessioninfo", verifySession(), async (req: SessionRequest, res) => {
  let session = req.session;
  res.send({
    sessionHandle: session!.getHandle(),
    userId: session!.getUserId(),
    accessTokenPayload: session!.getAccessTokenPayload(),
  });
});

//refresh session and re-generate token
app.get("/session/refresh");


app.get("/check_login", verifySession(), (req: SessionRequest, res) => {
  if (req.session !== undefined) {
    let userId = req.session.getUserId();
    console.log("connected user ", userId);

    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

app.post("/gpt-test", verifySession(), async (req: SessionRequest, res) => {
  const input = req.body.command;
  if (req.session !== undefined) {
    let userId = req.session.getUserId();
    console.log("connected user ", userId);
    try {
      const response = await executeCommand(input);
      res.send(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.json({ loggedIn: false });
  }
});
// app.use('/api', app);

app.use(errorHandler());

app.use((err:any, req:any, res:any, next:any) => {
    res.status(500).send("Internal error: " + err.message);
});

app.listen(3001, () => console.log(`API Server listening on port 3001`));
