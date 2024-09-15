/* ------- Elements --------- */
const backToTopBtn = document.querySelector('.back_to_top-btn');
/* End of ------- Elements --------- */


/* ------- Back_To_Top_Button control ------- */
function checkBackToTopBtnAppearance() {
   if (window.scrollY >= 200 ) {
      backToTopBtn.style.right = '10px';
   } else {
      backToTopBtn.style.right = '9999px';
   }
}
const throttledCheckBackToTopBtnAppearance = throttle(checkBackToTopBtnAppearance, 60);
window.addEventListener('scroll', throttledCheckBackToTopBtnAppearance);

window.addEventListener('wheel', function(e) {
   if ( !!elementIsScrolling.html.y ) e.preventDefault();
}, {passive: false})

backToTopBtn.addEventListener('click', function(e) {
   if ( !!elementIsScrolling.html.y ) return;
   goBackToTop();
   elementIsScrolling.html.y = true;
})

function goBackToTop() {
   const currentScrollPosY = window.scrollY;
   const speedfactor = 0.1;

   window.scrollTo( 0, currentScrollPosY - Math.ceil(currentScrollPosY * speedfactor) );

   if (window.scrollY > 0) {
      requestAnimationFrame(goBackToTop);
   } else {
      elementIsScrolling.html.y = false;
      resetElementAnimationName(document.body);  // Clears all animations
      return;
   }
}

function resetElementAnimationName(element) {
   element.style.animationName = "";
   const childrenElements = Array.from(element.children);
   if (childrenElements.length > 0) {
      return (childrenElements.forEach( function(child) {resetElementAnimationName(child)} ));
   } else {
      return;
   }
}
/* End of ------- Back_To_Top_Button control ------- */