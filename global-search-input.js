/* -------- Elements -------- */
const searchInput = document.querySelector('#main-nav-search-cont-form-input');
const mainNavSearchClearBtn = document.querySelector('#main-nav-search-cont-form-clear-btn');
/* End of -------- Elements -------- */

/* -------- clear button control --------- */
function showBtn(btn) {
   btn.style.transform = 'translateX(0px)';
   btn.setAttribute('tabindex', '0');
}

function hideBtn(btn) {
   btn.style.transform = 'translateX(-9999px)';
   btn.setAttribute('tabindex', '-1')
}

function checkForShowHideClearBtn(e) {
   if (e.currentTarget.value.length > 0) {
      showBtn(mainNavSearchClearBtn);
   } else {
      hideBtn(mainNavSearchClearBtn)
   }
}

const throttledCheckForShowHideClearBtn = throttle(checkForShowHideClearBtn, 1);

searchInput.addEventListener('input', throttledCheckForShowHideClearBtn);

mainNavSearchClearBtn.addEventListener('click', function(e) {
   e.preventDefault();
   searchInput.value = "";
   hideBtn(mainNavSearchClearBtn);
})
/* End of -------- clear button control --------- */

/* ----------- input focus styles ------------ */
searchInput.addEventListener('focus', function(e) {
   this.closest('form').classList.add('backdrop-mist');
})
searchInput.addEventListener('blur', function(e) {
   if (! this.closest('form').classList.contains('backdrop-mist')) return;
   this.closest('form').classList.remove('backdrop-mist');
})
/* End of ---- input focus styles ------------ */