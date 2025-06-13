"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import Swal from "sweetalert2"
import fondo from "../img/FONDO7.png"
import "../css/style.css"

// URL base de la API - CAMBIA ESTA URL por la ruta correcta a tu servidor PHP
const API_BASE_URL = "http://localhost/gravity/api" // Ajusta según tu configuración

const Carrito = () => {
  const [carrito, setCarrito] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // ID de usuario simulado (en producción vendría de autenticación)
  const userId = 1 // Cambia esto por el ID del usuario autenticado

  // Cargar carrito desde localStorage y/o API
  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Primero intentamos cargar desde localStorage para mostrar algo rápido
      const localCart = localStorage.getItem("cart")
      if (localCart) {
        setCarrito(JSON.parse(localCart))
      }

      // Luego intentamos cargar desde la API (si está implementada)
      try {
        const response = await fetch(`${API_BASE_URL}/api_carrito.php?id_usuario=${userId}`)

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }

        const data = await response.json()
        console.log("API carrito response:", data) // Para depuración

        if (data.success && Array.isArray(data.cart)) {
          // Si la API devuelve datos, actualizamos el carrito
          setCarrito(
            data.cart.map((item) => ({
              id: item.id_producto,
              id_carrito: item.id_carrito,
              nombre: item.nombre_producto,
              precio: Number.parseFloat(item.precio_producto),
              cantidad: Number.parseInt(item.cantidad),
              talla: item.talla,
              img: item.img,
            })),
          )

          // También actualizamos localStorage
          localStorage.setItem("cart", JSON.stringify(data.cart))
        }
      } catch (apiError) {
        console.warn("Error al cargar carrito desde API, usando localStorage:", apiError)
        // Si falla la API, seguimos usando localStorage
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Error loading cart:", error)
      setError("Error al cargar el carrito. Por favor, intenta de nuevo.")
      setIsLoading(false)
    }
  }

  // Eliminar un producto
  const eliminarProducto = async (index, id_carrito) => {
    try {
      // Mostrar confirmación
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Este producto se eliminará del carrito",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      })

      if (!result.isConfirmed) return

      // Si tenemos API y ID de carrito, intentamos eliminar desde la API
      if (id_carrito) {
        try {
          const response = await fetch(`${API_BASE_URL}/api_carrito.php?id_carrito=${id_carrito}`, {
            method: "DELETE",
          })

          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
          }

          const data = await response.json()
          if (!data.success) {
            throw new Error(data.message || "Error al eliminar producto")
          }
        } catch (apiError) {
          console.warn("Error al eliminar desde API, continuando con eliminación local:", apiError)
        }
      }

      // Eliminar del estado local
      const nuevoCarrito = [...carrito]
      nuevoCarrito.splice(index, 1)
      setCarrito(nuevoCarrito)

      // Actualizar localStorage
      localStorage.setItem("cart", JSON.stringify(nuevoCarrito))

      Swal.fire("Eliminado", "El producto ha sido eliminado del carrito", "success")
    } catch (error) {
      console.error("Error removing product:", error)
      Swal.fire("Error", "No se pudo eliminar el producto", "error")
    }
  }

  // Actualizar cantidades
  const actualizarCantidad = async (index, nuevaCantidad, id_carrito) => {
    if (nuevaCantidad < 1) return

    try {
      // Si tenemos API y ID de carrito, intentamos actualizar en la API
      if (id_carrito) {
        try {
          const response = await fetch(`${API_BASE_URL}/api_carrito.php`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_carrito: id_carrito,
              cantidad: nuevaCantidad,
            }),
          })

          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
          }

          const data = await response.json()
          if (!data.success) {
            throw new Error(data.message || "Error al actualizar cantidad")
          }
        } catch (apiError) {
          console.warn("Error al actualizar cantidad en API, continuando con actualización local:", apiError)
        }
      }

      // Actualizar estado local
      const nuevoCarrito = [...carrito]
      nuevoCarrito[index].cantidad = nuevaCantidad
      setCarrito(nuevoCarrito)

      // Actualizar localStorage
      localStorage.setItem("cart", JSON.stringify(nuevoCarrito))
    } catch (error) {
      console.error("Error updating quantity:", error)
      Swal.fire("Error", "No se pudo actualizar la cantidad", "error")
    }
  }

  // Calcular totales
  const total = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)
  const totalProductos = carrito.reduce((acc, prod) => acc + prod.cantidad, 0)

  // Finalizar compra
  const finalizarCompra = () => {
    // Aquí puedes validar si el usuario está autenticado antes de redirigir
    navigate("/Login")
  }

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando carrito...</p>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <style>
        {`
        body {
          background-image: url(${fondo});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          min-height: 100vh;
          color: #fa6702;
        }
        .table-dark th {
          color: #fa6702;
        }
        `}
      </style>

      <h1>🛒 TU CARRITO DE COMPRAS</h1>

      {error && (
        <div className="alert alert-danger">
          {error}
          <button className="btn btn-outline-danger ms-3" onClick={() => loadCart()}>
            Reintentar
          </button>
        </div>
      )}

      {carrito.length > 0 ? (
        <>
          <p className="lead">
            🔢 Estás comprando <strong>{totalProductos}</strong> producto
            {totalProductos > 1 ? "s" : ""}.
          </p>

          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Producto</th>
                <th>Talla</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((producto, index) => (
                <tr key={index}>
                  <td>
                    <div className="d-flex align-items-center">
                      {producto.img && (
                        <img
                          src={producto.img || "/placeholder.svg"}
                          alt={producto.nombre}
                          className="me-2"
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/placeholder.svg?height=50&width=50"
                          }}
                        />
                      )}
                      {producto.nombre}
                    </div>
                  </td>
                  <td>{producto.talla}</td>
                  <td>${producto.precio.toLocaleString()}</td>
                  <td style={{ width: "100px" }}>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={producto.cantidad}
                      onChange={(e) =>
                        actualizarCantidad(index, Number.parseInt(e.target.value) || 1, producto.id_carrito)
                      }
                    />
                  </td>
                  <td>${(producto.precio * producto.cantidad).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => eliminarProducto(index, producto.id_carrito)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Total: ${total.toLocaleString()}</h4>
            <div className="d-flex gap-2">
              <Link to="/productos" className="btn btn-secondary">
                Seguir comprando
              </Link>
            </div>
          </div>

          <div className="text-center">
            <button onClick={finalizarCompra} className="btn btn-success btn-lg">
              Finalizar Compra
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="alert alert-info">Tu carrito está vacío. 🛍️</div>
          <Link to="/productos" className="btn btn-primary">
            Ver productos
          </Link>
        </>
      )}
    </div>
  )
}

export default Carrito
