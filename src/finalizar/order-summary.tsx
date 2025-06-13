import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ShoppingCart } from 'lucide-react'

export default function OrderSummary({ cart }) {
  // Calculate totals
  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader className="bg-orange-600 text-white py-4 px-6">
        <h2 className="text-lg font-medium flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5" /> Resumen de tu compra
        </h2>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-orange-600 text-white">
                <th className="py-3 px-4 text-left">Producto</th>
                <th className="py-3 px-4 text-right">Precio</th>
                <th className="py-3 px-4 text-center">Cantidad</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => {
                const subtotal = item.precio * item.cantidad
                return (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-4 px-4">{item.nombre}</td>
                    <td className="py-4 px-4 text-right">${item.precio.toFixed(2)}</td>
                    <td className="py-4 px-4 text-center">{item.cantidad}</td>
                    <td className="py-4 px-4 text-right">${subtotal.toFixed(2)}</td>
                  </tr>
                )
              })}
              <tr className="bg-gray-50 font-semibold">
                <td colSpan={3} className="py-4 px-4 text-right">
                  TOTAL:
                </td>
                <td className="py-4 px-4 text-right">${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
