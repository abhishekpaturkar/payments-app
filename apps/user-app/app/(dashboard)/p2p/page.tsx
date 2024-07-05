import { SendCard } from "../../../components/SendCard"
import prisma from "@repo/db/client"
import { getServerSession } from "next-auth"

import { authOptions } from "../../../lib/auth"
import { Card } from "@repo/ui/card"

async function getP2Ptransfers(type: string) {
  const session = await getServerSession(authOptions)
  if (type === "received") {
    const received = prisma.p2pTransfer.findMany({
      where: {
        toUserId: Number(session?.user?.id),
      },
    })
    return received
  } else {
    const sent = await prisma.p2pTransfer.findMany({
      where: {
        fromUserId: Number(session?.user?.id),
      },
    })
    return sent
  }
}

export default async function () {
  const received = await getP2Ptransfers("received")
  const sent = await getP2Ptransfers("sent")
  return (
    <div className="w-full">
      <div className="flex justify-between px-4 py-8">
        <div className="w-1/3">
          <SendCard />
        </div>
        <div className="flex flex-col w-2/3 gap-4">
          {/* Sent Transactions Card */}
          <Card title="Sent">
            <div className="">
              {sent.map((t) => (
                <div
                  key={t.timestamp.toString()}
                  className="flex justify-between border-b border-slate-300 pb-2"
                >
                  <div>
                    <div className="text-sm">Sent INR</div>
                    <div className="text-slate-600 text-xs">
                      {t.timestamp.toDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    - Rs {t.amount / 100}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Received Transactions Card */}
          <Card title="Received">
            <div className="">
              {received.map((t) => (
                <div
                  key={t.timestamp.toString()}
                  className="flex justify-between border-b border-slate-300 pb-2"
                >
                  <div>
                    <div className="text-sm">Received INR</div>
                    <div className="text-slate-600 text-xs">
                      {t.timestamp.toDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    + Rs {t.amount / 100}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
