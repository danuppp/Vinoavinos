document.addEventListener("DOMContentLoaded", function () {
  const contenedorProductos = document.getElementById("contenedor-productos");
  const inputBusqueda = document.getElementById("inputBusqueda");
  const btnCarrito = document.getElementById("btnCarrito");
  const overlay = document.getElementById("overlay");
  const overlayContent = document.getElementById("overlay-content");

  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const storedProductos = JSON.parse(localStorage.getItem("productos")) || [];

  overlay.style.display = 'none';

  inputBusqueda.addEventListener("input", () => {
    const criterioBusqueda = "name";
    const valorBusqueda = inputBusqueda.value;
    const productosFiltrados = filtrarProductosPorCriterio(storedProductos, criterioBusqueda, valorBusqueda);
    contenedorProductos.innerHTML = "";
    if (productosFiltrados.length === 0) {
      mostrarMensajeNoEncontrado();
    } else {
      mostrarProductos(productosFiltrados);
    }
  });

  btnCarrito.addEventListener('click', function (event) {
    event.stopPropagation();
    actualizarContenidoCarrito();
    toggleOverlay();
  });

  overlay.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    overlay.style.display = 'none';
  });

  function toggleOverlay() {
    overlay.style.display = overlay.style.display === 'none' ? 'flex' : 'none';
  }

  function mostrarMensajeNoEncontrado() {
    const mensajeNoEncontrado = document.createElement("div");
    mensajeNoEncontrado.textContent = "Producto no encontrado";
    mensajeNoEncontrado.classList.add("mensaje-no-encontrado");
    contenedorProductos.appendChild(mensajeNoEncontrado);
  }

  function filtrarProductosPorCriterio(productos, criterio, valor) {
    return productos.filter((prod) => {
      const valorProducto = String(prod[criterio]).toLowerCase();
      const valorBusqueda = String(valor).toLowerCase();
      return valorProducto.includes(valorBusqueda);
    });
  }

  const mostrarProductos = (data) => {
    data.forEach((producto) => {
      const cardProducto = document.createElement("div");
      cardProducto.setAttribute("id", "tarjeta.producto");
      cardProducto.innerHTML = `
        <img class="prod-img" src="${producto?.img}" alt="${producto?.name}" style="width: 75px;">
        <div class="prod-description">
          <h3 class="prod.name">${producto?.name}</h3>
          <h4 class="prod.year">${producto.year}</h4>
          <h5 class="prod.grape">${producto?.grape}</h5>
          <h4 class="prod.price">${producto?.price}</h4>
          <button id="${producto.id}" class="btn-compra"><i class="fa-solid fa-cart-shopping"></i></button>
        </div>
      `;
      contenedorProductos.appendChild(cardProducto);
    });

    const btnComprar = document.querySelectorAll(".btn-compra");
    btnComprar.forEach((el) => {
      el.addEventListener("click", (e) => {
        agregarAlCarrito(e.target.id);
        Swal.fire("Se ha añadido al carrito");
      });
    });
  };

  mostrarProductos(storedProductos);

  function agregarAlCarrito(id) {
    let prodEncontrado = storedProductos.find((prod) => prod.id === parseInt(id));

    if (prodEncontrado) {
      const existe = carrito.find((prod) => prod.id === prodEncontrado.id);

      if (existe) {
        existe.cantidad++;
      } else {
        prodEncontrado.cantidad = 1;
        carrito.push(prodEncontrado);
      }

      localStorage.setItem('carrito', JSON.stringify(carrito));
      actualizarContenidoCarrito();
      toggleOverlay();
    }
  }

  function toggleOverlay() {
    overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
  }

  function mostrarCarrito() {
    overlayContent.innerHTML = '';

    if (carrito.length === 0) {
      overlayContent.innerHTML = 'El carrito está vacío';
    } else {
      mostrarProductosEnCarrito(carrito);
    }

    toggleOverlay();
  }

  function sumarCantidad(productoId) {
    const nuevoCarrito = carrito.map((producto) => {
      if (producto.id === productoId) {
        return { ...producto, cantidad: producto.cantidad + 1 };
      }
      return producto;
    });

    carrito = nuevoCarrito;
    actualizarContenidoCarrito();
  }

  function restarCantidad(productoId) {
    const nuevoCarrito = carrito.map((producto) => {
      if (producto.id === productoId) {
        return { ...producto, cantidad: Math.max(producto.cantidad - 1, 1) };
      }
      return producto;
    });

    carrito = nuevoCarrito;
    actualizarContenidoCarrito();
  }

  function eliminarProducto(productoId) {
    carrito = carrito.filter((producto) => producto.id !== productoId);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContenidoCarrito();
  }

  function actualizarContenidoCarrito() {
    const carritoContenido = document.getElementById('carrito-contenido');
    carritoContenido.innerHTML = '';
  
    if (carrito.length === 0) {
      carritoContenido.innerHTML = 'El carrito está vacío';
    } else {
      let totalCarrito = 0;
  
      carrito.forEach((productoCarrito) => {
        const itemCarrito = document.createElement('li');
        itemCarrito.classList.add('card-list');
        itemCarrito.innerHTML = `
          <span>${productoCarrito.name}</span>
          <span>Cantidad: 
            <button class="quantity-btn restar-btn" onclick="restarCantidad(${productoCarrito.id})">-</button>
            ${productoCarrito.cantidad}
            <button class="quantity-btn sumar-btn" onclick="sumarCantidad(${productoCarrito.id})">+</button>
          </span>
          <span>Precio: ${productoCarrito.price}</span>
          <button class="delete-btn" onclick="eliminarProducto(${productoCarrito.id})">&#10006;</button>
        `;
  
        totalCarrito += productoCarrito.cantidad * parseFloat(productoCarrito.price.replace('$', ''));
  
        const btnRestar = itemCarrito.querySelector('.restar-btn');
        const btnSumar = itemCarrito.querySelector('.sumar-btn');
        const btnEliminar = itemCarrito.querySelector('.delete-btn');
  
        btnRestar.addEventListener('click', () => restarCantidad(productoCarrito.id));
        btnSumar.addEventListener('click', () => sumarCantidad(productoCarrito.id));
        btnEliminar.addEventListener('click', () => eliminarProducto(productoCarrito.id));
  
        carritoContenido.appendChild(itemCarrito);
      });
  
      if (carritoContenido.querySelectorAll('.cart-total').length === 0) {
        mostrarTotalCarrito(totalCarrito);
      }
    }
  }
  
  function mostrarTotalCarrito(total) {
    const carritoContenido = document.getElementById('carrito-contenido');
    const totalElement = document.createElement('div');
    totalElement.classList.add('cart-total');
    totalElement.innerHTML = `
      <h3>Total:</h3>
      <span class="total-pagar">$${total.toFixed(2)}</span>
    `;
    carritoContenido.appendChild(totalElement);
  }

  function mostrarProductosEnCarrito(productosCarrito) {
    const carritoContenido = document.getElementById('carrito-contenido');
    carritoContenido.innerHTML = '';

    if (carrito.length === 0) {
      carritoContenido.innerHTML = 'El carrito está vacío';
    } else {
      productosCarrito.forEach((productoCarrito) => {
        const itemCarrito = document.createElement('li');
        itemCarrito.classList.add('card-list');
        itemCarrito.innerHTML = `
          <span>${productoCarrito.name}</span>
          <span>Cantidad: 
            <button class="quantity-btn restar-btn" onclick="restarCantidad(${productoCarrito.id})">-</button>
            ${productoCarrito.cantidad}
            <button class="quantity-btn sumar-btn" onclick="sumarCantidad(${productoCarrito.id})">+</button>
          </span>
          <span>Precio: ${productoCarrito.price}</span>
          <button class="delete-btn" onclick="eliminarProducto(${productoCarrito.id})">&#10006;</button>
        `;

        const btnRestar = itemCarrito.querySelector('.restar-btn');
        const btnSumar = itemCarrito.querySelector('.sumar-btn');
        const btnEliminar = itemCarrito.querySelector('.delete-btn');

        btnRestar.addEventListener('click', () => restarCantidad(productoCarrito.id));
        btnSumar.addEventListener('click', () => sumarCantidad(productoCarrito.id));
        btnEliminar.addEventListener('click', () => eliminarProducto(productoCarrito.id));

        carritoContenido.appendChild(itemCarrito);
      });
    }
  }
});



//DARLE ESTILO AL OVERLAY PARA QUE NO SE QUEDE FIJO EN LA PARTE SUPERIOR IZQUIERDA SI NO SE CIERRA
//LOS PRODUCTOS NO SE AÑADEN AL CARRITO SI DOY CLICK EN EL ICONO, SOLO SI DOY CLICK DENTRO DEL BORDE INV DEL BOTON

