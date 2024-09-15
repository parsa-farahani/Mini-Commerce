/*------- Elements ------- */
const resultsTitle = document.querySelector(".search-results-title-text");
const resultsSortInp = document.querySelector("#results-sortby-inp");
// filter elements
const productsGrid = document.querySelector(".search-results-products-grid");
const filtersCont = document.querySelector('.search-filters-sidebar');
const filtersBtn = document.getElementById('filters-btn');
const collapsibleFiltersBtns = document.querySelectorAll(".search-filters-options-form-collapsible-item-btn");
const collapsibleFiltersLabels = document.querySelectorAll('.search-filters-options-form-collapsible-item-list-item-label');
const filterChecks = document.querySelectorAll('.filter-check');
const priceInps = document.querySelectorAll('.search-filters-options-form-price-range-num-inp');
/* End of ------- Elements ------- */
/* ----- Elements Status ----- */
// Elements Scrolling
const elementIsScrolling = {
   html: {
      x: false,
      y: false,
   },
   body: {
      x: false,
      y: false,
   },
   // newProductsGrid_1: {
   //    x: false,
   //    y: false,
   // },
   // newProductsGrid_2: {
   //    x: false,
   //    y: false,
   // },
   // slider: {
   //    x: false,
   //    y: false,
   // }
}
/* End of -- Elements Status ----- */

let PRODUCTS;




/* --- Generating Products in Grid ---- */

async function setProductsData() {
   const res = await fetch('js/all-products-data.json', {method: 'GET'});
   const data = await res.json();
   PRODUCTS = Array.from(data);
}

function setResultsTitle() {
   const searchedWord = location.search.slice(location.search.indexOf('=') + 1);
   resultsTitle.innerText = `${PRODUCTS.length} Results for "${searchedWord}"`
}

function setProductsGrid() {
   PRODUCTS.forEach(productData => {
      productsGrid.appendChild( createProductElement(productData) );
   })
}

function setProductsElements() {
   setResultsTitle();
   setProductsGrid();
}

async function getProducts() {
   setProductsData()
   .then(() => {
      setProductsElements();
   })
   .catch(e => {
      console.log("Error: ", e);
   })
   ;
}

window.addEventListener('DOMContentLoaded', getProducts);
/* End of --- Generating Products in Grid ---- */

/* -------- filters controls -------- */
// functions
function toggleInputAriaCheckedState(inp) {
   if ( inp.getAttribute('aria-checked') === 'false' ) {
      inp.setAttribute('aria-checked', 'true');
   } else {
      inp.setAttribute('aria-checked', 'false');
   }
}

function toggleCollapsibleButtonActivation(btn) {
   const isActive = btn.getAttribute('data-isactive');
   const innerLabels = btn.nextElementSibling.querySelectorAll('.search-filters-options-form-collapsible-item-list-item-label');
   if ( isActive === 'false' || isActive === null || isActive === undefined ) {
      btn.setAttribute('data-isactive', 'true');
      innerLabels.forEach(label => {
         label.setAttribute('tabindex', '0');
      })
   } else {
      btn.setAttribute('data-isactive', 'false');
      innerLabels.forEach(label => {
         label.setAttribute('tabindex', '-1');
      })
   }
}

function toggleCheckActivation(check) {
   const checked = check.getAttribute('data-checked');
   if ( checked === 'false' || checked === null || checked === undefined ) {
      check.setAttribute('data-checked', 'true');
   } else {
      check.setAttribute('data-checked', 'false');
   }
}

function toggleFiltersBtnExpanded() {
   if ( filtersBtn.getAttribute('aria-expanded') === 'false' ) {
      filtersBtn.setAttribute('aria-expanded', 'true');
   } else {
      filtersBtn.setAttribute('aria-expanded', 'false');
   }
}

function toggleFiltersMenu() {
   if (filtersCont.getAttribute('data-isopen') === 'false') {
      filtersCont.classList.add('active');
      filtersCont.setAttribute('data-isopen', 'true');
   } else {
      filtersCont.classList.remove('active');
      filtersCont.setAttribute('data-isopen', 'false');
   }
}

function closeFiltersMenu() {
   filtersCont.classList.remove('active');
   filtersCont.setAttribute('data-isopen', 'false');
   filtersBtn.setAttribute('aria-expanded', 'false');
}

// event handlers
document.addEventListener('click', function(e) {
   const target = e.target;
   // activating collapsible filter-menus
   if ( !!target.closest('.search-filters-options-form-collapsible-item-btn') ) {
      const btn = target.closest('.search-filters-options-form-collapsible-item-btn');
      toggleCollapsibleButtonActivation(btn);
   }
   // activating filter-check s
   else if ( !!target.closest('.search-filters-options-form-collapsible-item-list-item-inp') ) {
      const input = target.closest('.search-filters-options-form-collapsible-item-list-item-inp');
      const label = target.closest('.search-filters-options-form-collapsible-item-list-item-label');
      toggleInputAriaCheckedState(input);
      toggleCheckActivation(label.querySelector('.filter-check'));
   }
   else if ( !!target.closest('.search-filters-options-form-switch-item-inp') ) {
      const input = target.closest('.search-filters-options-form-switch-item-inp');
      const label = target.closest('.search-filters-options-form-switch-item-label');
      toggleInputAriaCheckedState(input);
      toggleCheckActivation(label.querySelector('.filter-check'));
   }
   else if ( !!target.closest('#filters-btn') ) {
      toggleFiltersBtnExpanded(filtersBtn);
      toggleFiltersMenu();
   }
   else if (!!target.closest('.search-filters-sidebar-close-btn')) {
      closeFiltersMenu();
   }
   
   closeAllCustomSelects();
   e.stopPropagation();
})

document.addEventListener('keypress', function(e) {
   const code = e.keyCode || e.charCode || e.which;
   if (code !== 13) return;
   const target = e.target;
   // activating collapsible filter-menus
   if ( !!target.closest('.search-filters-options-form-collapsible-item-btn') ) {
      const btn = target.closest('.search-filters-options-form-collapsible-item-btn');
   }
   else if ( !!target.closest('label') ) {
      const label = target.closest('label');
      label.click();
   }
   
   e.stopPropagation();
})

collapsibleFiltersBtns.forEach(btn => {
   btn.addEventListener('focus', function(e) {
      const target = e.currentTarget;
      const menu = target.closest('.search-filters-options-form-collapsible-item');
      menu.classList.add('backdrop-mist');
   })
   btn.addEventListener('blur', function(e) {
      const target = e.currentTarget;
      const menu = target.closest('.search-filters-options-form-collapsible-item');
      menu.classList.remove('backdrop-mist');
   })
})

// price controls
// slider ranges
const priceMinInp = document.getElementById('price-min-inp');
const priceMaxInp = document.getElementById('price-max-inp');
const priceSlider = document.getElementById('price-slider');
const MIN_PRICE = 0;
const MAX_PRICE = 999999;
let currentPriceMin = MIN_PRICE;
let currentPriceMax = MAX_PRICE;
noUiSlider.create(priceSlider, {
    start: [currentPriceMin, currentPriceMax],
    connect: true,
    range: {
        'min': currentPriceMin,
        'max': currentPriceMax
    }
});

//functions
function setPriceSliderValue(min=currentPriceMin, max=currentPriceMax) {
   priceSlider.noUiSlider.set([+min, +max]);
}

// events
priceInps.forEach(inp => [
   inp.addEventListener('beforeinput', e => {
      const data = e.data;
      if ( isNaN(data) ) {
         e.preventDefault();
         return;
      }
   })
])

priceMinInp.addEventListener('beforeinput', e => {
   entryValue = Number(priceMinInp.value + e.data);
   if (entryValue > currentPriceMax) {
      e.preventDefault();
   }
})
priceMinInp.addEventListener('input', e => {
   currentPriceMin = Number(priceMinInp.value);
   setPriceSliderValue();
})

priceMaxInp.addEventListener('beforeinput', e => {
   entryValue = Number(priceMaxInp.value + e.data);
   if (entryValue > MAX_PRICE) {
      e.preventDefault();
   }
})
priceMaxInp.addEventListener('input', e => {
   const value = Number(priceMaxInp.value);
   if (value < currentPriceMin) {
      currentPriceMax = currentPriceMin;
   } else {
      currentPriceMax = value;
   }
   setPriceSliderValue();
})

// slider range events
priceSlider.noUiSlider.on('update', function(e) {
   const [min, max] = e;
   priceMinInp.value = Number(min);
   priceMaxInp.value = Number(max);
});


/* End of --- filters controls -------- */