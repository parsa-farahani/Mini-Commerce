** Project Features

*FEATURES:
- Polished & user friendly UI
- Responsive Design for mobiles, tablet, desktops and extra large screens
- Responsive Images (changing quality by the size of user-dvice)
- products row with navigation ability
- showcase slider carousel
- contact form
- FAQs accordion
- dark/light themes
- setting products from .json data by Javascript
- setting product-comments from .json data by Javascript
- setting product-information from .json data by Javascript
- Elmenets Animations(CSS Animations -> controled by Js)
- Using 'IntersectionObserver' for keyorad users to activate scroll-based Animations
-modern styling features
- Relative Font-sizes for better accessibility
* product.html
- hight detailed setting product info from .json file by Javascript
- User friendly product image slider
- comments section with commenting form
- related products row (it is dynamically created from .json data file)
- ability to change product 'models' (color, size, ...)
- Showing all of Providers of this product from .json data file
* cart.html



*IMPORTANT :  the elements/datas related to the products in the "new products Grid"(in landing page) and the "product page"(product.html), are dynamically implemented by JavaScript (by fetching data from the .json files in the project directory)

-- HTML Considerations are applied on each page
-- Using Scheema.org attributes
--Observing semantic-HTML Principles (using appropriate tags for each specific purpose)
--Observing Accessibility Principles :
---Optimizing Site for Keyboard/Screenreader users
--Observing SEO Principles
--Optimizing images:
---minify image-files sizes
---making images responsive for different viewports
---making images lazy loaded
---Optimizing Javascript scripts of website
---Optimizing scroll-based Animations
--Implementing Animations using 'CSS Animation' & 'Vanilla Javascript'


in this project, i did my best to develop an efficient and accessible e-commerce website, so I tried to optimize this website also for keyboard users, screenreader users, and I tried to observe Accessibility principles adding to all of other works about designing the UI and other functionalities (which will be improved in future)

* accessible 'Categories' menu
* using aria-label fot more than 1 &lt;nav&gt; s
* using 'hidden' headings for each section, helping SEO & Accessibility(screenreaders), also keeps the appearance in the way we want for sighted users

**Note: all of graphical posters and personal logos in this projects, are created by Parsa Farahani, <br>
for images from another source, I created their 'attribution' elements
regular icons are used from free resources
(like: <a>https://iconify.design/</a> and <a>https://fonts.google.com/icons</a>)


JS:

--Landing Page
* Controling CSS Animations by JS
* Optimizing page's animations-executions using "throttling" method
* implementing custome products-row (by a function which gets products-obejcts-array and turns it to -> row of products with its controls)
* implementing custome back-to-top-button (which developer can adjust its speed)

--Product Page
* Preserving Product's information dynamically from its data -given from .json file(products-data.json)-
* Presrving all defined Specifications & Models of each products which is defined in its .json file
* Preserving all Providers of the Product with their features and information
* Preserving Product's comments from .json file below the product (Comments and their Replies)
* Preserving Product's 'Related Products' in a products-row (which the number of rows can be increased/decresed)

--Cart Page
* Preserving all products which are in user's cart dynamically in Cart table
* 

--Login/Register Page

TIP: Elements which are inside 'products greed', are made dynamically from 'productsData' array in 'index.js' file,



CSS:
used Features:
* Flexbox for layout
* Grid for layouts in landing page ,...
* CSS Animations for landing page elements (the executions are controled by Javascript)
* custom-styled checkboxes in product-page (to select product models)
* css gradients to make shadow effect in products-row s, Popular-Products section in landing page,...
* 


##credits
* 