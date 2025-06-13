"use client"

import { useState, useEffect } from "react"

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    direccion: "",
    fecha: new Date().toISOString().split("T")[0],
    metodo_pago: "",
  })
  const [errors, setErrors] = useState([])
  const [cart, setCart] = useState([])
  const [user, setUser] = useState(null)

  // Simulate fetching user data and cart from API/localStorage
  useEffect(() => {
    // Mock user data that would normally come from a database
    setUser({
      nombre: "Usuario de Ejemplo",
      correo_usuario: "usuario@ejemplo.com",
      direccion_usuario: "Calle Principal #123",
    })

    // Mock cart data that would normally come from session/localStorage
    setCart([
      { id: 1, nombre: "Producto 1", precio: 29.99, cantidad: 2 },
      { id: 2, nombre: "Producto 2", precio: 49.99, cantidad: 1 },
    ])

    // Pre-fill form with user data
    setFormData((prev) => ({
      ...prev,
      nombre: "Usuario de Ejemplo",
      email: "usuario@ejemplo.com",
      direccion: "Calle Principal #123",
    }))
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePaymentMethodSelect = (method) => {
    setFormData((prev) => ({
      ...prev,
      metodo_pago: method,
    }))
  }

  const validateForm = () => {
    const newErrors = []

    if (!formData.direccion) {
      newErrors.push("La dirección de envío es requerida")
    }

    if (!formData.metodo_pago) {
      newErrors.push("Debes seleccionar un método de pago")
    }

    if (!formData.fecha) {
      newErrors.push("La fecha de compra es requerida")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

    // Create invoice data (would normally be sent to server)
    const invoiceData = {
      factura_id: `FAC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 10)}`,
      fecha: formData.fecha,
      cliente: {
        nombre: formData.nombre,
        email: formData.email,
        direccion: formData.direccion,
      },
      metodo_pago: formData.metodo_pago,
      productos: cart,
      total: total,
    }

    // Store invoice data (would normally be in session or database)
    localStorage.setItem("datos_factura", JSON.stringify(invoiceData))

    // Show success message and redirect
    alert("¡Compra realizada con éxito! Redirigiendo a la página de confirmación...")

    window.location.href = "gracias" 
  }

  // Calculate cart total
  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

  const paymentMethods = [
    {
      id: "tarjeta",
      name: "Tarjeta de Crédito",
      description: "Visa, Mastercard, Amex",
      image: "../img/metodosdepago1.png",
    },
    {
      id: "nequi",
      name: "Nequi",
      description: "Pago rápido y seguro",
      image: "../img/metodosdepago2.png",
    },
    {
      id: "daviplata",
      name: "Daviplata",
      description: "Desde tu celular",
      image: "../img/metodosdepago3.png",
    },
    {
      id: "contraentrega",
      name: "Contraentrega",
      description: "Paga al recibir tu pedido",
      icon: "💰",
    },
  ]

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "Montserrat, sans-serif" }}>
      {/* Navbar */}
      <nav style={{ backgroundColor: "#212529", color: "white", padding: "1rem 0" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <a href="/" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white", textDecoration: "none" }}>
            GRAVITY
          </a>
          <div style={{ display: "flex", gap: "1rem" }}>
            <a href="/productos" style={{ color: "white", textDecoration: "none" }}>
              🛍️ Productos
            </a>
            <a href="/carrito" style={{ color: "white", textDecoration: "none" }}>
              🛒 Carrito
            </a>
            <a href="/perfil" style={{ color: "white", textDecoration: "none" }}>
              👤 Mi Cuenta
            </a>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem", flex: 1 }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.875rem" }}>
            <a href="/productos" style={{ color: "#3b82f6", textDecoration: "none" }}>
              Productos
            </a>
            <span style={{ margin: "0 0.5rem" }}>/</span>
            <a href="/carrito" style={{ color: "#3b82f6", textDecoration: "none" }}>
              Carrito
            </a>
            <span style={{ margin: "0 0.5rem" }}>/</span>
            <span style={{ color: "#f97316", fontWeight: "500" }}>Finalizar Compra</span>
          </div>
        </nav>

        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Finalizar Compra</h1>

        {errors.length > 0 && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "#dc2626",
              padding: "1rem",
              borderRadius: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <ul style={{ listStyle: "disc", paddingLeft: "1.25rem", margin: 0 }}>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Customer Information */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              marginBottom: "1.5rem",
              overflow: "hidden",
            }}
          >
            <div style={{ backgroundColor: "#ea580c", color: "white", padding: "1rem 1.5rem" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: "500", margin: 0, display: "flex", alignItems: "center" }}>
                👤 Información del Cliente
              </h2>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}
              >
                <div>
                  <label htmlFor="nombre" style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>
                    Nombre Completo
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.375rem",
                      fontSize: "1rem",
                    }}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="email" style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>
                    Correo Electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.375rem",
                      fontSize: "1rem",
                    }}
                    readOnly
                  />
                </div>
              </div>
              <div style={{ marginTop: "1rem" }}>
                <label htmlFor="direccion" style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>
                  Dirección de Envío
                </label>
                <input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    fontSize: "1rem",
                  }}
                  required
                />
              </div>
              <div style={{ marginTop: "1rem" }}>
                <label htmlFor="fecha" style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>
                  Fecha de Compra
                </label>
                <input
                  id="fecha"
                  name="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    fontSize: "1rem",
                  }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              marginBottom: "1.5rem",
              overflow: "hidden",
            }}
          >
            <div style={{ backgroundColor: "#ea580c", color: "white", padding: "1rem 1.5rem" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: "500", margin: 0, display: "flex", alignItems: "center" }}>
                💳 Método de Pago
              </h2>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>Selecciona tu método de pago preferido</p>

              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}
              >
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    style={{
                      border: `2px solid ${formData.metodo_pago === method.name ? "#3b82f6" : "#e5e7eb"}`,
                      borderRadius: "0.5rem",
                      padding: "1.5rem",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      backgroundColor: formData.metodo_pago === method.name ? "#eff6ff" : "white",
                      textAlign: "center",
                    }}
                    onClick={() => handlePaymentMethodSelect(method.name)}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      {method.image ? (
                        <img
                          src={method.image || "/placeholder.svg"}
                          alt={method.name}
                          style={{
                            maxHeight: "40px",
                            marginBottom: "1rem",
                            filter: formData.metodo_pago === method.name ? "none" : "grayscale(100%)",
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{method.icon}</div>
                      )}
                      <h5 style={{ fontWeight: "500", marginBottom: "0.25rem", margin: 0 }}>{method.name}</h5>
                      <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>{method.description}</p>
                    </div>
                    <input
                      type="radio"
                      name="metodo_pago"
                      id={method.id}
                      value={method.name}
                      checked={formData.metodo_pago === method.name}
                      onChange={() => {}}
                      style={{ display: "none" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              marginBottom: "1.5rem",
              overflow: "hidden",
            }}
          >
            <div style={{ backgroundColor: "#ea580c", color: "white", padding: "1rem 1.5rem" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: "500", margin: 0, display: "flex", alignItems: "center" }}>
                🛒 Resumen de tu compra
              </h2>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#ea580c", color: "white" }}>
                      <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Producto</th>
                      <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Precio</th>
                      <th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>Cantidad</th>
                      <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => {
                      const subtotal = item.precio * item.cantidad
                      return (
                        <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                          <td style={{ padding: "1rem" }}>{item.nombre}</td>
                          <td style={{ padding: "1rem", textAlign: "right" }}>${item.precio.toFixed(2)}</td>
                          <td style={{ padding: "1rem", textAlign: "center" }}>{item.cantidad}</td>
                          <td style={{ padding: "1rem", textAlign: "right" }}>${subtotal.toFixed(2)}</td>
                        </tr>
                      )
                    })}
                    <tr style={{ backgroundColor: "#f9fafb", fontWeight: "600" }}>
                      <td colSpan={3} style={{ padding: "1rem", textAlign: "right" }}>
                        TOTAL:
                      </td>
                      <td style={{ padding: "1rem", textAlign: "right" }}>${total.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
              <a
                href="/productos"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.75rem 1.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  color: "#374151",
                  backgroundColor: "white",
                  textDecoration: "none",
                  transition: "background-color 0.3s ease",
                }}
              >
                ← Seguir comprando
              </a>
              <button
                type="submit"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.75rem 2rem",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "0.375rem",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
              >
                ✓ Confirmar Compra
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: "#212529", color: "white", padding: "2rem 0", marginTop: "3rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
            <div>
              <h5 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>GRAVITY</h5>
              <p style={{ color: "#9ca3af" }}>Los mejores productos al mejor precio.</p>
            </div>
            <div>
              <h5 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>Contacto</h5>
              <div style={{ color: "#9ca3af" }}>
                <p>📧 contacto@gravity.com</p>
                <p>📞 +57 3054146810</p>
              </div>
            </div>
            <div>
              <h5 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>Síguenos</h5>
              <div style={{ display: "flex", gap: "1rem" }}>
                <a href="#" style={{ color: "white", fontSize: "1.5rem", textDecoration: "none" }}>
                  📘
                </a>
                <a href="#" style={{ color: "white", fontSize: "1.5rem", textDecoration: "none" }}>
                  📷
                </a>
                <a href="#" style={{ color: "white", fontSize: "1.5rem", textDecoration: "none" }}>
                  🐦
                </a>
              </div>
            </div>
          </div>
          <hr style={{ margin: "1.5rem 0", borderColor: "#374151" }} />
          <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.875rem" }}>
            &copy; 2025 GRAVITY. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
