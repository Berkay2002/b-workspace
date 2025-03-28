// convex/auth.config.ts

import { ConvexError } from "convex/values";
import { DatabaseReader, DatabaseWriter } from "./_generated/server";

interface Token {
  sub: string;
  name: string;
  email: string;
}

interface AuthContext {
  db: DatabaseReader & DatabaseWriter;
}

const authConfig = {
  providers: [
    {
      domain: "https://worthy-sailfish-92.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
  getUserIdentity: async (ctx: AuthContext, token: Token) => {
    if (!token) {
      throw new ConvexError("Unauthorized");
    }

    const { sub, name, email } = token;
    if (!sub || !name || !email) {
      throw new ConvexError("Invalid token");
    }

    // Get or create user
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), sub))
      .first();

    if (user) {
      return {
        identity: user._id,
        name,
        email,
      };
    }

    const userId = await ctx.db.insert("users", {
      clerkId: sub,
      name,
      email,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      identity: userId,
      name,
      email,
    };
  },
};

export default authConfig;
