/* ----------- Elements ---------- */
//main
/// *section 1
const mainIntro = document.querySelector('.main-intro');
/// *section 2
const showcase = document.querySelector('.main-products-showcase');
const showcase_carouselCont = document.querySelector('.main-products-showcase-slider-cont');
const showcase_postsCont = document.querySelector('.main-products-showcase-posts-cont');
const showcase_postsCont_post1 = document.querySelector('#main-products-showcase-post-1');
const showcase_postsCont_post2 = document.querySelector('#main-products-showcase-post-2');
const showcase_postsCont_post3 = document.querySelector('#main-products-showcase-post-3');
const showcase_postsCont_post4 = document.querySelector('#main-products-showcase-post-4');
/// *section 3
const popularProducts = document.querySelector('.main-popular_products');
const popularProducts_title_lSeparator = document.querySelector('.main-popular_products').querySelector('.left-separator');
const popularProducts_title_rSeparator = document.querySelector('.main-popular_products').querySelector('.right-separator');
const popularProducts_products = document.querySelectorAll('.main-popular_products-product');
const popularProducts_bannerProduct = document.querySelector('.main-popular_products-banner-product');
/// *section 4
const specialSale = document.querySelector('.main-special_sale');
const specialSale_panel = document.querySelector('.main-special_sale-panel-cont');
const specialSale_plansCont = document.querySelector('.main-special_sale-plans-banner');
/// *section 5
const newProductsGrid = document.querySelector('.main-new_products-grid');
const newProductsGrid_title_rSeparator = document.querySelector('.main-new_products-grid').querySelector('.right-separator');
/// *section 6
const features = document.querySelector('.main-features');
const features_bar = document.querySelector('.main-features-bar');
/// *section 7
const contactFaqs = document.querySelector('.main-contact-faq');
const contactFaqs_contactCont = document.querySelector('.main-contact-faq-contact-cont');
const contactFaqs_faqsCont = document.querySelector('.main-contact-faq-faqs-cont');
//fixed elements
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
   newProductsGrid_1: {
      x: false,
      y: false,
   },
   newProductsGrid_2: {
      x: false,
      y: false,
   },
   slider: {
      x: false,
      y: false,
   }
}
////Elements' Apeearance State
const elementIsAppeared = {  // flags defined, to call addStyle/removeStyle functions of each section(from top to bottom of page), only once per "window.onscroll" s
   showcase: false,
   showcase_carouselCont: false,
   showcase_postsCont: false,
   popularProducts: false,
   popularProducts_title_lSeparator: false,
   popularProducts_title_rSeparator: false,
   popularProducts_products: false,
   popularProducts_bannerProducts: false,
   specialSale: false,
   specialSale_panel: false,
   specialSale_plansCont: false,
   newProductsGrid: false,
   newProductsGrid_title_rSeparator: false,
   features: false,
   features_bar: false,
   contactFaqs: false,
   contactFaqs_contactCont: false,
   contactFaqs_faqsCont: false,
}

Object.seal(elementIsScrolling);
Object.seal(elementIsAppeared);
/* End of ----------- Elements ---------- */


/* -------- scrollY Direction ------- */
let last_scrollY = window.scrollY;
let scrollY_dir = 'none';
function determineScrollYDir() {
   let current_scrollY = window.scrollY;
   let scrollYDIff = current_scrollY - last_scrollY;
   scrollY_dir = (scrollYDIff < 0) ? 'up' : (scrollYDIff > 0) ? 'down' : 'none';
   last_scrollY = current_scrollY;
}
window.addEventListener('scroll', determineScrollYDir)
/* End of -------- scrollY Direction ------- */

/* -------- Main Intro Banner Background Animation ---------- */
const mainIntroBannerCont = document.querySelector('.main-intro-banner-cont');
function animateBackgroundImage(element) {
   let backgroundImgPosY = 0;
   let MAX_POSY = -440;
   moveUp();

   function moveUp() {
      backgroundImgPosY -= 1;
      element.style.backgroundPosition = "center " + backgroundImgPosY + "px";
      requestAnimationFrame(moveUp);
   }
}
// animateBackgroundImage(mainIntroBannerCont);
/* End of -------- Main Intro Banner Background Animation ---------- */

/* ----------- Showcase Sider ---------- */
const sliderCont = document.querySelector('.main-products-showcase-slider-cont');
const sliderWraper = document.querySelector('.main-products-showcase-slider-slides-wraper');
const slides = document.querySelectorAll('.main-products-showcase-slider-slide');
const sliderPrevBtn = document.querySelector('#main-products-showcase-slider-sidebtn-prev');
const sliderNextBtn = document.querySelector('#main-products-showcase-slider-sidebtn-next');
const sliderBottomBtns = document.querySelectorAll('.main-products-showcase-slider-bottombtn');
let curntSlideIndex = 0;
let sliderTimeout;


function moveSlides(dir) {  /* dir : 'left'/'right' */
   elementIsScrolling.slider.x = true;
   let curntSlide = slides[curntSlideIndex];
   let nextSlide;
   if (dir === 'left') {
      nextSlide = slides[(curntSlideIndex + 1) % 3];
      prepareSlideFromRight(nextSlide);
      slideXSlide(curntSlide, (-1 * sliderCont.offsetWidth));
      slideXSlide(nextSlide, 0);
      sliderBottomBtns.forEach(btn => {
         btn.setAttribute('data-isactive', 'false');
         btn.setAttribute('aria-passed', 'false');
      });
      sliderBottomBtns[(curntSlideIndex + 1) % 3].setAttribute('data-isactive', 'true');  /* nextSlide becomes active */
      sliderBottomBtns[(curntSlideIndex + 1) % 3].setAttribute('aria-passed', 'true');  /* nextSlide becomes active */
   } else if (dir === 'right') {
      nextSlide = (curntSlideIndex === 0) ? slides[2] : slides[curntSlideIndex - 1];
      prepareSlideFromLeft(nextSlide);
      slideXSlide(curntSlide, (1 * sliderCont.offsetWidth));
      slideXSlide(nextSlide, 0);
      sliderBottomBtns.forEach(btn => {
         btn.setAttribute('data-isactive', 'false');
         btn.setAttribute('aria-passed', 'false');
      });
      sliderBottomBtns[(curntSlideIndex === 0) ? 2 : curntSlideIndex - 1].setAttribute('data-isactive', 'true');  /* nextSlide becomes active */
      sliderBottomBtns[(curntSlideIndex === 0) ? 2 : curntSlideIndex - 1].setAttribute('aria-passed', 'true');  /* nextSlide becomes active */
   }

   curntSlide.setAttribute('aria-hidden', 'true');
   nextSlide.setAttribute('aria-hidden', 'false');


   // Changes to next slide's index , after moving current silde
   if (dir === 'left') {
      curntSlideIndex = (curntSlideIndex + 1) % 3;
   } else if (dir === 'right') {
      curntSlideIndex = (curntSlideIndex === 0) ? 2 : curntSlideIndex - 1;
   }

   function prepareSlideFromRight(slide) {
      slide.style.left = sliderCont.offsetWidth + "px";
   }
   function prepareSlideFromLeft(slide) {
      slide.style.left = (-1 * sliderCont.offsetWidth) + "px";
   }
   function slideXSlide(slide, posX) {  /* dir : 'left'/'right' */
      let slideLeft = parseInt(getComputedStyle(slide).getPropertyValue('left'));
      let remainedX = Math.abs(slideLeft - posX);
      clearTimeout(sliderTimeout);

      const speedFactor = 0.05; // Adjust this value to control animation speed

      if (remainedX < 1) {
         slide.style.left = posX + "px";
         remainedX = 0;
      } else {
         // Calculate the new position based on the speed factor
         const newPosition = slideLeft + (dir === 'left' ? -1 : 1) * Math.ceil(remainedX * speedFactor);
         slide.style.left = newPosition + "px";
         remainedX = Math.abs(slideLeft - posX);
      }

      if (remainedX > 1) {
         requestAnimationFrame(() => slideXSlide(slide, posX));
      } else {
         elementIsScrolling.slider.x = false;
         sliderTimeout = setTimeout(function () {
            moveSlides(dir);
         }, 5000);
      }
   }
}

sliderPrevBtn.addEventListener('click', function(e) {
   if (elementIsScrolling.slider.x === true) return;
   clearTimeout(sliderTimeout);   // cancels automatic slideshow
   moveSlides('right');
})
sliderNextBtn.addEventListener('click', function(e) {
   if (elementIsScrolling.slider.x === true) return;
   clearTimeout(sliderTimeout);   // cancels automatic slideshow
   moveSlides('left');
})

sliderBottomBtns.forEach(function(btn, i) {  // forEach( function(element, index, array){} )  -->  btn: button ,  i: index of btn (0, 1, 2)
   btn.addEventListener('click', function(e) {
      if (elementIsScrolling.slider.x === true) return;
      const indexDiff = Math.abs(i - curntSlideIndex);

      if (indexDiff === 0) {
         return;
      } else if (indexDiff === 1){
         clearTimeout(sliderTimeout);   // cancels automatic slideshow
         (curntSlideIndex > i) ? moveSlides('right') : moveSlides('left');
      } else if (indexDiff === 2) {  //  so  2<-0 or 2->0
         clearTimeout(sliderTimeout);   // cancels automatic slideshow
         (i === 0 && curntSlideIndex === 2) ? moveSlides('left') : moveSlides('right');
      }
   })
})

moveSlides('left');


//Controls
/* End of ----------- Showcase Sider ---------- */

/* ---------- Special_Sale Countdown ----------- */
const timer = document.querySelector('.main-special_sale-panel-counter');
setCountdownTime();

function parseTime(ISOtime) {
   return new Date(ISOtime).getTime();
}

function setCountdownTime() {
   const targetTime = parseTime(timer.getAttribute('datetime'));
   const currentTime = new Date();
   if (targetTime < currentTime.getTime()) {
      timer.innerHTML = "00d:00h:00m:00s";
      return;
   }
   const estimatedTime = targetTime - currentTime.getTime();
   const days = formatZeros( Math.floor(estimatedTime / (24 * 60 * 60 * 1000)) % 30) ;
   const hours = formatZeros( Math.floor(estimatedTime / (60 * 60 * 1000)) % 24) ;
   const mins = formatZeros( Math.floor(estimatedTime / (60 * 1000)) % 60 );
   const secs = formatZeros( Math.floor(estimatedTime / (1000)) % 60 );
   timer.innerHTML = days + "d:" + hours + "h:" + mins + "m:" + secs + "s";
   setTimeout(setCountdownTime, 1000)

   function formatZeros(time) {
      return (time >= 10) ? String(time) : '0' + String(time);
   }
}
/* End of ---------- Special_Sale Countdown ----------- */

/* -------- Products Grid Build & Controls ---------- */
// Build
let productsData;
fetch('js/products-data.json', { method: 'GET' })
   .then( function(res) {
      return res.json();
   } )
   .then( function(data) {
      productsData = data;
      document.querySelector('.main-new_products-grid').appendChild( createProductsRow(productsData) );
      document.querySelector('.main-new_products-grid').appendChild( createProductsRow(productsData) );
      document.querySelector('.main-new_products-grid').appendChild( createProductsRow(productsData) );
      addRowControls();
   } )
   .catch(function(error) {
      console.error('Error fetching products: ', error);
   })
;
/* End of -------- Products Greed Controls ---------- */

/* -------- Contact Form Labels --------- */
Array.from( document.getElementsByClassName('contact-inp') ).forEach(function(e) {
   e.addEventListener('focus', function(e) {
      // e.currentTarget.closest('.form-inp-cont').querySelector('.form-label').style.top = '-10px';
      // e.currentTarget.closest('.form-inp-cont').querySelector('.form-label').style.left = '0px';
      e.currentTarget.closest('.form-inp-cont').querySelector('.form-label').classList.add('active');
   })
   e.addEventListener('blur', function(e) {
      if (e.currentTarget.value !== "") return;
      e.currentTarget.closest('.form-inp-cont').querySelector('.form-label').classList.remove('active');
      // e.currentTarget.closest('.form-inp-cont').querySelector('.form-label').style.top = '';
      // e.currentTarget.closest('.form-inp-cont').querySelector('.form-label').style.left = '';
   })
})
/* End of -------- Contact Form Labels --------- */



if (window.innerWidth > 768) {
   // window.addEventListener('scroll', (e) => {
   //    throttledCheckForAnimations(e);
   // })
   // Intersection Observer for 'keyboard(Tab) users' which don't fire 'scroll event'
   window.addEventListener('DOMContentLoaded', function(e) {
      const sections = [...document.querySelectorAll("section")];
      const sectionObserver = new IntersectionObserver((entries) => {
         entries.forEach((entry) => {
            if (entry.isIntersecting) {
               entry.target.classList.remove('animate-out');
               entry.target.classList.add('animate-in');
            } else {
               entry.target.classList.remove('animate-in');
               entry.target.classList.add('animate-out');
            }
         })
      },
      {
         root: null,
         rootMargin: '0px 0px -400px 0px',
         threshold: 0.0,
      }
   )
      // sectionObserver.observe(sections);
      sections.forEach(section => {
         sectionObserver.observe(section);
      })
   })
}
/* End of ------- Scroll Appearance Animations ------- */

/* --------- Click Events --------- */
document.addEventListener('click', function(e) {
   if ( !e.target.matches('.main-contact-faq-faqs-accordion-item-btn') ) return;
   const btn = e.target;
   const item = btn.closest('.main-contact-faq-faqs-accordion-item');
   const description = item.querySelector('.main-contact-faq-faqs-accordion-item-description');

   if (item.getAttribute('data-isactive') === "true") {
      btn.setAttribute('aria-expanded', 'false');
      item.setAttribute('data-isactive', 'false');
      description.setAttribute('data-isopened', 'false');
      description.setAttribute('aria-hidden', 'true');
      // toggleAccordionItem(description, 'close');
   } else {
      document.querySelectorAll('.main-contact-faq-faqs-accordion-item').forEach(function(item) {
         item.setAttribute('data-isactive', 'false')
         item.querySelector('.main-contact-faq-faqs-accordion-item-btn').setAttribute('aria-expanded', 'false');
         item.querySelector('.main-contact-faq-faqs-accordion-item-description').setAttribute('data-isopened', 'false');
         item.querySelector('.main-contact-faq-faqs-accordion-item-description').setAttribute('aria-hidden', 'true');
      })
      btn.setAttribute('aria-expanded', 'true');
      item.setAttribute('data-isactive', 'true');
      description.setAttribute('data-isopened', 'true');
      description.setAttribute('aria-hidden', 'false');
      // toggleAccordionItem(description, 'open');
   }
})

/* End of --------- Click Events --------- */

/* -------- Lazy Loaded Images --------- */
const lazyBgImages = document.querySelectorAll('.lazy-bg_image');
function checkLazyBgImageVisibility() {
   lazyBgImages.forEach(function(lazyBgImage) {
      const parent_element = lazyBgImage.closest('header') || lazyBgImage.closest('section') || lazyBgImage.closest('footer');
      if (window.scrollY >= (parent_element.offsetTop - 400)) {
         lazyBgImage.classList.add('visible'); 
      }
   })
}
const throttled_checkLazyBgImagesVisibility = throttle(checkLazyBgImageVisibility, 60);
// window.addEventListener('scroll', throttled_checkLazyBgImagesVisibility);
/* End of -------- Lazy Loaded Images --------- */


/* ------- Scroll Appearance Animations ------- */
// Animation Controls
// const topGap = 900;
// function toggleClassName(element, className, state) {   // state: 'add'/'remove'
//    if (state === 'add') {
//       element.classList.add(className);
//    } else if (state === 'remove') {
//       if ( !element.classList.contains(className) ) return;  // if element hasn't this className -> dosen't remove anything
//       element.classList.remove(className);  // if element has this className -> removes it
//    }
// }

// function toggleAnimationName(element, animationName, state, delay=0) {  // state : 'add'/'remove'
//    if (state === 'add') {
//       element.style.animationDelay = delay + "s";
//       element.style.animationName = animationName;
//    } else if (state === 'remove') {
//       element.style.animationName = "";
//    }
// }

// function checkForElementsAnimation(element, topGap, method, appearance_animationName="", disappearance_animationName="", appearance_className="", disAppearance_className="", animationDelay={start: 0, end: 0}) {  // method: 'animation_name'/'class_name'
//    const parent_section = element.closest('section');
//    if ( (window.scrollY >= (parent_section.offsetTop - topGap)) && scrollY_dir === 'down' ) {
//       if (method === 'animation_name') {
//          toggleAnimationName(element, appearance_animationName, 'add', animationDelay.start);
//       } else if (method === 'class_name') {
//          if (!!disAppearance_className) toggleClassName(element, disAppearance_className, 'remove');
//          if (!!appearance_className) toggleClassName(element, appearance_className, 'add');
//       }
//       elementIsAppeared[element] = true;
//    } else if ((window.scrollY < (parent_section.offsetTop - topGap)) && scrollY_dir === 'up') {
//       if (method === 'animation_name') {
//          toggleAnimationName(element, disappearance_animationName, 'add', animationDelay.end);
//       } else if (method === 'class_name') {
//          if (!!appearance_className) toggleClassName(element, appearance_className, 'remove');
//          if (!!disAppearance_className) toggleClassName(element, disAppearance_className, 'add');
//       }
//       elementIsAppeared[element] = false;
//    }
// }

// my custom intersection observer (deactivated due to using IntersectionObserver API)
// function checkForAnimations(e = null) {
//    const scrollYIndicator = scrollY + topGap;
//    if ( scrollY <= (showcase.offsetTop ) ) {  // Showcase Area
//       // checkForElementsAnimation(showcase_carouselCont, 600, 'animation_name', 'appear-up-slider-cont', 'fade-down-slider-cont');
//       // checkForElementsAnimation(showcase_postsCont, 600, 'animation_name', 'appear-left-posts-cont', 'fade-right-posts-cont');
//       checkForElementsAnimation(showcase_postsCont_post1, 800, 'animation_name', 'appear-left-posts-cont', 'fade-right-posts-cont', null, null, {start: 0, end: 0})
//       checkForElementsAnimation(showcase_postsCont_post2, 800, 'animation_name', 'appear-left-posts-cont', 'fade-right-posts-cont', null, null, {start: 0.2, end: 0})
//       checkForElementsAnimation(showcase_postsCont_post3, 800, 'animation_name', 'appear-left-posts-cont', 'fade-right-posts-cont', null, null, {start: 0.4, end: 0})
//       checkForElementsAnimation(showcase_postsCont_post4, 800, 'animation_name', 'appear-left-posts-cont', 'fade-right-posts-cont', null, null, {start: 0.6, end: 0})
//    }
//    else if ( scrollY < (popularProducts.offsetTop ) ) {  // Popular Products Area
//       checkForElementsAnimation(popularProducts_title_lSeparator, 700, 'class_name', null, null, 'grow-left', 'shrink-right');
//       checkForElementsAnimation(popularProducts_title_rSeparator, 700, 'class_name', null, null, 'grow-right', 'shrink-left');
//       checkForElementsAnimation(popularProducts_products[0], 700, 'animation_name', 'appear-up', 'fade-down', null, null, {start: 0.0, end: 0});
//       checkForElementsAnimation(popularProducts_products[1], 700, 'animation_name', 'appear-up', 'fade-down', null, null, {start: 0.2, end: 0});
//       checkForElementsAnimation(popularProducts_products[2], 700, 'animation_name', 'appear-up', 'fade-down', null, null, {start: 0.4, end: 0});
//       // popularProducts_products.forEach(function(product) {
//       // })
//       checkForElementsAnimation(popularProducts_bannerProduct, 700, 'animation_name', 'appear-right', 'fade-left');
//    }
//    else if ( scrollY < (specialSale.offsetTop) ) {  // Special Sale Area
//       checkForElementsAnimation(specialSale_panel, 600, 'animation_name', 'appear-right-special_sale-panel', 'fade-left-special_sale-panel');
//       checkForElementsAnimation(specialSale_plansCont, 600, 'animation_name', 'appear-left-special_sale-plans', 'fade-right-special_sale-plans');
//    }
//    else if ( scrollY < (newProductsGrid.offsetTop) ) {  // New-Products Grid Area
//       checkForElementsAnimation(newProductsGrid_title_rSeparator, 480, 'class_name', null, null, 'grow-right', 'shrink-left');
//    }
//    else if ( scrollY < (features.offsetTop) ) {  // Features Area
//       checkForElementsAnimation(features_bar, 480, 'animation_name', 'appear-up-features-bar', 'fade-down-features-bar');
//    }
//    else if ( scrollY < (contactFaqs.offsetTop) ) {  // Contact-FAQs Area
//       checkForElementsAnimation(contactFaqs_contactCont, 580, 'animation_name', 'appear-right-contact-cont', 'fade-left-contact-cont');
//       checkForElementsAnimation(contactFaqs_faqsCont, 580, 'animation_name', 'appear-left-faqs-cont', 'fade-right-faqs-cont');
//    }
// }

// const throttledCheckForAnimations = throttle(checkForAnimations, 60);