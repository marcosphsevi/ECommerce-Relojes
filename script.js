// Recupera el carrito de sessionStorage o empieza con un array vacío
const carrito = JSON.parse(sessionStorage.getItem('carrito')) || []

const cartItems = document.getElementById('cartItems')
const cartCount = document.getElementById('cartCount')
const cartSubtotal = document.getElementById('cartSubtotal')
const cartTotal = document.getElementById('cartTotal')

// Recibe el id de un producto y lo guarda en el array
function añadirAlCarrito(id, nombre, precio) {
    carrito.push({ id, nombre, precio })
    sessionStorage.setItem('carrito', JSON.stringify(carrito))
    actualizarCarrito()
}

function eliminarDelCarrito(indice) {
    carrito.splice(indice, 1)
    sessionStorage.setItem('carrito', JSON.stringify(carrito))
    actualizarCarrito()
}

// Calcula el total sumando los precios de los productos del carrito
function calcularTotal() {
    let total = 0
    for (let i = 0; i < carrito.length; i++) {
        total += carrito[i].precio
    }
    return total
}

function actualizarCarrito() {
    // Contador del botón del header
    cartCount.textContent = carrito.length

    // Lista de items
    if (carrito.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>'
    } else {
        cartItems.replaceChildren()
        for (let i = 0; i < carrito.length; i++) {
            const item = carrito[i]

            const div = document.createElement('div')
            div.className = 'cart-item'

            const info = document.createElement('div')
            info.className = 'cart-item__info'

            const nombre = document.createElement('span')
            nombre.className = 'cart-item__nombre'
            nombre.textContent = item.nombre

            const precio = document.createElement('span')
            precio.className = 'cart-item__precio'
            precio.textContent = item.precio.toLocaleString('es-ES') + ' €'

            const boton = document.createElement('button')
            boton.className = 'cart-item__eliminar'
            boton.textContent = '✕'
            boton.onclick = function () { eliminarDelCarrito(i) }

            info.appendChild(nombre)
            info.appendChild(precio)
            div.appendChild(info)
            div.appendChild(boton)
            cartItems.appendChild(div)
        }
    }

    // Totales
    const total = calcularTotal()
    cartSubtotal.textContent = total.toLocaleString('es-ES') + ' €'
    cartTotal.textContent = total.toLocaleString('es-ES') + ' €'
}

// Escucha los botones "añadir" de cada tarjeta
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.dataset.id
        const nombre = btn.dataset.nombre
        const precio = parseFloat(btn.dataset.precio)
        añadirAlCarrito(id, nombre, precio)
    })
})

// Botón para vaciar el carrito con FINALIZAR COMPRA

document.querySelector('.btn-full').addEventListener('click', () => {
    carrito.length = 0
    sessionStorage.removeItem('carrito')
    actualizarCarrito()
})

// Carga el carrito al iniciar la página
actualizarCarrito()



//  FILTRADO POR CATEGORÍA

const bontonesFiltrar = document.querySelectorAll('.filter-btn')
const ordenarSeleccion = document.querySelector('.controls__sort select')
const tarjetas = document.querySelectorAll('.product-card')

let categoriaActual = 'todos'

function filtrarPorCategoria(categoria) {
    categoriaActual = categoria
    tarjetas.forEach(card => {
        const cat = card.dataset.categoria
        const visible = categoria === 'todos' || cat === categoria
        card.style.display = visible ? 'flex' : 'none'
    })
}

bontonesFiltrar.forEach(btn => {
    btn.addEventListener('click', () => {
        bontonesFiltrar.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        filtrarPorCategoria(btn.dataset.cat)
    })
})


//  ORDENAR POR PRECIO


function ordenarProductos(orden) {
    const catalogo = document.querySelector('.catalog')
    const tarjetasArray = Array.from(tarjetas)

    tarjetasArray.sort((a, b) => {
        const precioA = parseFloat(a.dataset.precio)
        const precioB = parseFloat(b.dataset.precio)
        return orden === 'asc' ? precioA - precioB : precioB - precioA
    })

    tarjetasArray.forEach(card => catalogo.appendChild(card))
    filtrarPorCategoria(categoriaActual)
}

ordenarSeleccion.addEventListener('change', () => {
    if (ordenarSeleccion.value === 'asc' || ordenarSeleccion.value === 'desc') {
        ordenarProductos(ordenarSeleccion.value)
    }
})
