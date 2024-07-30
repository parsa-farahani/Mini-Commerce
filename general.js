/* --------- Global Elements -------- */
//header
const header = document.querySelector('header');
const categoriesItem = document.querySelector('#main-nav-navigation-list-categories-item');
const categoriesBtn = document.querySelector('#main-nav-navigation-list-categories-btn');
const categoriesSubmenuWrapper = document.querySelector('#main-nav-navigation-list-categories-item-submenu-wrapper');
const categoriesSubmenu = document.querySelector('#main-nav-navigation-list-categories-item-submenu');
const categoriesSubmenuCloseBtn = document.querySelector('#main-nav-navigation-list-categories-item-submenu-close-btn');
const categoriesSublinks = document.querySelectorAll('.main-nav-navigation-list-categories-item-submenu-list-item-link');
//footer
const footer = document.querySelector('.main-footer');
/// Elements Status
const elementIsFixed = {
   header: false,
}
Object.seal(elementIsFixed);
/* End of --------- Elements -------- */

/* ---------- Initial Elements ----------*/
document.querySelectorAll('textarea').forEach(function(e) {
   e.value = e.value.trim();
})
/* End of ---------- Initial Elements ----------*/

/* -------- Header Fixation --------- */
const main = document.querySelector('main');
function setHeaderFixationStyle(state) {  // state : 'fix'/'unfix'
   if (state === 'fix') {
      main.style.marginTop = header.offsetHeight + "px";
      header.classList.add('fixed-header');
   }
   else if (state === 'unfix') {
      if ( !!header.classList.contains('fixed-header') ) {
         main.style.marginTop = "";
         header.classList.remove('fixed-header');
      }
   } else {
      return;
   }
}

function checkHeaderFixationPosY() {
   if (scrollY > 500 && !!elementIsFixed.header) return;
   if (window.scrollY > 1) {
      if (!elementIsFixed.header) {
         setHeaderFixationStyle('fix');
         elementIsFixed.header = true;
      }
   } else {
      if (elementIsFixed.header) {
         setHeaderFixationStyle('unfix');
         elementIsFixed.header = false;
      }
   }
}

const throttledCheckHeaderFixationPosY = throttle(checkHeaderFixationPosY, 1);  // Because this check is sensitive, and there is a chance of failure, we set check-rate to 1ms
if (!header.hasAttribute('data-const')) {
   window.addEventListener('scroll', throttledCheckHeaderFixationPosY);
}
/* End of -------- Header Fixation --------- */

/* --------- Top nav hover menus --------- */
const TOPMENU_OFFSET_TOP = 0;
function showNavMenu(menu, btn) {
   menu.classList.add('active');
   // menu.style.top = TOPMENU_OFFSET_TOP + "px";
   btn.classList.add('active');
   btn.setAttribute('data-isexpanded', 'true');
   btn.setAttribute('aria-expanded', 'true');
   menu.setAttribute('aria-hidden', 'false');
}

function hideNavMenu(menu, btn) {
   menu.classList.remove('active');
   // menu.style.top = "-9999px";
   btn.classList.remove('active');
   btn.setAttribute('data-isexpanded', 'false');
   btn.setAttribute('aria-expanded', 'false');
   menu.setAttribute('aria-hidden', 'true');
}

function toggleNavMenu(menu, btn) {
   if (menu.offsetTop === -9999) {
      showNavMenu(menu, btn);
   } else {
      hideNavMenu(menu, btn);
   }
}

function handleCategoriesBtnEnterKey(e) {
   const key_code = e.keyCode || e.charCode || e.which;
   if (key_code !== 13) return;
   if (categoriesBtn.getAttribute('aria-expanded') === 'false') {
      showNavMenu( categoriesSubmenuWrapper, categoriesBtn);
      categoriesSublinks.forEach(navMenuLink => { // When nav_menu is active, its <a> s are tabbable
         navMenuLink.setAttribute('tabindex', '0')
      })
   } else {
      hideNavMenu( categoriesSubmenuWrapper, categoriesBtn );
      categoriesSublinks.forEach(navMenuLink => { // When nav_menu is active, its <a> s are tabbable
         navMenuLink.setAttribute('tabindex', '-1')
      })
   }
}

categoriesSublinks.forEach(navMenuLink => {  // When submenu is closed(inactive), its sublinks are NOT tabbable, untill user opens the submenu
   navMenuLink.setAttribute('tabindex', '-1')
})

if (window.innerWidth >= 768) {  // large tablets & desktops ,...
   categoriesBtn.addEventListener('mouseenter', function() {
      showNavMenu( categoriesSubmenuWrapper, categoriesBtn);
   });
   categoriesItem.addEventListener('mouseleave', function() {
      hideNavMenu( categoriesSubmenuWrapper, categoriesBtn );
   });
} else {  // mobile phones and portrait laptops
   categoriesBtn.addEventListener('click', function() {
      toggleNavMenu( categoriesSubmenuWrapper, categoriesBtn);
   });
}

categoriesBtn.addEventListener('focus', function(e) {
   categoriesBtn.addEventListener('keydown', handleCategoriesBtnEnterKey);
});
categoriesBtn.addEventListener('blur', function(e) {
   categoriesBtn.removeEventListener('keydown', handleCategoriesBtnEnterKey);
})

categoriesSublinks[0].addEventListener('blur', function(e) {  // When 'tab_back' from submenu, it will be closed
   if ( e.relatedTarget.matches('.main-nav-navigation-list-categories-item-submenu-list-item-link') ) return;
   hideNavMenu( categoriesSubmenuWrapper, categoriesBtn );
   categoriesBtn.setAttribute('aria-expanded', 'false');
   categoriesSublinks.forEach(navMenuLink => { // When nav_menu is inactive, its <a> s are NOT tabbable
      navMenuLink.setAttribute('tabindex', '-1')
   })
})
categoriesSublinks[categoriesSublinks.length - 1].addEventListener('blur', function(e) {  // When 'tab_forward' from submenu(after its "last-item"), it will be closed
   if ( e.relatedTarget.matches('.main-nav-navigation-list-categories-item-submenu-list-item-link') ) return;
   hideNavMenu( categoriesSubmenuWrapper, categoriesBtn );
   categoriesBtn.setAttribute('aria-expanded', 'false');
   categoriesSublinks.forEach(navMenuLink => { // When nav_menu is inactive, its <a> s are NOT tabbable
      navMenuLink.setAttribute('tabindex', '-1')
   })
})
// close button
categoriesSubmenuCloseBtn.addEventListener('click', function(e) {
   toggleNavMenu(categoriesSubmenuWrapper, categoriesBtn);
})
/* End of --------- Top nav hover menus --------- */

/* ------ Products Grid Build & Control ------- */
// Proudct Row
function createProductsRow(productsData) {   /* productsData : [ {name:..., category:..., pice:...} ] */
   const rowWrapper = document.createElement('div');
   rowWrapper.classList.add('products-grid-row-wrapper');
   const row = document.createElement('div');
   row.classList.add('products-grid-row');
   row.setAttribute('data-isscrolling', 'false');
   // left / right areas (gradient & buttons)
   const leftGradient = document.createElement('div');
   leftGradient.classList.add('products-grid-row-gradient-left');
   const rightGradient = document.createElement('div');
   rightGradient.classList.add('products-grid-row-gradient-right');
   const prevBtn = document.createElement('button');
   prevBtn.classList.add('products-grid-row-prev-btn');
   const prevBtnIcon = document.getElementById('icons-template').content.querySelector('.products-grid-row-prev-btn-icon').cloneNode(true);
   prevBtn.appendChild(prevBtnIcon);
   const nextBtn = document.createElement('button');
   nextBtn.classList.add('products-grid-row-next-btn');
   const nextBtnIcon = document.getElementById('icons-template').content.querySelector('.products-grid-row-next-btn-icon').cloneNode(true);
   nextBtn.appendChild(nextBtnIcon);
   leftGradient.appendChild(prevBtn);
   rightGradient.appendChild(nextBtn);
   row.append(leftGradient, rightGradient);
   rowWrapper.appendChild(row);
   // Products(children)
   productsData.forEach(function(productData) {
      const product = createProductElement(productData);  // Creates the product itself
      addProductToGreedRow(row, product);  // Adds product to row
   })

   return rowWrapper;
}

// Individual Proudct Element
function createProductElement(productData) {
   const productCont = document.createElement('article');
   productCont.classList.add('product');
   productCont.setAttribute('itemscope', '');
   productCont.setAttribute('itemtype', 'http://schema.org/Product');
   //img
   const productImgCont = document.createElement('div');
   productImgCont.classList.add('product-img-cont');
   const productImgLink = document.createElement('a');
   productImgLink.href = productData.product_page_URL;
   const productImg = document.createElement('img');
   productImg.classList.add('product-img');
   productImg.src = productData.cardImg.src || "";
   productImg.srcset = productData.cardImg.srcset || "";
   productImg.alt = productData.cardImg.alt || "";
   productImg.setAttribute('loading', 'lazy');
   productImg.setAttribute('itemprop', 'image');
   if ( !!productData.cardImg.attr ) {
      const attrCont = document.createElement('div');
      attrCont.classList.add('img-attr');
      attrCont.innerHTML = productData.cardImg.attr;
      productImgCont.appendChild(attrCont);
   }
   //End of img
   // info
   const productInfoCont = document.createElement('div');
   productInfoCont.classList.add('product-info');
   const titleCont = document.createElement('div');
   titleCont.classList.add('product-info-title-cont');
   const titleName = document.createElement('h3');
   titleName.classList.add('product-info-title-name');
   titleName.setAttribute('itemprop', 'name');
   titleName.innerText = productData.name;
   const titleNameAndCategorySeparator = document.createElement('span');
   titleNameAndCategorySeparator.innerText = " ";
   const categoryLink = document.createElement('a');
   categoryLink.classList.add('product-info-title-category-link');
   categoryLink.setAttribute('itemprop', 'category');
   categoryLink.href = productData.categoryLink;
   categoryLink.innerText = productData.category;
   const productInfoSeparator = document.createElement('hr');
   productInfoSeparator.classList.add('full-separator', 'op-25');
   const priceCont = document.createElement('div');
   priceCont.classList.add('product-info-price-cont');
   const price = document.createElement('div');
   price.classList.add('product-info-price');
   price.setAttribute('itemprop', 'price')
   price.setAttribute('data-currency', 'USD');  /* the "unit" varies according to each region/country, at this website: USD */
   const previousPrice = document.createElement('s');
   const currentPrice = document.createElement('span');
   if (productData.discount === 0) {  // We haven't any discount on this product
      previousPrice.innerText = null;
      currentPrice.innerText = "$" + productData.price.toFixed(2);
      price.setAttribute('content', productData.price);
      price.append(currentPrice);
   } else {  // We have discount on this product (0.0 to 1.0)
      const prevPrice = productData.price;
      const curntPrice = calcDiscountedPrice(productData.price, productData.discount);
      previousPrice.innerText = "$" + prevPrice.toFixed(2);
      currentPrice.innerText = "$" + curntPrice;
      price.setAttribute('content', curntPrice);
      price.append(previousPrice, document.createTextNode(" "), currentPrice);
   }
   const rating = document.createElement('div');
   rating.classList.add('product-info-rating');
   rating.setAttribute('itemprop', 'rating');
   rating.setAttribute('content', productData.rating);  /* 0.0 to 5.0 */
   const ratingIcon = document.getElementById('icons-template').content.querySelector('.product-info-rating-icon').cloneNode(true);
   const ratingNum = document.createElement('span');
   ratingNum.classList.add('product-info-rating-num');
   ratingNum.innerText = productData.rating;
   ratingNum.classList.add( getRatingColor(productData.rating) );
   // ratingIcon.querySelector('.progress-ring__circle').style.strokeDashoffset = "calc(2 * 3.14 * 52 * (1 - " + calcRatingPercent(productData.rating) + "))";
   rating.appendChild(ratingNum);
   rating.appendChild(ratingIcon);
   // End of info
   // footer
   const productFooter = document.createElement('footer');
   productFooter.classList.add('product-footer');
   const viewBtn = document.createElement('a');
   viewBtn.classList.add('product-footer-btn', 'product-view-btn');
   viewBtn.href = productData.product_page_URL;
   viewBtn.innerText = "view";
   const addToCartBtn = document.createElement('button');
   addToCartBtn.classList.add('product-footer-btn', 'product-add-btn');
   addToCartBtn.setAttribute('type', 'button');
   addToCartBtn.innerText = "add to cart";
   const markBtn = document.createElement('button');
   markBtn.classList.add('product-footer-btn', 'product-mark-btn');
   markBtn.setAttribute('type', 'button');
   markBtn.setAttribute('aria-label', 'mark');
   const markIcon = document.getElementById('icons-template').content.querySelector('.product-mark-btn-icon').cloneNode(true);
   markBtn.appendChild(markIcon);
   // End of footer
   // Nestings
   productCont.append(productImgCont, productInfoCont);
   productImgLink.append(productImg);
   productImgCont.append(productImgLink);
   productInfoCont.append(titleCont, productInfoSeparator, priceCont, productFooter);
   titleCont.append(titleName, titleNameAndCategorySeparator, categoryLink);
   priceCont.append(price, rating);
   productFooter.append(viewBtn, addToCartBtn, markBtn);
   // End of Nestings
   return productCont;
   function calcDiscountedPrice(price, discount) {
      let finalPrice = price - (price * (discount * 100) / 100);
      return finalPrice.toFixed(2);
   }
   function getRatingColor(rating = 0) {
      if (rating < 2) {
         return 'weak';
      } else if (rating < 4) {
         return 'normal';
      } else if (rating < 4.5) {
         return 'good';
      } else {
         return 'excellent';
      }
   }
   function calcRatingPercent(ratingBy5) {  /* Gets a rating(0.0 to 5.0) and converts it to (0.0 to 1.0) */
      const rating = (2 * (ratingBy5 * 10)) / 100;  // e.g 4.7/5 -> 2 * 47/50 -> 95/100 -> 0.95
      return rating;
   }
}

function addProductToGreedRow(row, product) {
   row.appendChild(product);
}



//Controls
function addRowControls() {
   document.querySelectorAll('.products-grid-row-wrapper').forEach(function(rowWrapper) {
      const row = rowWrapper.querySelector('.products-grid-row');
      const leftGradient = rowWrapper.querySelector('.products-grid-row-gradient-left');
      const rightGradient = rowWrapper.querySelector('.products-grid-row-gradient-right');
      const prevBtn = rowWrapper.querySelector('.products-grid-row-prev-btn');
      const nextBtn = rowWrapper.querySelector('.products-grid-row-next-btn');

      checkForBtnsAppearance();

      row.addEventListener('scroll', function(e) {
         checkForBtnsAppearance();
      })
      
      prevBtn.addEventListener('click', function(e) {
         if ((row.getAttribute('data-isscrolling')) === 'true' ) return;
         if (row.scrollLeft === 0) return;
         if (row.scrollLeft < row.offsetWidth) {
            // row.scrollTo(0, 0);
            // scrollX(0, 'left');
            row.scrollTo({
               left: 0,
               behavior: 'smooth',
            });
            checkForBtnsAppearance();
         } else {
            // row.scrollTo(row.scrollLeft - row.offsetWidth, 0);
            // scrollX(row.scrollLeft - row.offsetWidth, 'left');
            row.scrollTo({
               left: row.scrollLeft - row.offsetWidth,
               behavior: 'smooth',
            });
            checkForBtnsAppearance();
         }
      })

      nextBtn.addEventListener('click', function(e) {
         if ( (row.getAttribute('data-isscrolling')) === 'true' ) return;
         const maxScrollX = row.scrollWidth - row.offsetWidth;
         if (row.scrollLeft === maxScrollX ) return;  // SO th scroll is in the end
         const widthAfterPage = row.scrollWidth - (row.scrollLeft + row.offsetWidth);
         if (widthAfterPage < row.offsetWidth) {
            // row.scrollTo(maxScrollX, 0);
            // scrollX(maxScrollX, 'right');
            row.scrollTo({
               left: maxScrollX,
               behavior: 'smooth',
            });
            checkForBtnsAppearance();
         } else {
            // row.scrollTo(row.scrollLeft + row.offsetWidth, 0);
            // scrollX(row.scrollLeft + row.offsetWidth, 'right');  // my custom scroll function
            row.scrollTo({
               left: row.scrollLeft + row.offsetWidth,
               behavior: 'smooth',
            });
            checkForBtnsAppearance();
         }
      })

      function scrollX(desX, dir) {  /* desX : number , dir : 'left' / 'right' */
         row.setAttribute('data-isscrolling', 'true');
         elementIsScrolling
         let remainedX = Math.abs(row.scrollLeft - desX);
         const speedFactor = 0.1;

         if (remainedX < 1) {
            row.scrollTo(desX, 0);
            remainedX = 0;
            checkForBtnsAppearance();
         } else {
            row.scrollTo( row.scrollLeft + (((dir === 'left') ? -1 : 1) * Math.ceil(remainedX * speedFactor)) , 0);
            remainedX = Math.abs(row.scrollLeft - desX);
         }
         if (remainedX > 0) {
            requestAnimationFrame(() => scrollX(desX, dir));
         } else {
            row.setAttribute('data-isscrolling', 'false');
            checkForBtnsAppearance();
            return;
         }
      }

      function checkForBtnsAppearance() {
         if (row.scrollWidth > window.screen.availWidth) {
            if (row.scrollLeft === 0) {  // so we are in the start of the row (prev-btn must be disappeared)
               hideRowBtn('left');
               appearRowBtn('right');
            } else if (row.scrollLeft === (row.scrollWidth - row.offsetWidth) ) {   // so we are in the end of the row (next-btn must be disappeared)
               hideRowBtn('right')
               appearRowBtn('left');
            } else {
               appearRowBtn('both');
            }
         } else {
            hideRowBtn('both');
         }
         
         function hideRowBtn(which) {  /* which : left / right / both */
            if (which === 'left') {
               leftGradient.style.opacity = "0";
               leftGradient.style.zIndex = "-10";
               prevBtn.setAttribute('tabindex', -1);
            } else if (which === 'right') {
               rightGradient.style.opacity = "0";
               rightGradient.style.zIndex = "-10";
               nextBtn.setAttribute('tabindex', -1);
            } else if (which === 'both') {
               leftGradient.style.opacity = "0";
               leftGradient.style.zIndex = "-10";
               prevBtn.setAttribute('tabindex', -1);
               rightGradient.style.opacity = "0";
               rightGradient.style.zIndex = "-10";
               nextBtn.setAttribute('tabindex', -1);
            }else {
               return
            }
         }
         function appearRowBtn(which) {  /* which : left / right / both */
            if (which === 'left') {
               leftGradient.style.opacity = "1";
               leftGradient.style.zIndex = "10";
               prevBtn.setAttribute('tabindex', 0);
            } else if (which === 'right') {
               rightGradient.style.opacity = "1";
               nextBtn.setAttribute('tabindex', 0);
               rightGradient.style.zIndex = 10;
            } else if (which === 'both') {
               leftGradient.style.opacity = "1";
               leftGradient.style.zIndex = "10";
               prevBtn.setAttribute('tabindex', 0);
               rightGradient.style.opacity = "1";
               nextBtn.setAttribute('tabindex', 0);
               rightGradient.style.zIndex = 10;
            } else {
               return
            }
         }
      }
   })
}
/* End of ------ Products Grid Build & Control ------- */

/* ----- Change Theme Button ------ */
let darkModeState = localStorage.getItem('darkMode');
const themeBtn = document.querySelector('#main-nav-navigation-list-changetheme-btn');

window.addEventListener('DOMContentLoaded', (e) => {
   darkModeState = localStorage.getItem('darkMode');
   if (darkModeState === 'enabled') {
      enableDarkMode();
      localStorage.setItem('darkMode', 'enabled');
   } else {  /* null or .... */
      disableDarkMode();
      localStorage.setItem('darkMode', null);
   }
})

const enableDarkMode = () => {
   document.querySelector('body').classList.add('darktheme');
}
const disableDarkMode = () => {
   document.querySelector('body').classList.remove('darktheme');
}

themeBtn.addEventListener("click", (e) => {
   darkModeState = localStorage.getItem('darkMode');
   if (darkModeState === 'enabled') {
      disableDarkMode();
      localStorage.setItem('darkMode', null);
   } else {  /* null or .... */
      enableDarkMode();
      localStorage.setItem('darkMode', 'enabled');
   }
})
/* End of -- Change Theme Button ------ */

/* ------ Global Functions -------- */
// Ensures that given function won't be called, untill user stops calling and a timeout is spent (wont execute current invokation, untill user stops the calling function and a timeout is spent)
function debounce(func, delay) {
   let timeout;
   return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(function() {
         func.apply(this, args);
      }, delay)
   }
}

// Ensures that function be called only after a certain timeout (executes for each one of invokations, but after spending a certain timeout)
function throttle(func, delay) {
   let throttled = false;
   return function(...args) {
      if (!throttled) {
         func.apply(this, args);
         throttled = true;
         setTimeout(() => {
            throttled = false;
         }, delay);
      }
   };
}
/* End of ------ Global Functions -------- */

/* -------- Components Controls ------- */
/* ------- # Custom Selects ----- */
const customSelects = document.querySelectorAll('.custom-select');

customSelects.forEach(cSelect => {
   // <select> element (which is itslef inside customSelect and is display:none)
   const selectElement = cSelect.querySelector('select');
   // current selected-option
   const selectedOption = document.createElement('div');
   selectedOption.classList.add('custom-select-selected-option');
   selectedOption.setAttribute('tabindex', '0');
   selectedOption.setAttribute('aria-label', 'selected option');
   selectedOption.setAttribute('aria-expanded', 'false');
   selectedOption.innerText = selectElement.options[selectElement.selectedIndex].innerText;
   cSelect.appendChild(selectedOption);
   // list of all options
   const optionsList = document.createElement('div');
   optionsList.classList.add('custom-select-options-list');
   optionsList.setAttribute('role', 'menu');
   optionsList.setAttribute('aria-hidden', 'true');
   // Generating custom 'option's for each  <option> element (which are hided by display:none)
   [...selectElement.options].forEach((option, i) => {
      const customOption = document.createElement('div');
      customOption.classList.add('custom-select-option');
      if (option.hasAttribute('selected')) customOption.classList.add('active');
      customOption.setAttribute('tabindex', '0');
      customOption.innerText = selectElement.options[i].innerText;
      // when a custom option is clicked
      customOption.addEventListener('click', function(e) {
         const cOption = this;
         const crntSelectElement = cOption.closest('.custom-select').querySelector('select');
         const crntSelectedOption = cOption.closest('.custom-select').querySelector('.custom-select-selected-option');
         [...crntSelectElement.options].forEach((optionElement, i) => {
            if ( cOption.innerText === optionElement.innerText ) {
               crntSelectElement.selectedIndex = i;
               crntSelectedOption.innerText = cOption.innerText;
               const activeOptions = cOption.closest('.custom-select-options-list').querySelectorAll('.active');
               activeOptions.forEach(activeOption => {
                  activeOption.classList.remove('active');
               })
               cOption.classList.add('active');
            }
         })
         crntSelectedOption.click();
      })
      customOption.addEventListener('keypress', function(e) {
         e.stopPropagation();
         this.click();
      })
      optionsList.appendChild(customOption);
   })
   cSelect.appendChild(optionsList);
   selectedOption.addEventListener('click', function(e) {
      e.stopPropagation();
      const optionsList = this.nextElementSibling;
      closeAllCustomSelects(this);
      // optionsList.classList.toggle('shown');
      (optionsList.classList.contains('shown') ? optionsList.classList.remove('shown') : optionsList.classList.add('shown'))
      optionsList.setAttribute('aria-hidden', (optionsList.getAttribute('aria-hidden') === 'true') ? 'false' : 'true');
      this.classList.toggle('active');
      this.setAttribute('aria-expanded', (this.getAttribute('aria-expanded') === 'true') ? 'false': 'true' )
   })
   selectedOption.addEventListener('keypress', function(e) {
      this.click();
   })
})

function closeAllCustomSelects(crntSelectedOption) {
   customSelects.forEach((cSelect, i) => {
      const selectedOption = cSelect.querySelector('.custom-select-selected-option');
      const optionsList = cSelect.querySelector('.custom-select-options-list');

      if (selectedOption == crntSelectedOption) {
      } else {
         optionsList.classList.remove('shown');
         selectedOption.classList.remove('active');
      }
   })
}
/* # End of --- Custom Selects ----- */

/* End of ---- Components Controls ------- */
