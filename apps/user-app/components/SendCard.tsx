"use client"

import { Center } from "@repo/ui/center"
import { Card } from "@repo/ui/card"
import { TextInput } from "@repo/ui/textinput"
import { Button } from "@repo/ui/button"
import { useState } from "react"
import { p2pTransfer } from "../lib/actions/p2pTransfer"

export function SendCard() {
  const [number, setNumber] = useState("")
  const [amount, setAmount] = useState("")

  return (
    <div className="h-[90vh]">
      <Center>
        <Card title="Send Money">
          <div className="min-w-72 pt-2">
            <TextInput
              placeholder={"Number"}
              label="Number"
              onChange={(value) => setNumber(value)}
              value={number}
            />
            <TextInput
              placeholder={"Amount"}
              label="Amount"
              onChange={(value) => setAmount(value)}
              value={amount}
            />
            <div className="flex justify-center pt-4">
              <Button
                onClick={async () => {
                  await p2pTransfer(number, Number(amount) * 100)
                  setAmount("")
                  setNumber("")
                }}
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      </Center>
    </div>
  )
}
