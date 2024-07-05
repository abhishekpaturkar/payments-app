// import NextAuth from "next-auth"
// import { authOptions } from "../../../../lib/auth"

// export { handler as GET, handler as POST }

import NextAuth, { type NextAuthOptions } from "next-auth"
import { authOptions } from "../../../../lib/auth"

const handler = NextAuth(authOptions as NextAuthOptions)

export { handler as GET, handler as POST }
