"use server"

import prisma from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"

export async function createOnRampTransaction(
  provider: string,
  amount: number
) {
  // Getting userId using next-auth
  const session = await getServerSession(authOptions)
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    }
  }
  // Just a dummy token
  // Idely the bank webhook server will return a token which we store here
  // this is just for learning purpose
  const token = (Math.random() * 1000).toString()

  await prisma.onRampTransaction.create({
    data: {
      provider,
      status: "Processing",
      startTime: new Date(),
      token: token,
      userId: Number(session?.user?.id),
      amount: amount * 100, // we should not store decimal value in the db
    },
  })

  return {
    message: "Done",
  }
}
