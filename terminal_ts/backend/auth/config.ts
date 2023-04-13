import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";
import Dashboard from "supertokens-node/recipe/dashboard";

import dotenv from 'dotenv';

dotenv.config();

export function getApiDomain() {
    const apiPort = process.env.REACT_APP_API_PORT || 3001;
    const apiUrl = process.env.REACT_APP_API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = process.env.REACT_APP_WEBSITE_PORT || 3000;
    const websiteUrl = process.env.REACT_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

export const SuperTokensConfig: TypeInput = {
    supertokens: {
        // this is the location of the SuperTokens core.
        connectionURI: "https://dev-2acbad11d94711ed81dedf131734f418-eu-west-1.aws.supertokens.io:3570",
        apiKey:"JuHwaSIRdGeb5xzp=MnTQRfDoT90QF"
    },
    appInfo: {
        appName: "Blockcahin Terminal",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
        websiteBasePath: "/auth"
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
        ThirdPartyEmailPassword.init({
            providers: [
                // We have provided you with development keys which you can use for testing.
                // IMPORTANT: Please replace them with your own OAuth keys for production use.
                ThirdPartyEmailPassword.Google({
                    clientId:'901750243005-bka0vtgt262n1ivj8pe5i8dtfvbkqqgh.apps.googleusercontent.com',
                    clientSecret: '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'
                }),
                // ThirdPartyEmailPassword.Github({
                //     clientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd",
                //     clientId: "467101b197249757c71f",
                // }),
                // ThirdPartyEmailPassword.Apple({
                //     clientId: "4398792-io.supertokens.example.service",
                //     clientSecret: {
                //         keyId: "7M48Y4RYDL",
                //         privateKey:
                //             "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
                //         teamId: "YWQCXGJRJL",
                //     },
                // }),
            ],
        }),
        Dashboard.init(),
        Session.init(),
    ],
};
