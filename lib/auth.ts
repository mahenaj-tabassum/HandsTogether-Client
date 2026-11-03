import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

// Create a MongoDB client using the database connection URL from environment variables.
const client = new MongoClient(process.env.MONGODB_DATABASE_URL as string);

// Select the "HandsTogether" database.
const db = client.db("HandsTogether");
export const auth = betterAuth({
  plugins: [jwt()],
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: process.env.BETTER_AUTH_CLIENT_URL,
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
