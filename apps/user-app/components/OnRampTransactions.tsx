import { Card } from "@repo/ui/card"

export const OnRampTransactions = ({
  transactions,
}: {
  transactions: {
    time: Date
    amount: number
    // TODO: Can the type of `status` be more specific?
    status: string
    provider: string
  }[]
}) => {
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    )
  }
  return (
    <Card title="Recent Transactions">
      <div className="">
        {transactions.map((t) => (
          <div
            className="flex justify-between border-b border-slate-300 pb-2"
            key={t.time.toString()}
          >
            <div>
              <div className="text-sm">Received INR</div>
              <div className="text-slate-600 text-xs">
                {t.time.toDateString()}
              </div>
              <div
                className={`text-xs ${t.status === "Success" ? "text-green-500" : t.status === "Processing" ? "text-gray-500" : "text-red-500"}`}
              >
                {t.status}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              + Rs {t.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
