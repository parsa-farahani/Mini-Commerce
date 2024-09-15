/* -------- Elements -------- */
const productsTableBody = document.querySelector('.cart-products-table-body');
const checkOutSubtotal = document.querySelector('.cart-checkout-total-cost-item-value');
const checkOutTotal = document.querySelector('.cart-checkout-final-cost-value');
const storedIcons = document.querySelector('#icons-template').content;
/// Elements Status
////Elements' Scrolling State
const elementIsScrolling = {
   html: {
      x: false,
      y: false,
   },
   body: {
      x: false,
      y: false,
   },
}
/* End of -------- Elements -------- */
let userId = "000001";
let USER;
let CART_PRODUCTS;  // This array of product, in fact must be taken from User object -> user.cart = [], but for now we used a set of products as user's products (cart=products-data.json)
let TOTAL_COST = 0;

/* ------ Initial Information Fetch ------ */
async function getUserInfo() {
   const res = await fetch('js/user-data.json', {method: 'GET'});
   const data = await res.json();
   USER = data.filter(user => user.id === userId)[0];
}

async function getProducts() {
   const res = await fetch('js/cart-products-data.json', {method: 'GET'});
   const data = await res.json();
   CART_PRODUCTS = data;
}

function setUserInfo() {
   document.querySelector('.user-dashboard-user-account-img').src = USER.avatar;
   document.querySelector('.user-dashboard-user-account-username-cont').innerText = USER.username;
}

function createProductTableRow({id, quantity, product}) {  // cartProduct: { quantity: 2, product: {...} }
   const finalPrice = (product.discount > 0) ? applyDiscountOnPrice(product.price, product.discount) : product.price ;
   const tableRow = document.createElement('tr');
   tableRow.classList.add('cart-products-table-row');
   tableRow.id = id;
   const prdocutTableData = document.createElement('td');
   prdocutTableData.classList.add('cart-products-table-data');
   const productTableDataWrapper = document.createElement('div');
   productTableDataWrapper.classList.add('cart-products-table-data-wrapper');
   const productCont = document.createElement('article');
   productCont.classList.add('cart-products-table-data-product');
   const productInnerImageTitleCont = document.createElement('div');
   productInnerImageTitleCont.classList.add('cart-products-table-data-product-image-title-cont');
   const productImgCont = document.createElement('div');
   productImgCont.classList.add('cart-products-table-data-product-img-cont');
   const productImg = document.createElement('img');
   productImg.classList.add('cart-products-table-data-product-img');
   productImg.src = product.cardImg.src || "";
   productImg.srcset = product.cardImg.srcset || "";
   productImg.alt = product.cardImg.alt || "product image";
   if ( !!product.cardImg.attr) {
      const imgAttr = document.createElement('div');
      imgAttr.classList.add('.img-attr');
      imgAttr.innerHTML = product.cardImg.attr;
   }
   const productTitleCont = document.createElement('div');
   productTitleCont.classList.add('cart-products-table-data-product-title-cont');
   const productTitle = document.createElement('h2');
   productTitle.classList.add('cart-products-table-data-product-title');
   productTitle.innerText = product.name;
   const productModelsCont = document.createElement('div');
   productModelsCont.classList.add('cart-products-table-data-product-models-cont');
   Object.entries(product.models).forEach(model => {  // model: [name, {value_name, value_value, isPrefered}]
      [modelName, valuesArr] = model;
      const value = valuesArr.filter(valueObj => valueObj.isPreferred === true)[0];

      const modelCont = document.createElement('div');
      modelCont.classList.add('cart-products-table-data-product-model');
      const modelNameCont = document.createElement('div');
      modelNameCont.classList.add('cart-products-table-data-product-model-name');
      modelNameCont.innerText = modelName;
      const colon = document.createElement('span');
      colon.innerText = " : ";
      modelNameCont.append(colon);
      const modelValueCont = document.createElement('div');
      modelValueCont.classList.add('cart-products-table-data-product-model-value');
      modelValueCont.innerText = value.name;
      modelCont.append(modelNameCont, modelValueCont);
      productModelsCont.append(modelCont);
   })
   const productLink = document.createElement('a');
   productLink.classList.add('cart-products-table-data-product-link');
   productLink.href = product.product_page_URL;
   productLink.setAttribute('title', 'View Product');

   const quantityTableData = document.createElement('td');
   quantityTableData.classList.add('cart-products-table-data');
   const quantityTableDataWrapper = document.createElement('div');
   quantityTableDataWrapper.classList.add('cart-products-table-data-wrapper', 'quantity-wrapper');
   const quantityCont = document.createElement('div');
   quantityCont.classList.add('quantity-cont');
   const quantityNum = document.createElement('div');
   quantityNum.classList.add('cart-products-table-data-quantity-num');
   quantityNum.innerText = quantity;
   const quantityDecreaseBtn = document.createElement('button');
   quantityDecreaseBtn.classList.add('cart-products-table-data-quantity-btn', 'decrease-btn');
   quantityDecreaseBtn.setAttribute('type', 'button');
   const quantityDecreaseBtnIcon = storedIcons.querySelector('.cart-products-table-data-quantity-minus-btn-icon').cloneNode(true);
   quantityDecreaseBtn.append(quantityDecreaseBtnIcon);
   const quantityIncreaseBtn = document.createElement('button');
   quantityIncreaseBtn.classList.add('cart-products-table-data-quantity-btn', 'increase-btn');
   quantityIncreaseBtn.setAttribute('type', 'button');
   const quantityIncreaseBtnIcon = storedIcons.querySelector('.cart-products-table-data-quantity-plus-btn-icon').cloneNode(true);
   quantityIncreaseBtn.append(quantityIncreaseBtnIcon);
   const removeCont = document.createElement('div');
   removeCont.classList.add('quantity-remove-cont');
   const removeBtn = document.createElement('button');
   removeBtn.setAttribute('type', 'button');
   removeBtn.classList.add('quantity-remove-btn');
   removeBtn.innerText = "Remove";

   const priceTableData = document.createElement('td');
   priceTableData.classList.add('cart-products-table-data');
   const priceTableDataWrapper = document.createElement('div');
   priceTableDataWrapper.classList.add('cart-products-table-data-wrapper', 'price-cont');
   priceTableDataWrapper.innerText = "$" + finalPrice;

   const totalTableData = document.createElement('td');
   totalTableData.classList.add('cart-products-table-data');
   const totalTableDataWrapper = document.createElement('div');
   totalTableDataWrapper.classList.add('cart-products-table-data-wrapper', 'total-cont');
   totalTableDataWrapper.innerText = "$" + (quantity * finalPrice).toFixed(2);
   TOTAL_COST += Number((quantity * finalPrice).toFixed(2));

   // Nestings
   productImgCont.append(productImg);
   productTitleCont.append(productTitle, productModelsCont);
   productInnerImageTitleCont.append(productImgCont, productTitleCont);
   productCont.append(productInnerImageTitleCont, productLink);
   productTableDataWrapper.append(productCont);
   prdocutTableData.append(productTableDataWrapper);

   quantityCont.append(quantityDecreaseBtn, quantityNum, quantityIncreaseBtn);
   removeCont.append(removeBtn);
   quantityTableDataWrapper.append(quantityCont, removeCont);
   quantityTableData.append(quantityTableDataWrapper);
   priceTableData.append(priceTableDataWrapper);
   totalTableData.append(totalTableDataWrapper);
   tableRow.append(prdocutTableData, quantityTableData, priceTableData, totalTableData);
   return tableRow;
   // Inner functions
   function applyDiscountOnPrice(price, discount) {
      return ( price - ( (price * (discount * 100)) / 100 ) ).toFixed(2);
   }
}

function createEmptyCartNotice() {
   const tableRow = document.createElement('tr');
   tableRow.classList.add('cart-products-table-row');
   const tableData = document.createElement('td');
   tableData.classList.add('cart-products-table-data');
   tableData.setAttribute('colspan', 4);
   const emptyCartNoticeWrapper = document.createElement('div');
   emptyCartNoticeWrapper.classList.add('cart-products-table-data-wrapper', 'empty-cart-wrapper');
   const emptyCartNotice = document.createElement('div');
   emptyCartNotice.classList.add('table-empty-cart-notice');
   emptyCartNotice.innerText = "Your Cart is Empty !";

   // Nestings
   emptyCartNoticeWrapper.append(emptyCartNotice);
   tableData.append(emptyCartNoticeWrapper);
   tableRow.append(tableData);
   return tableRow;
}

function setProductsInfo() {
   // CART_PRODUCTS = [];
   if (CART_PRODUCTS.length > 0) {
      CART_PRODUCTS.forEach(cartProduct => {
         productsTableBody.append( createProductTableRow(cartProduct) );
      })
   } else {
      productsTableBody.append ( createEmptyCartNotice() );
   }
}

function setCheckoutInfo() {
   TOTAL_COST = TOTAL_COST.toFixed(2);
   checkOutSubtotal.innerText = "$" + TOTAL_COST;
   checkOutTotal.innerText = "$" + TOTAL_COST;
}

function setCartInfo() {
   getUserInfo()
      .then(() => {
         setUserInfo();
         getProducts()
            .then(() => {
               setProductsInfo();
               setCheckoutInfo();
            })
            .catch(error => console.error("Fetch Error: ", error))
         ;
      })
      .catch(error => console.error("Fetch Error: ", error))
   ;
}
window.addEventListener('DOMContentLoaded', setCartInfo);
/* End of ------ Initial Information Fetch ------ */

/* --------- UI Functions -------- */
function updateQuantityChange(tableRow, cartProduct) {
   tableRow.querySelector('.cart-products-table-data-quantity-num').innerText = cartProduct.quantity;
   console.log(tableRow.querySelector('.price-cont'))
   const totalPrice = parseFloat(tableRow.querySelector('.price-cont').innerText.slice(1)) * cartProduct.quantity;
   TOTAL_COST = TOTAL_COST - parseFloat(tableRow.querySelector('.total-cont').innerText.slice(1)) + totalPrice;
   tableRow.querySelector('.total-cont').innerText = "$" + totalPrice.toFixed(2);
   setCheckoutInfo();  // updates checkout total costs
}

function changeProductQuantity(btn, state) {  // state: 'dec'/'inc'
   const tableRow = btn.closest('.cart-products-table-row');
   const cartProduct = CART_PRODUCTS.filter(cProduct => cProduct.id === tableRow.id)[0];
   if (state === 'inc') {
      cartProduct.quantity += 1;
   } else if ( (state === 'dec') && cartProduct.quantity > 0 ) {
      cartProduct.quantity -= 1;
   }
   updateQuantityChange(tableRow, cartProduct);
}

function removeCartProduct(btn) {
   const tableRow = btn.closest('.cart-products-table-row');
   const productTotal = parseFloat(tableRow.querySelector('.total-cont').innerText.slice(1));
   TOTAL_COST -= productTotal;
   setCheckoutInfo();
   tableRow.remove();
}

/* End of --------- UI Functions -------- */

/* -------- General Events -------- */
document.addEventListener('click', function(e) {
   if ( !!e.target.closest('.decrease-btn') ) {
      changeProductQuantity(e.target.closest('.decrease-btn'), 'dec');
   }
   if ( !!e.target.closest('.increase-btn') ) {
      changeProductQuantity(e.target.closest('.increase-btn'), 'inc');
   }

   if ( !!e.target.closest('.quantity-remove-btn') ) {
      removeCartProduct( e.target.closest('.quantity-remove-btn') );  // Gets button and does the work
   }
})
/* End of -------- General Events -------- */