document.addEventListener("DOMContentLoaded", function () {
  const contenedorProductos = document.getElementById("contenedor-productos");
  const inputBusqueda = document.getElementById("inputBusqueda");
  const btnCarrito = document.getElementById("btnCarrito");
  const overlay = document.getElementById("overlay");

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

  function mostrarMensajeNoEncontrado() {
    const mensajeNoEncontrado = document.createElement("div");
    mensajeNoEncontrado.textContent = "Producto no encontrado";
    mensajeNoEncontrado.classList.add("mensaje-no-encontrado");
    contenedorProductos.appendChild(mensajeNoEncontrado);
    mensajeNoEncontrado.innerHTML = productosFiltrados.length === 0 ? "Producto no encontrado" : "";
  }
  

  function filtrarProductosPorCriterio(productos, criterio, valor) {
    return productos.filter((prod) => {
      const valorProducto = String(prod[criterio]).toLowerCase();
      const valorBusqueda = String(valor).toLowerCase();
      return valorProducto.includes(valorBusqueda);
    });
  }

  const mostrarProductos = (data) => {
    data.forEach((producto, index) => {
      const cardProducto = document.createElement("div");
      cardProducto.classList.add("producto");  // Clase en lugar de id
  
      cardProducto.innerHTML = `
        <img class="prod-img" src="${producto?.img}" alt="${producto?.name}" style="width: 75px;">
        <div class="prod-description">
          <h3 class="prod.name">${producto?.name}</h3>
          <h4 class="prod.year">${producto.year}</h4>
          <h5 class="prod.grape">${producto?.grape}</h5>
          <h4 class="prod.price">${producto?.price}</h4>
          <button class="btn-compra" data-product-id="${producto.id}"><i class="fa-solid fa-cart-shopping"></i></button>
        </div>
      `;
      contenedorProductos.appendChild(cardProducto);
    });
  
    const btnComprar = document.querySelectorAll(".btn-compra");
    btnComprar.forEach((el) => {
      el.addEventListener("click", (e) => {
        const productId = e.currentTarget.getAttribute("data-product-id");
        agregarAlCarrito(productId);
        mostrarAlerta();
      });
    });
  
    const iconosCompra = document.querySelectorAll(".fa-cart-shopping");
    iconosCompra.forEach((icono) => {
      e.stopPropagation();
      icono.addEventListener("click", (e) => {
        const productId = e.currentTarget.parentElement.parentElement.querySelector(".btn-compra").getAttribute("data-product-id");
        agregarAlCarrito(productId);
        mostrarAlerta();
      });
    });
  
    function mostrarAlerta() {
      Swal.fire("Se ha añadido al carrito");
    }
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

      console.log('Carrito actualizado:', carrito);
      localStorage.setItem('carrito', JSON.stringify(carrito));
      console.log('Contenido del LocalStorage:', localStorage.getItem('carrito'));
      actualizarContenidoCarrito();
    }
  }

  function toggleOverlay() {
    overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
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

  function mostrarProductosEnCarrito() {
    const carritoContenido = document.getElementById('carrito-contenido');
    carritoContenido.innerHTML = '';
  
    if (carrito.length === 0) {
      carritoContenido.innerHTML = 'El carrito está vacío';
    } else {
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

  mostrarProductosEnCarrito();

});


//API
//ELIMINAR CONSOLE.LOG