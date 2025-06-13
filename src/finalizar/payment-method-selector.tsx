"use client"

import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CreditCard } from 'lucide-react'
import Image from "next/image"

export default function PaymentMethodSelector({ selectedMethod, onSelectMethod }) {
  const paymentMethods = [
    {
      id: "tarjeta",
      name: "Tarjeta de Crédito",
      description: "Visa, Mastercard, Amex",
      image: "/placeholder.svg?height=40&width=120",
    },
    {
      id: "nequi",
      name: "Nequi",
      description: "Pago rápido y seguro",
      image: "/placeholder.svg?height=40&width=120",
    },
    {
      id: "daviplata",
      name: "Daviplata",
      description: "Desde tu celular",
      image: "/placeholder.svg?height=40&width=120",
    },
    {
      id: "contraentrega",
      name: "Contraentrega",
      description: "Paga al recibir tu pedido",
      icon: <CreditCard className="h-10 w-10 text-blue-500" />,
    },
  ]

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader className="bg-orange-600 text-white py-4 px-6">
        <h2 className="text-lg font-medium flex items-center">
          <CreditCard className="mr-2 h-5 w-5" /> Método de Pago
        </h2>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-gray-500 mb-6">Selecciona tu método de pago preferido</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 ${
                selectedMethod === method.name ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
              onClick={() => onSelectMethod(method.name)}
            >
              <div className="flex flex-col items-center text-center">
                {method.image ? (
                  <Image
                    src={method.image || "/placeholder.svg"}
                    alt={method.name}
                    width={120}
                    height={40}
                    className={`mb-4 ${selectedMethod === method.name ? "" : "filter grayscale"}`}
                  />
                ) : (
                  method.icon
                )}
                <h5 className="font-medium mb-1">{method.name}</h5>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
              <input
                type="radio"
                name="metodo_pago"
                id={method.id}
                value={method.name}
                checked={selectedMethod === method.name}
                onChange={() => {}}
                className="sr-only"
              />
            </div>
          ))}
        </div>

        {/* Error message for payment method */}
        <div id="payment-error" className="text-red-500 mt-2" style={{ display: "none" }}>
          Por favor selecciona un método de pago.
        </div>
      </CardContent>
    </Card>
  )
}
