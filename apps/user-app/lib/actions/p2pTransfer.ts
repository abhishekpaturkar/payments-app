"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client"

export async function p2pTransfer(to: string, amount: number) {
  const session = await getServerSession(authOptions)
  const from = session?.user?.id

  if (!from) {
    return {
      message: "Error while sending, login first",
    }
  }

  const toUser = await prisma.user.findFirst({
    where: {
      number: to,
    },
  })

  if (!toUser) {
    return {
      message: "User does not exist",
    }
  }
  if (toUser.id === Number(from)) {
    return {
      message: "You cannot send money to yourself",
    }
  }

  // The below code cannot prevent the user from clicking "Send" button twice the txn continues
  // To prevent this we need to introduce "lock" row that amount first
  await prisma.$transaction(async (tx) => {
    // The below line will lock that particular low until all 4 below are completed

    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`

    const fromBalance = await tx.balance.findUnique({
      where: {
        userId: Number(from),
      },
    })
    if (!fromBalance || fromBalance.amount < amount) {
      throw new Error("Insufficent Balance")
    }

    await tx.balance.update({
      where: {
        userId: Number(from),
      },
      data: {
        amount: {
          decrement: amount,
        },
      },
    })

    await tx.balance.update({
      where: {
        userId: toUser.id,
      },
      data: {
        amount: {
          increment: amount,
        },
      },
    })
    // Track Transactions also user txn history to show on FE
    await tx.p2pTransfer.create({
      data: {
        fromUserId: Number(from),
        toUserId: toUser.id,
        amount: amount,
        timestamp: new Date(),
      },
    })
  })
}
