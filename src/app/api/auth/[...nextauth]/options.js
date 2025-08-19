import CredentialsProvider from "next-auth/providers/credentials";
import { connectDb } from "../../../../../lib/mongo";
import User from "../../../../../models/users";
import bcrypt from "bcryptjs";

export const options = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          // connect to DB
          await connectDb();

          // find user
          const existingUser = await User.findOne({ email });
          if (!existingUser) {
            console.log("User not found");
            return null;
          }

          // compare password
          const isMatch = await bcrypt.compare(password, existingUser.password);
          if (!isMatch) {
            console.log("Invalid credentials");
            return null;
          }

          // return user data to NextAuth
          return {
            user_id: existingUser._id.toString(),
            name: existingUser.name,
            email: existingUser.email,
          };
        } catch (error) {
          console.log("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.user_id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
