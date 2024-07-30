/* --------- Elements ------- */
const addToCartForm = document.querySelector('#product-add_to_cart-form');
const addToCartFormProductInput = document.querySelector('#product-add_to_cart-product-inp');
const addToCartFormProviderInput = document.querySelector('#product-add_to_cart-provider-inp');

const imagesCont = document.querySelector('.product-info-images-cont');
const carouselImages = document.querySelector('.product-info-images-carousel');
const carouselImagesWrapper = document.querySelector('.product-info-images-carousel-imgs-wrapper');
const carouselPreviewImagesCont = document.querySelector('.product-info-carousel-preview-images-cont');
const carouselPreviewImagesImgConts = document.querySelectorAll('.product-info-carousel-preview-images-img-cont');
const lightbox = document.querySelector('.product-info-images-lightbox');
const lightboxMainImage = document.querySelector('.product-info-images-lightbox-content-main-image');
const lightboxPreviewImagesCont = document.querySelector('.product-info-images-lightbox-content-preview-images-cont');
const magnifierFrame = document.querySelector('.product-info-images-magnifier-frame');
const magnifierCont = document.querySelector('.product-info-images-magnifier');
const magnifierImage = document.querySelector('.product-info-images-magnifier-img');

const productTitle = document.querySelector('.product-info-details-title');
const productShortDescription = document.querySelector('.product-info-details-short_description');
const productRating = document.querySelector('.product-info-details-userinfo-rating-num');
const productReviewsCount = document.querySelector('.product-info-details-userinfo-reviews-count');
const productCommentsCount = document.querySelector('.product-info-details-userinfo-comments-count');

const mainSpecsTableBody = document.querySelector('.product-info-details-properties-specs-table-body');

const productModelsCont = document.querySelector('.product-info-details-properties-models-list');
const productModelsInputs = document.querySelectorAll('.product-info-details-properties-models-item-value-radio-inp');
const productModelsLabels = document.querySelectorAll('.product-info-details-properties-models-item-value-label');

const moreDetailsCont = document.querySelector('.product-more_details-cont');
const moreDetailsShowMoreCont = document.querySelector('.product-more_details-cont-show_more-cont');
const moreDetailsShowMoreBtn = document.querySelector('#product-more_details-cont-show_more-btn');
const moreDetailsDescriptionCont = document.querySelector('.product-more_details-description-cont');
const moreDetailsDescriptionTitle = document.querySelector('.product-more_details-description-title');
const moreDetailsDescriptionText = document.querySelector('.product-more_details-description-text');
const moreDetailsDescriptionContShowMoreCont = document.querySelector('.product-more_details-description-cont-show_more-cont');
const moreDetailsDescriptionContShowMoreBtn = document.querySelector('.product-more_details-description-cont-show_more-btn');
const moreDetailsSpecstableBody = document.querySelector('.product-more_details-specs-table-body');
const moreDetailsPointsList = document.querySelector('.product-more_details-points-list');

const currentProviderInfoCont = document.querySelector('.product-provider-info-cont');
const currentProviderInfoInnerWrapper = document.querySelector('.product-provider-info-inner-wrapper');
const currentProviderTitle = document.querySelector('.product-provider-info-details-provider-title');
const currentProviderRatingCont = document.querySelector('.product-provider-info-rating');
const currentProviderRatingNum = document.querySelector('.product-provider-info-rating-num');
const currentProviderRatingText = document.querySelector('.product-provider-info-rating-text');
const currentProviderContactLink = document.querySelector('.product-provider-info-contact-link');
const currentProviderDeliveryChoices = document.querySelector('.product-provider-info-shopping-properties-delivery-choices');
const currentProviderPriceCont = document.querySelector('.product-provider-info-purchase-price');
const currentProviderAddToCartBtn = document.querySelector('.product-provider-info-purchase-add-btn');

const allProvidersCont = document.querySelector('.product-all_providers-providers-cont');

// section 2 (comments)
const comments = document.querySelector('.comments-cont');
const commentsCount = document.querySelector('.comments-count-num');
const commentsWrapper = document.querySelector('.comments-content-comments-wrapper');
//aside (Related Products)
const relatedProductsCont = document.querySelector('.related_products-cont');

/// Elements Status
const elementIsScrolling = {
   html: {
      x: false,
      y: false,
   },
   body: {
      x: false,
      y: false,
   },
   imagesCarousel: {
      x: false,
      y: false,
   }
}
Object.seal(elementIsScrolling);
/* End of --------- Elements ------- */

/*  ----- Product Information Setup ----- */
let reqProductId = "000003";  // For this example page, we consider that this product-id(000003) is requested through query or any other way by user
let WHOLE_PRODUCTS;
let CURRENT_PRODUCT;
let WHOLE_PROVIDERS;
let CURRENT_PROVIDER;
let COMMENTS;  // Includeing level-1 comments
let WHOLE_COMMENTS = [];  // Including all comments (comments and replies)
let USERS;
let RELATED_PRODUCTS;

let CAROUSEL_CURRENT_INDEX = 0;
let CAROUSEL_BUTTON_CURRENT_INDEX = 0;
let CAROUSEL_IMGS_COUNT = 0;

async function setCurrentProduct() {
   try {
      const res = await fetch( './products-data.json', {method: 'GET'} );
      const data = await res.json();
      WHOLE_PRODUCTS = Array.from(data);
      CURRENT_PRODUCT = WHOLE_PRODUCTS.filter( (product) => {  // Retuns requested product(current product) from all products array
         return (product.id === reqProductId);
      })[0];
      if ( !CURRENT_PRODUCT ) throw("Product was not found");
   } catch (error) {
      console.log("Fetch Error: ", error);
   }
}

function setInitProductFormData() {
   addToCartFormProductInput.value = CURRENT_PRODUCT.id;
   addToCartFormProviderInput.value = CURRENT_PRODUCT.provider;
}

function createCarouselImageContElement(imgObj) {
   const imgCont = document.createElement('div');
   imgCont.classList.add('product-info-images-carousel-img-cont');
   imgCont.setAttribute('data-index', CAROUSEL_IMGS_COUNT++);  // Sets current index for current image, and pluses the index(CAROUSEL_IMGS_COUNT++) for next image, till end
   if (+imgCont.getAttribute('data-index') === CAROUSEL_CURRENT_INDEX) {
      imgCont.setAttribute('data-isactive', 'true');
   } else {
      imgCont.setAttribute('data-isactive', 'false');
   }
   const img = document.createElement('img');
   img.classList.add('product-info-images-carousel-img');
   img.src = imgObj.src;
   img.srcset = imgObj.srcset;
   img.alt = imgObj.alt;
   img.setAttribute('loading', 'lazy');
   img.setAttribute('itemprop', 'image');

   imgCont.appendChild(img);
   return imgCont;
}

function createCarouselPreviewImageContElement(imgObj) {
   const imgCont = document.createElement('button');
   imgCont.classList.add('product-info-carousel-preview-images-img-cont');
   imgCont.setAttribute('type', 'button');
   imgCont.setAttribute('data-isactive', 'false');
   if (CAROUSEL_BUTTON_CURRENT_INDEX === CAROUSEL_CURRENT_INDEX ) {
      imgCont.setAttribute('data-isactive', 'true');
   }
   imgCont.setAttribute('data-index', CAROUSEL_BUTTON_CURRENT_INDEX++);
   const img = document.createElement('img');
   img.classList.add('product-info-carousel-preview-images-img');
   img.src = imgObj.src;
   img.alt = imgObj.alt;
   img.setAttribute('loading', 'lazy');
   
   imgCont.appendChild(img);
   return imgCont;
}

function createLightboxPreviewImageElement(imgObj) {
   const prevImgCont = document.createElement('div');
   prevImgCont.classList.add('product-info-images-lightbox-content-preview-image-cont');
   const prevImg = document.createElement('img');
   prevImg.classList.add('product-info-images-lightbox-content-preview-image');
   prevImg.setAttribute('src', imgObj.src);
   prevImg.setAttribute('alt', imgObj.alt);
   // Nestings
   prevImgCont.appendChild(prevImg);
   return prevImgCont;
}

function setCarouselImages() {
   CURRENT_PRODUCT.imgs.forEach((imgObj, i) => {
      carouselImagesWrapper.appendChild( createCarouselImageContElement(imgObj) );
      carouselPreviewImagesCont.appendChild( createCarouselPreviewImageContElement(imgObj) );
      /* we choose the first image as preferred image of the lightbox */
      if (i === 0) {
         lightboxMainImage.src = imgObj.src;
      }
      lightboxPreviewImagesCont.appendChild( createLightboxPreviewImageElement(imgObj) );
   })
}

function setProductTitle() {
   productTitle.innerText = CURRENT_PRODUCT.name;
   productShortDescription.innerText = CURRENT_PRODUCT.short_description;
   productRating.innerText = CURRENT_PRODUCT.rating;
   productReviewsCount.innerText = CURRENT_PRODUCT.reviewsCount;
   productCommentsCount.innerText = CURRENT_PRODUCT.commentsCount;
}

function createMainSpecTableRow( [name, value] ) {
   const tableRow = document.createElement('tr');
   tableRow.classList.add('product-info-details-properties-specs-table-row');
   const tableHead = document.createElement('th');
   tableHead.classList.add('product-info-details-properties-specs-table-head');
   tableHead.setAttribute('scope', 'row');
   const tableData = document.createElement('td');
   tableData.classList.add('product-info-details-properties-specs-table-data');
   const specNameCont = document.createElement('div');
   specNameCont.classList.add('product-info-details-properties-specs-name');
   const specNameText = document.createElement('div');
   specNameText.classList.add('product-info-details-properties-specs-name-text');
   specNameText.innerText = name;
   const specNameColon = document.createElement('div');
   specNameColon.classList.add('product-info-details-properties-specs-name-colon');
   specNameColon.innerText = " : ";
   const specValueCont = document.createElement('div');
   specValueCont.classList.add('product-info-details-properties-specs-value');
   specValueCont.innerText = value;

   // Nestings
   tableData.append(specValueCont);
   specNameCont.append(specNameText, specNameColon);
   tableHead.append(specNameCont);
   tableRow.append(tableHead, tableData);

   return tableRow;
}

function setProductSpecs() {
   Object.entries(CURRENT_PRODUCT.main_specs).forEach(mainSpec => {  // mainSpec : [ spec_name, spec_value]
      mainSpecsTableBody.appendChild( createMainSpecTableRow(mainSpec) )
   })
}



function createColorModelValueLabel(modelName, {name, value, isPreferred}) {  // modelValue: { name: "", value:"" }
   const valueLabel = document.createElement('label');
   valueLabel.classList.add("product-info-details-properties-models-item-value-label", "product-info-details-properties-models-item-color-label");
   valueLabel.tabIndex = '0';
   valueLabel.setAttribute('data-selected', 'false')
   valueLabel.setAttribute('aria-label', name);  // e.g {name: "orange", value: "#4e12f1"} -> name: "orange"
   valueLabel.style.backgroundColor = value;
   const valueInput = document.createElement('input');
   valueInput.classList.add('product-info-details-properties-models-item-value-radio-inp', 'product-info-details-properties-models-item-color-value-radio');
   valueInput.setAttribute('type', 'radio');
   valueInput.setAttribute('form', 'product-add_to_cart-form');
   valueInput.name = modelName;  // each one of inputs, represent value for name="color"
   valueInput.value = name;
   valueInput.tabIndex = '-1';
   if (isPreferred === true) {
      valueLabel.setAttribute('data-selected', 'true');
      valueInput.checked = true;
   }
   // Nestings
   valueLabel.appendChild( valueInput );
   return valueLabel;
}

function createGeneralModelValueLabel(modelName, {name, value, isPreferred}) {
   const valueLabel = document.createElement('label');
   valueLabel.classList.add('product-info-details-properties-models-item-value-label', 'check-label');
   valueLabel.tabIndex = '0';
   valueLabel.setAttribute('data-selected', 'false');
   const valueTitle = document.createElement('div');
   valueTitle.classList.add('product-info-details-properties-models-item-value-title');
   valueTitle.innerText = name;
   const valueLabelMark = document.createElement('div');
   valueLabelMark.classList.add('product-info-details-properties-models-item-value-label-mark');
   const valueInput = document.createElement('input');
   valueInput.classList.add('product-info-details-properties-models-item-value-radio-inp');
   valueInput.setAttribute('type', 'radio');
   valueInput.setAttribute('form', 'product-add_to_cart-form');
   valueInput.name = modelName;
   valueInput.value = value;
   valueInput.tabIndex = '-1';
   if (isPreferred === true) {
      valueLabel.setAttribute('data-selected', 'true');
      valueInput.checked = true;
   }
   // Nestings
   valueLabel.append(valueTitle, valueLabelMark, valueInput);
   return valueLabel;
}

function createModel( [name, value] ) {
   const modelItem = document.createElement('div');
   modelItem.classList.add('product-info-details-properties-models-item');
   const modelTitle = document.createElement('span');
   modelTitle.classList.add('product-info-details-properties-models-item-name');
   modelTitle.innerText = name;
   const modelValuesGroup = document.createElement('div');
   modelValuesGroup.classList.add('product-info-details-properties-models-item-values-group');

   // Nestings
   if (name === 'color') {  // specifies that this modelGroup is 'color' model or else models
      value.forEach(modelValue => {
         modelValuesGroup.appendChild( createColorModelValueLabel(name, modelValue) );
      })
   } else {
      value.forEach(modelValue => {
         modelValuesGroup.appendChild( createGeneralModelValueLabel(name, modelValue) );
      })
   }
   modelItem.append(modelTitle, modelValuesGroup);
   return modelItem;
}

function setProductModels() {
   Object.entries(CURRENT_PRODUCT.models).forEach(model => {  // ["model_name", ]
      productModelsCont.appendChild( createModel(model) );
   })
}

function setMoreDetailsDescription() {
   moreDetailsDescriptionText.innerText = CURRENT_PRODUCT.long_description;
   // moreDetailsDescriptionText.innerText = "HELO";
   if (moreDetailsDescriptionCont.scrollHeight === moreDetailsDescriptionCont.clientHeight) {
      moreDetailsDescriptionContShowMoreCont.style.display = "none";
   }
}

function createMoreDetailsSpecsTableRow([name, value]) {  // spec : ["name", "value"]
   const specTableRow = document.createElement('tr');
   specTableRow.classList.add('product-more_details-specs-table-row');

   const specTableHead = document.createElement('th');
   specTableHead.classList.add('product-more_details-specs-table-head');
   specTableHead.setAttribute('scope', 'row');
   const specNameCont = document.createElement('div');
   specNameCont.classList.add('product-more_details-specs-name-cont');
   const specNameText = document.createElement('div');
   specNameText.classList.add('product-more_details-specs-name-text');
   specNameText.innerText = name;
   const specNameColon = document.createElement('div');
   specNameColon.classList.add('pproduct-more_details-specs-name-colon');
   specNameColon.innerText = " : ";
   const specTableData = document.createElement('td');
   specTableData.classList.add('product-more_details-specs-table-data');
   const specValueCont = document.createElement('div');
   specValueCont.classList.add('product-more_details-specs-value-cont');
   specValueCont.innerText = value;

   // Nestings
   specTableData.appendChild(specValueCont);
   specNameCont.append(specNameText, specNameColon);
   specTableHead.appendChild(specNameCont);
   specTableRow.append(specTableHead, specTableData);

   return specTableRow;
}

function setMoreDetailsSpecs() {
   Object.entries(CURRENT_PRODUCT.specs).forEach(spec => {  // spec : ["name", "value"]
      moreDetailsSpecstableBody.appendChild( createMoreDetailsSpecsTableRow(spec) );
   })
}

function createMoreDetailsPointsListItem(point) {   // point: "text"
   const moreDetailsListItem = document.createElement('li');
   moreDetailsListItem.classList.add('product-more_details-points-list-item');
   moreDetailsListItem.innerText = point;
   return moreDetailsListItem;
}

function setMoreDetailsPoints() {
   CURRENT_PRODUCT.points.forEach(point => {
      moreDetailsPointsList.appendChild( createMoreDetailsPointsListItem(point) );
   })
}

function setMoreDetailsInfo() {
   setMoreDetailsDescription();
   setMoreDetailsSpecs();
   setMoreDetailsPoints();

   if (moreDetailsCont.scrollHeight === moreDetailsCont.clientHeight) {
      moreDetailsShowMoreCont.style.display = "none";
   }
}

async function getProvidersInfo() {
   const res = await fetch('./providers-data.json');
   const data = await res.json();
   WHOLE_PROVIDERS = data.filter(provider => {
      let hasCurrentProduct = false;
      provider.products.forEach(product => {
         if (product.id === CURRENT_PRODUCT.id) {
            hasCurrentProduct = true;
         }
      })
      if ( !!hasCurrentProduct ) {
         return provider;
      }
   })
   CURRENT_PROVIDER = WHOLE_PROVIDERS.filter(provider => {
      return (provider.name === CURRENT_PRODUCT.provider);
   })[0];
   // CURRENT_PROVIDER = (WHOLE_PROVIDERS.length > 0) ? WHOLE_PROVIDERS[0] : null;
}

function setCurrentProviderInfo() {
   currentProviderTitle.innerText = CURRENT_PROVIDER.name;
   if ( !!CURRENT_PROVIDER.isTop ) {
      const topProviderBadge = document.createElement('span');
      topProviderBadge.classList.add('top-provider-badge');
      topProviderBadge.innerText = 'Top';
      currentProviderTitle.appendChild(topProviderBadge);
   }
   currentProviderRatingNum.innerText = CURRENT_PROVIDER.rating;
   if (CURRENT_PROVIDER.rating >= 4.2) {
      currentProviderRatingCont.style.color = "rgb(77, 255, 116)";
      currentProviderRatingText.innerText = "Excellent";
   } else if (CURRENT_PROVIDER.rating >= 3.5) {
      currentProviderRatingCont.style.color = "rgba(97,228,44,1)";
      currentProviderRatingText.innerText = "Good";
   } else if (CURRENT_PROVIDER.rating >= 2.5) {
      currentProviderRatingCont.style.color = "rgba(255,238,50,1)";
      currentProviderRatingText.innerText = "Not Bad";
   } else {
      currentProviderRatingCont.style.color = "rgba(255,107,50,1)";
      currentProviderRatingText.innerText = "Poor";
   }
   currentProviderContactLink.href = CURRENT_PROVIDER.contact_href;
   CURRENT_PROVIDER.delivery_choices.forEach((choice, i) => {
      currentProviderDeliveryChoices.textContent += (choice + ((i < (CURRENT_PROVIDER.delivery_choices.length - 1) ) ? " | " : "") );
   })
   if (CURRENT_PRODUCT.discount > 0) {
      const currentPrice = CURRENT_PRODUCT.price - (Math.round(CURRENT_PRODUCT.price * CURRENT_PRODUCT.discount * 100) / 100) ;
      currentProviderPriceCont.querySelector('.last-price').innerText = "$" + CURRENT_PRODUCT.price;
      currentProviderPriceCont.querySelector('.current-price').innerText = ("$" + currentPrice);
   } else {
      currentProviderPriceCont.querySelector('.current-price').innerText = ("$" + CURRENT_PRODUCT.price);
   }
   currentProviderAddToCartBtn.setAttribute('data-provider', CURRENT_PROVIDER.name);
}

function createAllProviderItem(provider) {
   const providerCont = document.createElement('article');
   providerCont.classList.add('product-all_providers-provider-cont');
   const providerTitleCont = document.createElement('div');
   providerTitleCont.classList.add('product-all_providers-provider-title-cont');

   const providerTitle = document.createElement('h3');
   providerTitle.classList.add('product-all_providers-provider-title');
   providerTitle.innerText = provider.name;
   if ( !!provider.isTop ) {
      const topProviderBadge = document.createElement('span');
      topProviderBadge.classList.add('top-provider-badge');
      topProviderBadge.innerText = "Top";
      providerTitle.appendChild(topProviderBadge);
   }
   const ratingCont = document.createElement('div');
   ratingCont.classList.add('product-all_providers-provider-rating-cont');
   const rating = document.createElement('div');
   rating.classList.add('product-all_providers-provider-rating');
   const ratingNum = document.createElement('span');
   ratingNum.classList.add('product-all_providers-provider-rating-num');
   ratingNum.innerText = provider.rating;
   const ratingText = document.createElement('span');
   ratingText.classList.add('product-all_providers-provider-rating-text');
   if (provider.rating >= 4.2) {
      rating.style.color = "rgb(77, 255, 116)";
      ratingText.innerText = "Excellent";
   } else if (CURRENT_PROVIDER.rating >= 3.5) {
      rating.style.color = "rgba(97,228,44,1)";
      ratingText.innerText = "Good";
   } else if (CURRENT_PROVIDER.rating >= 2.5) {
      rating.style.color = "rgba(255,238,50,1)";
      ratingText.innerText = "Not Bad";
   } else {
      rating.style.color = "rgba(255,107,50,1)";
      ratingText.innerText = "Poor";
   }
   rating.append(ratingNum, document.createTextNode(" - "), ratingText);

   const contactLink = document.createElement('a');
   contactLink.classList.add('product-all_providers-provider-contact-link');
   contactLink.href = provider.contact_href;
   contactLink.innerText = "Contact to Provider";

   const deliveryCont = document.createElement('div');
   deliveryCont.classList.add('product-all_providers-provider-delivery-cont');
   const deliveryList = document.createElement('ul');
   deliveryList.classList.add('product-all_providers-provider-delivery-list');
   provider.delivery_choices.forEach(choice => {
      const deliveryItem = document.createElement('li');
      deliveryItem.classList.add('product-all_providers-provider-delivery-list-item');
      deliveryItem.innerText = choice;
      deliveryList.appendChild(deliveryItem);
   })
   let currentProduct;
   provider.products.forEach(product => {
      if (product.id === CURRENT_PRODUCT.id) {
         currentProduct = product; 
      }
   })
   const purchaseCont = document.createElement('div');
   purchaseCont.classList.add('product-all_providers-provider-purchase-cont');
   const purchasePriceCont = document.createElement('div');
   purchasePriceCont.classList.add('product-all_providers-provider-purchase-price-cont');
   if (currentProduct.discount > 0) {
      const currentPriceValue = currentProduct.price - ( Math.round(currentProduct.price * (currentProduct.discount * 100)) / 100 );
      const lastPrice = document.createElement('s');
      lastPrice.classList.add('product-all_providers-provider-purchase-price-last');
      lastPrice.innerText = "$" + currentProduct.price;
      const currentPrice = document.createElement('span');
      currentPrice.classList.add('product-all_providers-provider-purchase-price-current');
      currentPrice.innerText = "$" + currentPriceValue;
      purchasePriceCont.append(lastPrice, document.createTextNode(" "), currentPrice);
   } else {
      const currentPrice = document.createElement('span');
      currentPrice.classList.add('product-all_providers-provider-purchase-price-current');
      currentPrice.innerText = "$" + currentProduct.price;
      purchasePriceCont.appendChild(currentPrice);
   }
   const addBtn = document.createElement('button');
   addBtn.classList.add('product-all_providers-provider-purchase-add-btn');
   addBtn.setAttribute('type', 'submit');
   addBtn.setAttribute('form', 'product-add_to_cart-form');
   addBtn.setAttribute('formaction', 'https://httpbin.org/get');
   addBtn.setAttribute('formmethod', 'get');
   addBtn.setAttribute('formtarget', '_blank');
   addBtn.setAttribute('data-provider', provider.name);
   addBtn.onclick = (e) => document.getElementById('product-add_to_cart-provider-inp').value = provider.name;
   addBtn.innerText = "Add to Cart";
   // Nestings
   ratingCont.append(rating, document.createTextNode(" | "), contactLink);
   providerTitleCont.append(providerTitle, ratingCont);
   deliveryCont.append(deliveryList);
   purchaseCont.append(purchasePriceCont, addBtn);
   providerCont.append(providerTitleCont, deliveryCont, purchaseCont);
   return providerCont;
}

function setAllProvidersInfo() {
   if (WHOLE_PROVIDERS.length < 1) return;
   WHOLE_PROVIDERS.forEach(provider => {
      allProvidersCont.appendChild( createAllProviderItem(provider) );
   })
}

function setProvidersInfo() {
   setCurrentProviderInfo();
   setAllProvidersInfo();
}

function setProductProviders() {
   getProvidersInfo()
   .then(() => {
      setProvidersInfo();
   })
}

async function getUsers() {
   const res = await fetch('./user-data.json', {method: 'GET'});
   const data = await res.json();
   USERS = data;
}

function setCommentsCount() {
   commentsCount.innerText = CURRENT_PRODUCT.commentsCount;
}

function pushWholeComments(comment) {
   WHOLE_COMMENTS.push(comment);
   if (comment.replies.length > 0) {
      comment.replies.forEach(reply => {
         pushWholeComments(reply);
      })
   } else {
      return;
   }
}

async function getComments() {
   const res = await fetch('./comments-data.json', {method: 'GET'});
   const data = await res.json();
   COMMENTS = data.filter(commentGroup => commentGroup.product_id === CURRENT_PRODUCT.id)[0].comments;
   COMMENTS.forEach(comment => {
      pushWholeComments(comment);
   })
}


function createComment(comment) {
   const user = USERS.filter(user => user.id === comment.user_id)[0];  // in completed website, in this step, gets 'user_id' from comment and receives information of user(commenter), such as avatar, username, ...., but in this example we do this in this way (just for now, later we'll fix it)
   const commentCont = document.createElement('article');
   commentCont.classList.add('comments-content-comment');
   commentCont.id = comment.id;
   if ( !!comment.isReply ) commentCont.setAttribute('data-reply', '');

   const userImageCont = document.createElement('div');
   userImageCont.classList.add('comments-content-comment-img-cont');
   const userImageLink = document.createElement('a');
   userImageLink.classList.add('comments-content-comment-img-link');
   userImageLink.href = "#";  // for now we havent link to user's account
   const userImage = document.createElement('img');
   userImage.classList.add('comments-content-comment-img');
   userImage.src = user.avatar;
   userImage.alt = "";
   const commentBody = document.createElement('div');
   commentBody.classList.add('comments-content-comment-body');
   const commentBodyContext = document.createElement('div');
   commentBodyContext.classList.add('comments-content-comment-body-context');
   const commenterUsernameCont = document.createElement('div');
   commenterUsernameCont.classList.add('comments-content-comment-body-context-commenter-accountname-cont');
   const commenterUsername = document.createElement('h3');
   commenterUsername.classList.add('comments-content-comment-body-context-commenter-accountname');
   commenterUsername.innerText = user.username;
   let replyCont;
   const commentValue = document.createElement('p');
   commentValue.classList.add('comments-content-comment-body-context-text-cont');
   commentValue.innerText = comment.value;
   const commentFooter = document.createElement('div');
   commentFooter.classList.add('comments-content-comment-body-footer');
   const commentDatetime = document.createElement('time');
   commentDatetime.classList.add('comments-content-comment-body-footer-date-cont');
   commentDatetime.setAttribute('datetime', comment.datetime);
   commentDatetime.innerText = formatCommentDatetime(comment.datetime);
   const replyBtn = document.createElement('button');
   replyBtn.classList.add('comments-content-comment-body-footer-reply-btn');
   replyBtn.setAttribute('type', 'button');
   replyBtn.innerText = "Reply";
   // Nestings
   if ( !!comment.isReply ) {
      replyCont = createReplyTag(comment.replied_comment_id);
   }
   commenterUsernameCont.append(commenterUsername);
   userImageLink.append(userImage);
   userImageCont.append(userImageLink);
   (!!comment.isReply) ? commentBodyContext.append(commenterUsernameCont, replyCont, commentValue) : commentBodyContext.append(commenterUsernameCont, commentValue);
   commentFooter.append(commentDatetime, replyBtn);
   commentBody.append(commentBodyContext, commentFooter);
   commentCont.append(userImageCont, commentBody);

   return commentCont;

   function formatCommentDatetime(datetime) {  // gets ISO string and returns formatted datetime 
      const year = datetime.slice(0, 4);
      const month = datetime.slice(5, 7);
      const day = datetime.slice(8, 10);
      const hour = datetime.slice(11, 13);
      const min = datetime.slice(14, 16);
      return `${month}/${day}/${year} - ${hour}:${min}`;
   }
   function createReplyTag(commentId) {
      let comment = WHOLE_COMMENTS.filter(comment => comment.id === commentId)[0];
      const user = USERS.filter(user => user.id === comment.user_id)[0];
      const replyCont = document.createElement('div');
      replyCont.classList.add('comments-content-comment-body-context-reply-cont');
      const replyTitle = document.createElement('div');
      replyTitle.classList.add('comments-content-comment-body-context-reply-title');
      replyTitle.innerText = "Replying to ";
      const targetCont = document.createElement('div');
      targetCont.classList.add('comments-content-comment-body-context-reply-target-cont');
      const accountName = document.createElement('h4');
      accountName.classList.add('comments-content-comment-body-context-reply-target-accountname');
      accountName.innerText = user.username;
      const targetComment = document.createElement('p');
      targetComment.classList.add('comments-content-comment-body-context-reply-target-comment');
      targetComment.innerText = formatRepliedCommentText(comment.value);
      const targetCommentLink = document.createElement('a');
      targetCommentLink.classList.add('comments-content-comment-body-context-reply-reference-link');
      targetCommentLink.href = "#" + comment.id;
      // Nestings
      targetCont.append(accountName, targetComment, targetCommentLink);
      replyCont.append(replyTitle, targetCont);
      return replyCont;
      function formatRepliedCommentText(text) {
         const charsAmount = 24;
         let formattedTextArr = [];
         for (let i = 0; i < charsAmount; i++) {
            formattedTextArr.push(text[i]);
         }
         formattedTextArr.push(".", ".", ".");
         return formattedTextArr.join("");
      }
   }
}


function setComments() {
   if (COMMENTS.length === 0) {
      const noCommentsNotice = document.createElement('div');
      noCommentsNotice.classList.add('comments-no_comments-notice');
      noCommentsNotice.innerText = "There is no any comment yet";
      commentsWrapper.append(noCommentsNotice);
   } else {
      WHOLE_COMMENTS.forEach(comment => {
         commentsWrapper.appendChild( createComment(comment) );
      })
   }
}

function setProductComments() {
   setCommentsCount();
   getUsers()
      .then(() => {
         getComments()
         .then(() => setComments())
         .catch(error => console.error(error))
      })
   ;
}

async function getRelatedProducts() {
   const res = await fetch('./related-products-data.json', {method: 'GET'});
   const data = await res.json();
   RELATED_PRODUCTS = data;
}

function setRelatedProductsElements() {
   relatedProductsCont.appendChild( createProductsRow(RELATED_PRODUCTS) );
   addRowControls();
}

function setRelatedProducts() {
   getRelatedProducts()
      .then(() => setRelatedProductsElements())
      .catch((error) => console.error("Fetch Erorr - Related Products", error) )
   ;
}

function setProductInfo() {
   setInitProductFormData();
   setCarouselImages();
   setProductTitle();
   setProductSpecs();
   setProductModels();
   setMoreDetailsInfo();
   setProductProviders();
   setProductComments();
   setRelatedProducts();

   setPageEvents();
}

async function getProductInfo(event) {
   setCurrentProduct()
   .then(() => {
      setProductInfo();
   })
   .catch(error => {
      console.error("Error: ", error);
   })
}


window.addEventListener('DOMContentLoaded', getProductInfo)
/*  End of ----- Product Information Setup ----- */




/* ----------- Product Images Carousel ------------ */
function slideXCarousel(desIndex) {  // desIndex(destination Index): 0, 1, 2, ...
   desIndex = Number(desIndex);
   if ( (desIndex < 0) || (desIndex > (CAROUSEL_IMGS_COUNT - 1)) || (desIndex === CAROUSEL_CURRENT_INDEX) ) return;  // we havent such indexes, or we are already in that index
   elementIsScrolling.imagesCarousel.x = true;
   // activate current preview-image/button
   document.querySelectorAll('.product-info-carousel-preview-images-img-cont').forEach(previewImgCont => {
      if ( Number(previewImgCont.getAttribute('data-index')) === desIndex ) {
         setCurrentPreviewImgActivity(previewImgCont);
      }
   })

   let indexesDiff = Math.abs(desIndex - CAROUSEL_CURRENT_INDEX);
   let dir = (desIndex < CAROUSEL_CURRENT_INDEX) ? 'left' : 'right';
   const slideWidthUnit = document.querySelector('.product-info-images-carousel-img-cont').offsetWidth;
   const desX = ( dir === 'left' ) ? carouselImagesWrapper.scrollLeft - (indexesDiff * slideWidthUnit) : carouselImagesWrapper.scrollLeft + (indexesDiff * slideWidthUnit);
   slideXToPosX(desX);
   // carouselImagesWrapper.scrollTo({
   //    left: desX,
   //    behavior: 'smooth',
   // })

   function slideXToPosX(desX) {
      let remainedX = Math.abs( carouselImagesWrapper.scrollLeft - desX );
      const speedFactor = 0.1;
      carouselImagesWrapper.scrollTo( carouselImagesWrapper.scrollLeft + (((dir === 'left') ? -1 : 1) * Math.ceil(remainedX * speedFactor) ) , 0);
      
      if (remainedX > 4) {
         requestAnimationFrame(slideXToPosX.bind(this, desX));
      } else {
         carouselImagesWrapper.scrollTo( desX, 0);
         CAROUSEL_CURRENT_INDEX = desIndex;
         document.querySelectorAll('.product-info-images-carousel-img-cont').forEach(imgCont => {
            if ( Number(imgCont.getAttribute('data-index') ) === CAROUSEL_CURRENT_INDEX) {
               imgCont.setAttribute('data-isactive', 'true');
            } else {
               imgCont.setAttribute('data-isactive', 'false');
            }
         })
         magnifierImage.setAttribute('src', CURRENT_PRODUCT.imgs[desIndex].src);
         magnifierImage.setAttribute('srcset', CURRENT_PRODUCT.imgs[desIndex].srcset);
         elementIsScrolling.imagesCarousel.x = false;
         return;
      }
   }
}

function setCurrentPreviewImgActivity( currentCarouselPreviewImagesImgCont ) {   
   document.querySelectorAll('.product-info-carousel-preview-images-img-cont').forEach( function(imgCont) {
      imgCont.setAttribute('data-isactive', 'false') 
   } );
   currentCarouselPreviewImagesImgCont.setAttribute('data-isactive', 'true');
}
/* End of ----------- Product Images Carousel ------------ */

/* ----------- Product Model ----------- */
function setProductModel( label ) {
   productModelsInputs.forEach(function(label) { label.removeAttribute('checked'); });
   label.closest('.product-info-details-properties-models-item-values-group').querySelector('.product-info-details-properties-models-item-value-radio-inp').setAttribute('checked', '');
   label.closest('.product-info-details-properties-models-item-values-group').querySelectorAll('.product-info-details-properties-models-item-value-label').forEach(function(label) { label.setAttribute('data-selected', 'false'); });
   label.closest('.product-info-details-properties-models-item-value-label').setAttribute('data-selected', 'true');
}
/* End of ----------- Product Model ----------- */

/* ---- Current Provider Info(Main Add-To-Cart) ---- */
// currentProviderInfoInnerWrapper.style.position = "fixed"
// currentProviderInfoInnerWrapper.style.top = "80px";
// currentProviderInfoInnerWrapper.style.right = "20px";

/* End of ---- Current Provider Info(Main Add-To-Cart) ---- */

/* ---------- More Details ----------- */

function toggleShowMoreMoreDetailsDescription(showmoreBtn) {
   if (moreDetailsDescriptionContShowMoreBtn.getAttribute('data-expanded') === 'false') {
      moreDetailsDescriptionCont.style.maxHeight = "fit-content";
      moreDetailsDescriptionContShowMoreBtn.innerText = "Show Less";
      moreDetailsDescriptionContShowMoreCont.setAttribute('data-expanded', 'true');
      moreDetailsDescriptionContShowMoreBtn.setAttribute('data-expanded', 'true');
      moreDetailsDescriptionContShowMoreBtn.setAttribute('aria-expanded', 'true');
   } else {
      moreDetailsDescriptionCont.style.maxHeight = "200px";
      moreDetailsDescriptionContShowMoreBtn.innerText = "Show More";
      moreDetailsDescriptionContShowMoreCont.setAttribute('data-expanded', 'false');
      moreDetailsDescriptionContShowMoreBtn.setAttribute('data-expanded', 'false');
      moreDetailsDescriptionContShowMoreBtn.setAttribute('aria-expanded', 'false');
   }
}

function toggleShowMoreMoreDetailsCont(showmoreBtn) {
   if (moreDetailsShowMoreBtn.getAttribute('data-expanded') === 'false') {
      moreDetailsCont.style.maxHeight = "fit-content";
      moreDetailsShowMoreBtn.innerText = "Show Less";
      moreDetailsShowMoreCont.setAttribute('data-expanded', 'true');
      moreDetailsShowMoreBtn.setAttribute('data-expanded', 'true');
      moreDetailsShowMoreBtn.setAttribute('aria-expanded', 'true');
   } else {
      moreDetailsCont.style.maxHeight = "500px";
      moreDetailsShowMoreBtn.innerText = "Show More";
      moreDetailsShowMoreCont.setAttribute('data-expanded', 'false');
      moreDetailsShowMoreBtn.setAttribute('data-expanded', 'false');
      moreDetailsShowMoreBtn.setAttribute('aria-expanded', 'false');
   }
}
/* End of ---------- More Details ----------- */

/* ----------- Image Magnifier ----------- */
// by hovering on images-carousel, magnifier is appeared
if (window.innerWidth > 992) {  // It works only on large-screen devices (laptops, ...)
   carouselImages.addEventListener('mouseover', function(e) {
      magnifierCont.style.display = "block";
      magnifierFrame.style.display = "block";
   })
   // by leaving hovering on images-carousel, magnifier is disappeared
   carouselImages.addEventListener('mouseout', function(e) {
      magnifierCont.style.display = "none";
      magnifierFrame.style.display = "none";
   })
   // by moving the mouse on the carousel, the magnifier frame moves -> magnifier image is changed
   document.addEventListener('mousemove', function(e) {
      if (e.target.closest('.product-info-images-carousel-controlers-changeslide-btn')) return;
      handleImageMagnifier(e);
   }, {capture: false})
}



function setMagnifierContSize() {
   const aspectRatio = imagesCont.offsetWidth / imagesCont.offsetHeight;
   magnifierCont.style.aspectRatio = `${aspectRatio}`;
}

function moveMagnifierFrame(mouseX, mouseY) {
   magnifierFrame.style.left = mouseX - (magnifierFrame.offsetWidth / 2) + "px";
   magnifierFrame.style.top = mouseY - (magnifierFrame.offsetHeight / 2) + "px";
   
   // aslo these 'if' s ensure that the 'magnifier frame' never goes out of the carousel-cont area (so it will be out of sight)
   if (magnifierFrame.offsetLeft < 0) {
      magnifierFrame.style.left =  0 +"px";
   } else {
      
   }
   if ( (magnifierFrame.offsetLeft + magnifierFrame.offsetWidth) > carouselImages.offsetWidth) {
      magnifierFrame.style.left = (carouselImages.offsetWidth - magnifierFrame.offsetWidth) + "px";
   }

   if ( magnifierFrame.offsetTop < 0 ) {
      magnifierFrame.style.top =  0 +"px";
   }

   if ( (magnifierFrame.offsetTop + magnifierFrame.offsetHeight) > carouselImages.offsetHeight ) {
      magnifierFrame.style.top = ( carouselImages.offsetHeight - magnifierFrame.offsetHeight ) + "px";
   }
}

function moveMagnifierImage() {
   let magnifierFrameX = magnifierFrame.offsetLeft + (magnifierFrame.offsetWidth / 2);
   let magnifierFrameY = magnifierFrame.offsetTop + (magnifierFrame.offsetHeight / 2);
   let carouselX = carouselImages.offsetWidth / 2;
   let carouselY = carouselImages.offsetHeight / 2;
   let xDiff = carouselX - magnifierFrameX;
   let yDiff = carouselY - magnifierFrameY;
   let xDiffRatio = xDiff / carouselImages.offsetWidth;
   let yDiffRatio = yDiff / carouselImages.offsetHeight;
   magnifierImage.style.left = -50 + Math.round(xDiffRatio * 100) + "%";
   magnifierImage.style.top = -50 + Math.round(yDiffRatio * 100) + "%";
}

function handleImageMagnifier(e) {
   if (!e.target.closest('.product-info-images-carousel')) return;
   let mouseX;
   let mouseY;

   // I added this 'if' because sometimes the 'mousemove' is fired on the 'magnifier-frame' itself
   if ( !!e.target.matches('.product-info-images-magnifier-frame') ) {
      mouseX = e.offsetX + magnifierFrame.offsetLeft;
      mouseY = e.offsetY + magnifierFrame.offsetTop;
   } else {
      mouseX = e.offsetX;
      mouseY = e.offsetY;
   }

   setMagnifierContSize();
   moveMagnifierFrame(mouseX, mouseY);
   moveMagnifierImage();
}
/* End of ----- Image Magnifier ----------- */

/* --------- General Events ---------- */
function setPageEvents() {
   document.addEventListener('click', function(e) {
      e.stopPropagation();

      if ( !!e.target.closest('.product-info-details-properties-models-item-value-label') ) {
         setProductModel( e.target.closest('.product-info-details-properties-models-item-value-label') );
      }
   
      if ( !!e.target.closest('.product-more_details-description-cont-show_more-btn') ) {
         toggleShowMoreMoreDetailsDescription( e.target.closest('.product-more_details-description-cont-show_more-btn') );
      }
   
      if ( !!e.target.closest('#product-more_details-cont-show_more-btn') ) {
         toggleShowMoreMoreDetailsCont( e.target.closest('#product-more_details-cont-show_more-btn') );
      }

      if ( !!e.target.closest('#product-images-carousel-prev-btn') ) {
         if ( !elementIsScrolling.imagesCarousel.x ) {
            slideXCarousel(CAROUSEL_CURRENT_INDEX - 1);
         }
      }
      if ( !!e.target.closest('#product-images-carousel-next-btn') ) {
         if ( !elementIsScrolling.imagesCarousel.x ) {
            slideXCarousel(CAROUSEL_CURRENT_INDEX + 1);
         }
      }

      if ( !!e.target.closest('.product-info-carousel-preview-images-img-cont') ) {
         if ( !elementIsScrolling.imagesCarousel.x ) {
            slideXCarousel( e.target.closest('.product-info-carousel-preview-images-img-cont').getAttribute('data-index') );
         }
      }

      if ( !!e.target.closest('.product-info-images-lightbox-content-preview-image-cont') ) {
         const clickedImageCont = e.target.closest('.product-info-images-lightbox-content-preview-image-cont');
         const clickedImage = clickedImageCont.querySelector('.product-info-images-lightbox-content-preview-image');
         lightboxMainImage.setAttribute('src', clickedImage.getAttribute('src'));
      }

      if (
         !!e.target.closest('.product-info-images-carousel') &&
         !e.target.closest('.product-info-images-carousel-controlers-changeslide-btn') &&
         !e.target.closest('.product-info-carousel-preview-images-cont')
      ) {
         lightbox.classList.add('active');
      }

      if ( !!e.target.closest('.product-info-images-lightbox-close-btn') ) {
         lightbox.classList.remove('active');
      }

      if (
         !e.target.closest('.product-info-images-carousel')
         && !e.target.closest('.product-info-images-lightbox-content')
         && lightbox.classList.contains('active')
      ) {
         lightbox.classList.remove('active');
      }
   })
   
   window.addEventListener('keypress', function(e) {
      const code = e.which || e.charCode || e.keyCode;
      if (code === 13) {  // Enter
         if ( !!e.target.closest('.product-info-details-properties-models-item-value-label') ) {
            setProductModel( e.target.closest('.product-info-details-properties-models-item-value-label') );
         }
   
         if ( !!e.target.closest('.product-info-details-properties-models-item-value-label') ) {
            setProductModel( e.target.closest('.product-info-details-properties-models-item-value-label') );
         }
      }
   })
}

/* End of --------- General Events ---------- */