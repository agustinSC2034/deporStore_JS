// Renderizar productos
const renderizarProductos = async () => {
  const resp = await fetch('/stock.json')
  const stock = await resp.json()
  stock.forEach((productos) => {
    const tarjetaPrincipal = document.createElement('div')
    tarjetaPrincipal.innerHTML = `
    <div class="col mb-5 tarjetaIndividual">
    <div class="card h-100 tarjetaMIA item">
    <div class="badge bg-primary text-white position-absolute"
                                style="top: 0.5rem; right: 0.5rem">
                                90% OFF</div>
                            <img class="card-img-top item-img" src=${productos.img} alt="Camiseta de futbol" />
                            <div class="card-body p-4">
                                <div class="text-center">
                                    <h5 class="fw-bolder item-titulo">${productos.nombre}</h5>
                                    <span class="text-muted text-decoration-line-through">5500</span>
                                    <h5 class="fw-bolderPrecio item-precio">${productos.precio}</h5>
                                    <h7 class="fw-bolderPrecio">Pesos</h7>
                                </div>
                            </div>
                            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                <div class="text-center claseBotonTarjeta">
                                    <button type="button" class="btn btn-outline-primary addToCart"
                                        data-id="1">Comprar</button>
                                </div>
                            </div>
                            </div>
                            </div>
    `
    tarjetaTotal.append(tarjetaPrincipal)
    comprarButton.addEventListener("click", comprarCarrito);
    // Tomo todos los botones
    const buttonClick = document.querySelectorAll(".addToCart");
    // Recorro los botones y ejecuto funcion al apretar
    buttonClick.forEach((btn) => {
      btn.addEventListener("click", addToCarritoItem);
      console.log(btn)
    });
  })
}

// Carrito:
let carrito = [];
// Lista de cards donde voy a renderizar productos
const tarjetaTotal = document.querySelector(".listaDeCards")
// Creo var para almacenar html a renderizar
const carritoHtml = document.querySelector(".shoppingCartItemsContainer");
// Boton vaciar carrito
const vaciarButton = document.querySelector(".vaciarButtonCarro");
vaciarButton.addEventListener("click", removeCarrito);
// Boton comprar prueba de SPREAD ARRAY:
const comprarButton = document.querySelector(".comprarButton");


// FUNCIONES
renderizarProductos();

// Agregar item al carro
function addToCarritoItem(event) {
  const button = event.target; // guardo el boton apretado
  const card = button.closest(".tarjetaMIA"); // tomo toda la tarjeta
  const cardImg = card.querySelector(".item-img").src;
  const cardTitle = card.querySelector(".item-titulo").textContent;
  const cardPrice = card.querySelector(".item-precio").textContent;
  swal(cardTitle + " a sido agregado al carrito"); // SweetAlert
  // Agregamos card a la variable newCard
  const newCard = {
    img: cardImg,
    title: cardTitle,
    precio: cardPrice,
    cantidad: 1,
  };
  // Agregamos card al carrito
  addCardToCarrito(newCard);
}

// Sumo cantidad al item, ejecuto resto de funciones
function addCardToCarrito(newCard) {
  carrito.push(newCard);
  mostrarCarrito(newCard);
}

// Renderizo carrito entero
function mostrarCarrito() {
  carritoHtml.innerHTML = "";
  carrito.map((card) => {
    const trRow = document.createElement("div");
    const Content = `
        <div class="row shoppingCartItem">
        <div class="col-6">
            <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3"> 
            <img src="${card.img}" class="shopping-cart-image">  
            <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${card.title}</h6>
            </div>
        </div>
        <div class="col-2">
            <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <p class="item-price mb-0 shoppingCartItemPrice">${card.precio}</p>
            </div>
        </div>
        <div class="col-4">
            <div
                class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number" min="1"
                    value="${card.cantidad}">
                <button class="btn btn-danger buttonDelete" type="button">X</button>
            </div>
        </div>
    </div>`;
    trRow.innerHTML = Content;
    carritoHtml.append(trRow);
    trRow
      .querySelector(".buttonDelete")
      .addEventListener("click", removeItemCarrito);
    trRow
      .querySelector(".shoppingCartItemQuantity")
      .addEventListener("change", sumaCantidad);
  });
  CarritoTotal();
}

// Sumo total y lo dibujo en pantalla
function CarritoTotal() {
  let Total = 0;
  const cartTotal = document.querySelector(".shoppingCartTotal");
  carrito.forEach((card) => {
    // Le saco el "$" con remplace, convierto string a numero con Number
    const precio = Number(card.precio.replace("$", ""));
    Total = Total + precio * card.cantidad;
  });
  cartTotal.innerHTML = `: $${Total}`;
  guardarEnLocalStorage();
}

// Elimino item del carrrito
function removeItemCarrito(event) { }

// Elimino todo del carrito
function removeCarrito() {
  swal({
    title: "Estas seguro?",
    text: "Una vez vaciado no se puede recuperar",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      carrito = [];
      carritoHtml.innerHTML = "";
      CarritoTotal(); // actualizo total nuevamente
      swal("El carrito ha sido vaciado", {
        icon: "success",
      });
    } else {
    }
  });
}

// Actualizo cantidad al borrar
function sumaCantidad(event) { }

// guardo el carrito en el storage en formato JSON
function guardarEnLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

/* Cuando refresco pantalla se ejecuto la function, Obtengo 'carrito' y lo convierto de
JSON a formato JS, si storage tiene algo rendereriza el carrito como estaba antes */
window.onload = function () {
  const storage = JSON.parse(localStorage.getItem("carrito"));
  if (storage) {
    carrito = storage;
    mostrarCarrito();
  }
};

// Uso de SPREAD DE ARRAYS:
function comprarCarrito() {
  console.log("Gracias por comprar los siguientes articulos")
  console.log(carrito)
  console.log(...carrito)
}


/*
function calculoDeCuotas() {
}
*/
