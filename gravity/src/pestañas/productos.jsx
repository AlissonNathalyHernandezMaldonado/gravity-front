"use client"

import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import logo from "../img/logog.png"
import fondo from "../img/FONDO6.png"

const Productos = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [cart, setCart] = useState([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [searchName, setSearchName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSizes, setSelectedSizes] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState("checking")
  const [debugInfo, setDebugInfo] = useState(null)

  // URLs para probar
  const possibleUrls = [
    "http://localhost/backend-gravity",
    "http://127.0.0.1/backend-gravity",
    "http://localhost:80/backend-gravity",
  ]

  const [currentApiUrl, setCurrentApiUrl] = useState(possibleUrls[0])
  const [manualUrl, setManualUrl] = useState("")

  useEffect(() => {
    findWorkingUrl()
    loadCartFromLocalStorage()
  }, [])

  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      setCart(parsedCart)
      const total = parsedCart.reduce((sum, item) => sum + item.cantidad, 0)
      setTotalProducts(total)
    }
  }

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
    const total = cart.reduce((sum, item) => sum + item.cantidad, 0)
    setTotalProducts(total)
  }, [cart])

  // Función mejorada para probar URLs
  const testUrl = async (url) => {
    console.log(`🧪 Probando URL: ${url}`)

    try {
      const corsResponse = await fetch(`${url}/cors-test.php`, {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      })

      if (corsResponse.ok) {
        const corsData = await corsResponse.json()
        if (corsData.success) {
          return true
        }
      }

      const testResponse = await fetch(`${url}/test-simple.php`, {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      })

      if (testResponse.ok) {
        const testData = await testResponse.json()
        if (testData.status === "success") {
          return true
        }
      }

      return false
    } catch (error) {
      console.log(`❌ Error probando ${url}:`, error.message)
      return false
    }
  }

  // Buscar una URL que funcione
  const findWorkingUrl = async () => {
    console.log("🔍 Buscando URL que funcione...")
    setConnectionStatus("searching")

    for (const url of possibleUrls) {
      const works = await testUrl(url)

      if (works) {
        console.log(`✅ URL funcionando: ${url}`)
        setCurrentApiUrl(url)
        setConnectionStatus("connected")
        await fetchProducts(url)
        await fetchCategories(url)
        return
      }
    }

    console.log("❌ Ninguna URL funcionó")
    setConnectionStatus("failed")
    setError("No se pudo conectar a ningún servidor backend")
    setIsLoading(false)
  }

  // Probar URL manual
  const tryManualUrl = async () => {
    if (!manualUrl) {
      Swal.fire({
        icon: "error",
        title: "URL vacía",
        text: "Por favor ingresa una URL para probar",
      })
      return
    }

    try {
      setConnectionStatus("searching")
      console.log(`🧪 Probando URL manual: ${manualUrl}`)

      const works = await testUrl(manualUrl)

      if (works) {
        console.log(`✅ URL manual funcionando: ${manualUrl}`)
        setCurrentApiUrl(manualUrl)
        setConnectionStatus("connected")
        await fetchProducts(manualUrl)
        await fetchCategories(manualUrl)

        Swal.fire({
          icon: "success",
          title: "Conexión exitosa",
          text: `Conectado a: ${manualUrl}`,
        })
        return
      }

      throw new Error("La URL no devolvió una respuesta válida")
    } catch (error) {
      console.log(`❌ URL manual falló: ${error.message}`)
      setConnectionStatus("failed")
      setError(`Error con URL manual: ${error.message}`)

      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        html: `
          <p><strong>No se pudo conectar a:</strong> ${manualUrl}</p>
          <p><strong>Error:</strong> ${error.message}</p>
        `,
      })
    }
  }

  // Función para construir la URL de imagen correctamente
  const buildImageUrl = (imagePath, apiUrl) => {
    if (!imagePath) {
      return "/placeholder.svg?height=250&width=300"
    }

    // Si ya es una URL completa, devolverla tal como está
    if (imagePath.startsWith("http")) {
      return imagePath
    }

    // Limpiar la ruta de imagen
    let cleanPath = imagePath.trim()

    // Si empieza con "/", quitarlo
    if (cleanPath.startsWith("/")) {
      cleanPath = cleanPath.substring(1)
    }

    // Construir la URL completa
    const fullUrl = `${apiUrl}/${cleanPath}`

    console.log(`🖼️ Imagen construida: ${imagePath} -> ${fullUrl}`)

    return fullUrl
  }

  const fetchProducts = async (apiUrl = currentApiUrl) => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("🔄 Obteniendo productos desde:", `${apiUrl}/api_productos.php`)

      const response = await fetch(`${apiUrl}/api_productos.php`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        cache: "no-cache",
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      console.log("✅ Datos RAW recibidos:", data)

      // Guardar info de debug
      setDebugInfo({
        url: `${apiUrl}/api_productos.php`,
        status: response.status,
        dataType: typeof data,
        isArray: Array.isArray(data),
        dataKeys: typeof data === "object" ? Object.keys(data) : [],
        dataLength: Array.isArray(data) ? data.length : "N/A",
        firstItem: Array.isArray(data) && data.length > 0 ? data[0] : null,
      })

      let processedProducts = []

      // Manejar diferentes formatos de respuesta
      if (data.success && Array.isArray(data.data)) {
        console.log("📦 Formato: data.success + data.data")
        processedProducts = data.data
      } else if (Array.isArray(data)) {
        console.log("📦 Formato: Array directo")
        processedProducts = data
      } else if (data.data && Array.isArray(data.data)) {
        console.log("📦 Formato: data.data")
        processedProducts = data.data
      } else {
        console.log("❌ Formato desconocido:", data)
        throw new Error("Formato de respuesta inesperado")
      }

      console.log("📦 Productos procesados:", processedProducts)

      // Procesar productos y arreglar rutas de imágenes
      const finalProducts = processedProducts.map((product) => {
        const imageUrl = buildImageUrl(product.img, apiUrl)

        return {
          ...product,
          img: imageUrl,
          precio_producto: Number.parseFloat(product.precio_producto) || 0,
          tallas_disponibles: product.tallas_disponibles || ["S", "M", "L", "XL"],
        }
      })

      console.log("🎯 Productos finales:", finalProducts)

      setProducts(finalProducts)
      setIsLoading(false)
      setConnectionStatus("connected")

      if (finalProducts.length > 0) {
        console.log(`✅ ${finalProducts.length} productos cargados exitosamente`)
      } else {
        console.log("⚠️ No se encontraron productos")
        setError("No se encontraron productos en la base de datos")
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error)
      setError(`Error al cargar productos: ${error.message}`)
      setIsLoading(false)
      setConnectionStatus("error")
    }
  }

  const fetchCategories = async (apiUrl = currentApiUrl) => {
    try {
      const response = await fetch(`${apiUrl}/api_categorias.php`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        cache: "no-cache",
      })

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Categorías recibidas:", data)

        if (data.success && Array.isArray(data.data)) {
          setCategories(data.data)
        } else if (Array.isArray(data)) {
          setCategories(data)
        }
      }
    } catch (error) {
      console.error("❌ Error fetching categories:", error)
      setCategories([
        { id_categoria: 1, nombre_categoria: "sudadera mujer" },
        { id_categoria: 2, nombre_categoria: "sudadera hombre" },
        { id_categoria: 3, nombre_categoria: "chaquetas" },
      ])
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts()
  }

  const handleSizeChange = (productId, size) => {
    setSelectedSizes({
      ...selectedSizes,
      [productId]: size,
    })
  }

  const addToCart = (e, product) => {
    e.preventDefault()

    const productId = product.id_producto
    const selectedSize = selectedSizes[productId]

    if (!selectedSize) {
      Swal.fire({
        icon: "error",
        title: "Talla no seleccionada",
        text: "Por favor selecciona una talla antes de agregar al carrito",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Entendido",
      })
      return
    }

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === productId && item.talla === selectedSize)

      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].cantidad += 1
        return updatedCart
      } else {
        return [
          ...prevCart,
          {
            id: productId,
            nombre: product.nombre_producto,
            precio: Number.parseFloat(product.precio_producto),
            cantidad: 1,
            talla: selectedSize,
            img: product.img,
          },
        ]
      }
    })

    Swal.fire({
      icon: "success",
      title: "Producto agregado",
      html: `<b>${product.nombre_producto}</b> (Talla: ${selectedSize})<br>¡Se ha añadido al carrito!`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    })
  }

  const filteredProducts = products.filter((product) => {
    const nameMatch = product.nombre_producto.toLowerCase().includes(searchName.toLowerCase())
    const categoryMatch = selectedCategory === "" || product.id_categoria === Number.parseInt(selectedCategory)
    return nameMatch && categoryMatch
  })

  // Función para mostrar información de debug
  const showDebugInfo = () => {
    Swal.fire({
      title: "🔍 Información de Debug",
      html: `
        <div style="text-align: left;">
          <p><strong>URL API:</strong> ${debugInfo?.url || "N/A"}</p>
          <p><strong>Status:</strong> ${debugInfo?.status || "N/A"}</p>
          <p><strong>Tipo de datos:</strong> ${debugInfo?.dataType || "N/A"}</p>
          <p><strong>Es Array:</strong> ${debugInfo?.isArray ? "Sí" : "No"}</p>
          <p><strong>Keys:</strong> ${debugInfo?.dataKeys?.join(", ") || "N/A"}</p>
          <p><strong>Longitud:</strong> ${debugInfo?.dataLength || "N/A"}</p>
          <p><strong>Total productos:</strong> ${products.length}</p>
          <p><strong>Productos filtrados:</strong> ${filteredProducts.length}</p>
          ${debugInfo?.firstItem ? `<p><strong>Primer item:</strong> ${JSON.stringify(debugInfo.firstItem, null, 2)}</p>` : ""}
        </div>
      `,
      width: 600,
      confirmButtonText: "Cerrar",
    })
  }

  // Función para probar una imagen específica
  const testImage = (imageUrl) => {
    window.open(imageUrl, "_blank")
  }

  // Función para probar la conexión manualmente
  const testConnection = async () => {
    try {
      console.log("🧪 Probando conexión manual...")

      const works = await testUrl(currentApiUrl)

      if (works) {
        Swal.fire({
          icon: "success",
          title: "Conexión exitosa",
          html: `
            <p><strong>✅ Estado:</strong> Conectado</p>
            <p><strong>🌐 URL:</strong> ${currentApiUrl}</p>
            <p><strong>⏰ Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>🔧 CORS:</strong> Funcionando</p>
            <p><strong>📦 Productos:</strong> ${products.length}</p>
          `,
        })
      } else {
        throw new Error("No se pudo establecer conexión")
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        html: `
          <p><strong>❌ Error:</strong> ${error.message}</p>
          <p><strong>🌐 URL probada:</strong> ${currentApiUrl}</p>
        `,
      })
    }
  }

  // Función para abrir diagnóstico
  const openDiagnostic = () => {
    window.open(`${currentApiUrl}/diagnostico.php`, "_blank")
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "alert-success"
      case "searching":
        return "alert-warning"
      case "error":
      case "failed":
        return "alert-danger"
      default:
        return "alert-info"
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return "✅"
      case "searching":
        return "🔍"
      case "error":
      case "failed":
        return "❌"
      default:
        return "⏳"
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return `Conectado a: ${currentApiUrl}`
      case "searching":
        return "Buscando servidor..."
      case "error":
        return "Error de conexión"
      case "failed":
        return "No se encontró servidor backend"
      default:
        return "Verificando conexión..."
    }
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container px-4 px-lg-5">
          <div className="sidebar__picture2">
            <a onClick={() => (window.location.href = "/")} style={{ cursor: "pointer" }}>
              <img src={logo || "/placeholder.svg"} style={{ width: "175px", height: "92px" }} alt="Logo" />
            </a>
            <div className="navbar-brand"></div>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
              <li className="sidebar__item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="46"
                  height="46"
                  fill="currentColor"
                  className="bi bi-phone-flip"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M11 1H5a1 1 0 0 0-1 1v6a.5.5 0 0 1-1 0V2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a.5.5 0 0 1-1 0V2a1 1 0 0 0-1-1m1 13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a.5.5 0 0 0-1 0v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2a.5.5 0 0 0-1 0zM1.713 7.954a.5.5 0 1 0-.419-.908c-.347.16-.654.348-.882.57C.184 7.842 0 8.139 0 8.5c0 .546.408.94.823 1.201.44.278 1.043.51 1.745.696C3.978 10.773 5.898 11 8 11q.148 0 .294-.002l-1.148 1.148a.5.5 0 0 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2a.5.5 0 1 0-.708.708l1.145 1.144L8 10c-2.04 0-3.87-.221-5.174-.569-.656-.175-1.151-.374-1.47-.575C1.012 8.639 1 8.506 1 8.5c0-.003 0-.059.112-.17.115-.112.31-.242.6-.376Zm12.993-.908a.5.5 0 0 0-.419.908c.292.134.486.264.6.377.113.11.113.166.113.169s0 .065-.13.187c-.132.122-.352.26-.677.4-.645.28-1.596.523-2.763.687a.5.5 0 0 0 .14.99c1.212-.17 2.26-.43 3.02-.758.38-.164.713-.357.96-.587.246-.229.45-.537.45-.919 0-.362-.184-.66-.412-.883s-.535-.411-.882-.571M7.5 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"
                  />
                </svg>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contacto">
                  Ayuda y Contacto
                </a>
              </li>
            </ul>

            {/* Carrito */}
            <div className="position-relative">
              <a href="/carrito" className="nav-link position-relative">
                <i className="bi bi-cart3" style={{ fontSize: "1.8rem" }}></i>
                {totalProducts > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalProducts}
                  </span>
                )}
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENIDO */}
      <div className="container mt-5" style={{ paddingTop: "80px" }}>
        <h1 className="mb-4 text-white">🛍️ CATALOGO DE PRODUCTOS</h1>

        {/* ESTADO DE CONEXIÓN - Solo mostrar si hay problemas */}
        {(connectionStatus !== "connected" || error) && (
          <div className={`alert ${getStatusColor()} mb-4`}>
            <div className="d-flex justify-content-between align-items-center">
              <small>
                {getStatusIcon()} <strong>Estado:</strong> {getStatusText()}
                {products.length > 0 && <span className="ms-2">({products.length} productos)</span>}
              </small>
              <div>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => showDebugInfo()}>
                  🔍 Debug
                </button>
                <button className="btn btn-sm btn-outline-info me-2" onClick={() => openDiagnostic()}>
                  Diagnóstico
                </button>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => testConnection()}>
                  Probar conexión
                </button>
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={() => findWorkingUrl()}
                  disabled={connectionStatus === "searching"}
                >
                  {connectionStatus === "searching" ? "Buscando..." : "Buscar servidor"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FORMULARIO DE BÚSQUEDA Y FILTRO */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label text-white">Buscar por nombre</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: sudadera negra"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label text-white">Filtrar por categoría</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id_categoria} value={category.id_categoria}>
                    {category.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <button type="submit" className="btn btn-primary w-100">
                Buscar
              </button>
            </div>
          </div>
        </form>

        {/* PRODUCTOS */}
        <div className="row">
          {isLoading || connectionStatus === "searching" ? (
            <div className="text-center text-white">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p>{connectionStatus === "searching" ? "Buscando servidor..." : "Cargando productos..."}</p>
            </div>
          ) : error || connectionStatus === "failed" ? (
            <div className="col-12">
              <div className="alert alert-danger">
                <h5>🔧 Error al cargar productos</h5>
                <p>{error || "No se pudo conectar al servidor backend"}</p>
                <div className="mt-3">
                  <button className="btn btn-outline-danger me-2" onClick={() => fetchProducts()}>
                    Reintentar
                  </button>
                  <button className="btn btn-outline-secondary me-2" onClick={() => showDebugInfo()}>
                    🔍 Debug
                  </button>
                  <button className="btn btn-outline-primary me-2" onClick={() => testConnection()}>
                    Probar conexión
                  </button>
                  <button className="btn btn-outline-warning" onClick={() => openDiagnostic()}>
                    Ver diagnóstico
                  </button>
                </div>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div className="col-md-4 mb-4" key={product.id_producto}>
                <div className="producto-card h-100">
                  <div className="image-container" style={{ position: "relative", height: "250px" }}>
                    <img
                      src={product.img || "/placeholder.svg?height=250&width=300"}
                      alt={product.nombre_producto}
                      className="img-fluid rounded"
                      style={{ height: "250px", objectFit: "cover", width: "100%" }}
                      onError={(e) => {
                        console.log("❌ Error cargando imagen:", e.target.src)
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg?height=250&width=300"
                      }}
                      onLoad={() => {
                        console.log("✅ Imagen cargada:", product.img)
                      }}
                    />
                    {/* Botón para probar imagen */}
                    <button
                      className="btn btn-sm btn-outline-light"
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        fontSize: "10px",
                        padding: "2px 6px",
                      }}
                      onClick={() => testImage(product.img)}
                      title="Probar imagen en nueva pestaña"
                    >
                      🔗
                    </button>
                  </div>
                  <div className="p-3">
                    <h5 className="mt-2">{product.nombre_producto}</h5>
                    <p className="text-muted">
                      {product.marca && product.marca !== "N/A"
                        ? `Marca: ${product.marca}`
                        : `ID: ${product.id_producto}`}
                    </p>
                    <p>{product.descripcion_producto}</p>
                    <p className="fw-bold">${Number(product.precio_producto).toLocaleString()}</p>

                    <form className="producto-form" onSubmit={(e) => addToCart(e, product)}>
                      {/* Selección de talla */}
                      <div className="mb-3">
                        <label htmlFor={`talla_${product.id_producto}`} className="form-label">
                          Talla:
                        </label>
                        <select
                          id={`talla_${product.id_producto}`}
                          className="form-select"
                          required
                          value={selectedSizes[product.id_producto] || ""}
                          onChange={(e) => handleSizeChange(product.id_producto, e.target.value)}
                        >
                          <option value="">Seleccionar talla</option>
                          {(product.tallas_disponibles || ["S", "M", "L", "XL"]).map((talla) => (
                            <option key={talla} value={talla}>
                              {talla.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary w-100">
                        Agregar al carrito
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-warning text-center">
                <h5>📦 No se encontraron productos</h5>
                <p>La conexión funciona pero no hay productos para mostrar.</p>
                <div className="mt-3">
                  <button className="btn btn-outline-primary me-2" onClick={() => fetchProducts()}>
                    Recargar productos
                  </button>
                  <button className="btn btn-outline-secondary me-2" onClick={() => showDebugInfo()}>
                    🔍 Ver debug
                  </button>
                  <button className="btn btn-outline-info" onClick={() => openDiagnostic()}>
                    Ver diagnóstico
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="footer mt-5">
        <div className="container">
          <div className="footer1">
            <p className="parrafo-footer2">WhatsApp: +57 3192193057</p>
            <p className="encuentranos fw-bold">Encuéntranos en:</p>
            <p className="encuentranos">Granzan Victorino, local 304</p>
            <p className="encuentranos">Bogotá - Colombia</p>
          </div>
          <div className="footer2">
            <a href="/">Tienda</a>
            <a href="#">Localizador de tiendas</a>
            <a href="#">Distribuidores</a>
            <a href="#">Preguntas Frecuentes</a>
            <a href="#">Política de Privacidad</a>
            <a href="#">Envíos y devoluciones</a>
          </div>
        </div>
      </footer>

      <style jsx="true">{`
        body {
          background: linear-gradient(rgba(91, 117, 117, 0.5), rgba(0, 0, 0, 0.5)), url(${fondo});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding-top: 80px;
          min-height: 100vh;
        }

        .producto-card {
          border: 1px solid #ddd;
          border-radius: 10px;
          overflow: hidden;
          background-color: #fff;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .producto-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }

        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1030;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .image-container {
          position: relative;
          overflow: hidden;
        }
      `}</style>
    </>
  )
}

export default Productos
