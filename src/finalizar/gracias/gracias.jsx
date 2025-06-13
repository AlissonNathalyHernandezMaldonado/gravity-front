"use client"

import { useEffect, useState } from "react"

export default function GraciasPage() {
  const [invoiceData, setInvoiceData] = useState(null)

  useEffect(() => {
    // Get invoice data from localStorage (would normally be from session/API)
    const data = localStorage.getItem("datos_factura")
    if (data) {
      setInvoiceData(JSON.parse(data))
    }
  }, [])

  if (!invoiceData) {
    return (
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 1rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
          Cargando información de tu pedido...
        </h1>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "Montserrat, sans-serif" }}>
      {/* Navbar */}
      <nav style={{ backgroundColor: "#212529", color: "white", padding: "1rem 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <a href="/" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white", textDecoration: "none" }}>
            GRAVITY
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 1rem", flex: 1 }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#dcfce7",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ fontSize: "2.5rem", color: "#16a34a" }}>✓</span>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>¡Gracias por tu compra!</h1>
          <p style={{ color: "#6b7280", fontSize: "1.125rem", marginBottom: "2rem" }}>
            Tu pedido ha sido recibido y está siendo procesado.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            marginBottom: "2rem",
            overflow: "hidden",
            maxWidth: "800px",
            margin: "0 auto 2rem auto",
          }}
        >
          <div style={{ backgroundColor: "#ea580c", color: "white", padding: "1rem 1.5rem" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: "500", margin: 0, display: "flex", alignItems: "center" }}>
              📄 Resumen de tu pedido
            </h2>
          </div>
          <div style={{ padding: "1.5rem" }}>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}
            >
              <div>
                <h3 style={{ fontWeight: "600", fontSize: "1.125rem", marginBottom: "0.5rem" }}>
                  Información del pedido
                </h3>
                <p>
                  <span style={{ fontWeight: "500" }}>Número de pedido:</span> {invoiceData.factura_id}
                </p>
                <p>
                  <span style={{ fontWeight: "500" }}>Fecha:</span> {new Date(invoiceData.fecha).toLocaleDateString()}
                </p>
                <p>
                  <span style={{ fontWeight: "500" }}>Método de pago:</span> {invoiceData.metodo_pago}
                </p>
                <p>
                  <span style={{ fontWeight: "500" }}>Total:</span> ${invoiceData.total.toFixed(2)}
                </p>
              </div>
              <div>
                <h3 style={{ fontWeight: "600", fontSize: "1.125rem", marginBottom: "0.5rem" }}>
                  Información de envío
                </h3>
                <p>
                  <span style={{ fontWeight: "500" }}>Nombre:</span> {invoiceData.cliente.nombre}
                </p>
                <p>
                  <span style={{ fontWeight: "500" }}>Email:</span> {invoiceData.cliente.email}
                </p>
                <p>
                  <span style={{ fontWeight: "500" }}>Dirección:</span> {invoiceData.cliente.direccion}
                </p>
              </div>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <h3 style={{ fontWeight: "600", fontSize: "1.125rem", marginBottom: "1rem" }}>Productos</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f3f4f6" }}>
                      <th style={{ padding: "0.5rem 1rem", textAlign: "left" }}>Producto</th>
                      <th style={{ padding: "0.5rem 1rem", textAlign: "right" }}>Precio</th>
                      <th style={{ padding: "0.5rem 1rem", textAlign: "center" }}>Cantidad</th>
                      <th style={{ padding: "0.5rem 1rem", textAlign: "right" }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.productos.map((item, index) => {
                      const subtotal = item.precio * item.cantidad
                      return (
                        <tr key={index} style={{ borderBottom: "1px solid #e5e7eb" }}>
                          <td style={{ padding: "0.75rem 1rem" }}>{item.nombre}</td>
                          <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>${item.precio.toFixed(2)}</td>
                          <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>{item.cantidad}</td>
                          <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>${subtotal.toFixed(2)}</td>
                        </tr>
                      )
                    })}
                    <tr style={{ fontWeight: "600" }}>
                      <td colSpan={3} style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                        TOTAL:
                      </td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>${invoiceData.total.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#2563eb",
              color: "white",
              textDecoration: "none",
              borderRadius: "0.375rem",
              fontWeight: "500",
            }}
          >
            🏠 Volver a la página principal
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: "#212529", color: "white", padding: "2rem 0", marginTop: "3rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
          <p style={{ color: "#9ca3af", fontSize: "0.875rem", margin: 0 }}>
            &copy; 2025 GRAVITY. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
