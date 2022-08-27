import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { dbUser } from "../../../database";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: "Custom login",
      credentials: {
        email: {
          label: "Correo",
          type: "email",
          placeholder: "correo@google.com",
        },
        password: {
          label: "Contraseña",
          type: "password",
          placeholder: "contraseña",
        },
      },
      async authorize(credentials) {
        console.log(credentials);
        return await dbUser.validateUserEmailPass(
          credentials!.email,
          credentials!.password
        );
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // ...add more providers here
  ],
  //custompages
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  session: {
    maxAge: 2592000,
    strategy: "jwt",
    updateAge: 86400,
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        switch (account.type) {
          case "credentials":
            token.user = user;
            break;
          case "oauth":
            token.user = await dbUser.oAuthToDbUser(
              user?.email || "",
              user?.name || ""
            );
            break;
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    },
  },
});
