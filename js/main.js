document.addEventListener('DOMContentLoaded',function(){initApp()});function initApp(){loadProducts();initFilter();initSearch();initCart();initScrollTop();initCookieNotice();initAnimations()}
class ProductManager{constructor(){this.products=[];this.filteredProducts=[]}
async loadProducts(){return new Promise((resolve)=>{setTimeout(()=>{this.products=[{id:1,name:'iPhone 14 Pro',description:'Новейший смартфон от Apple с улучшенной камерой и динамическим островом',price:99990,category:'smartphones',image:'images/iphnoe14.png',features:['6.1" Super Retina XDR','Система камер Pro','Чип A16 Bionic'],rating:4.8,reviews:124},{id:2,name:'Samsung Galaxy S23 Ultra',description:'Флагманский смартфон от Samsung с S-Pen и мощным процессором',price:89990,category:'smartphones',image:'images/samsunhgs23.png',features:['6.8" Dynamic AMOLED 2X','S-Pen в комплекте','Snapdragon 8 Gen 2'],rating:4.7,reviews:89},{id:3,name:'MacBook Air M2',description:'Легкий и мощный ноутбук от Apple с чипом M2',price:129990,category:'laptops',image:'images/macbookarim2.png',features:['13.6" Liquid Retina','Чип M2','До 18 часов работы'],rating:4.9,reviews:67},{id:4,name:'Dell XPS 13 Plus',description:'Ультрабук премиум-класса с безрамочным дисплеем',price:109990,category:'laptops',image:'images/dellXPS13.png',features:['13.4" 4K UHD+','Intel Core i7','Сенсорная панель'],rating:4.6,reviews:42},{id:5,name:'iPad Pro 12.9"',description:'Мощный планшет для работы и творчества с дисплеем Liquid Retina XDR',price:94990,category:'tablets',image:'images/Ipadpro.png',features:['12.9" Liquid Retina XDR','Чип M2','Поддержка Apple Pencil'],rating:4.8,reviews:56},{id:6,name:'Samsung Galaxy Tab S9 Ultra',description:'Планшет с S-Pen для заметок и рисования',price:79990,category:'tablets',image:'images/samsunggalaxy.png',features:['14.6" Dynamic AMOLED 2X','S-Pen в комплекте','Snapdragon 8 Gen 2'],rating:4.5,reviews:34},{id:7,name:'AirPods Pro 2',description:'Беспроводные наушники с активным шумоподавлением',price:24990,category:'accessories',image:'images/airposd.png',features:['Активное шумоподавление','Пространственное аудио','До 6 часов работы'],rating:4.7,reviews:156},{id:8,name:'Apple Watch Series 9',description:'Умные часы с функциями для здоровья и фитнеса',price:39990,category:'accessories',image:'images/apllewatch.png',features:['Всегда включенный дисплей','ЭКГ','Отслеживание сна'],rating:4.6,reviews:98}];this.filteredProducts=[...this.products];resolve(this.products)},800)})}
filterByCategory(category){if(category==='all'){this.filteredProducts=[...this.products]}else{this.filteredProducts=this.products.filter(product=>product.category===category)}
return this.filteredProducts}
searchProducts(query){if(!query.trim()){this.filteredProducts=[...this.products];return this.filteredProducts}
const lowerCaseQuery=query.toLowerCase();this.filteredProducts=this.products.filter(product=>product.name.toLowerCase().includes(lowerCaseQuery)||product.description.toLowerCase().includes(lowerCaseQuery)||product.features.some(feature=>feature.toLowerCase().includes(lowerCaseQuery)));return this.filteredProducts}
getProductById(id){return this.products.find(product=>product.id===id)||null}}
const productManager=new ProductManager();async function loadProducts(){try{showLoadingSkeleton();await productManager.loadProducts();renderProducts(productManager.filteredProducts);hideLoadingSkeleton()}catch(error){console.error('Ошибка загрузки товаров:',error);showErrorMessage('Не удалось загрузить товары. Пожалуйста, попробуйте позже.');hideLoadingSkeleton()}}
function showLoadingSkeleton(){const productsGrid=document.getElementById('products-grid');if(!productsGrid)return;productsGrid.innerHTML=`
        <div class="product-card skeleton">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-text"></div>
                <div class="skeleton-line skeleton-text"></div>
                <div class="skeleton-line skeleton-price"></div>
                <div class="skeleton-actions">
                    <div class="skeleton-button"></div>
                    <div class="skeleton-button"></div>
                </div>
            </div>
        </div>
    `.repeat(8)}
function hideLoadingSkeleton(){const skeletons=document.querySelectorAll('.skeleton');skeletons.forEach(skeleton=>{skeleton.classList.remove('skeleton')})}
function renderProducts(products){const productsGrid=document.getElementById('products-grid');if(!productsGrid)return;if(products.length===0){productsGrid.innerHTML=`
            <div class="no-products">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <path d="M32 8C18.7 8 8 18.7 8 32C8 45.3 18.7 56 32 56C45.3 56 56 45.3 56 32C56 18.7 45.3 8 32 8ZM32 52C21 52 12 43 12 32C12 21 21 12 32 12C43 12 52 21 52 32C52 43 43 52 32 52Z" fill="#94a3b8"/>
                    <path d="M40 24L24 40M24 24L40 40" stroke="#94a3b8" stroke-width="2"/>
                </svg>
                <h3>Товары не найдены</h3>
                <p>Попробуйте изменить параметры поиска или фильтрации</p>
            </div>
        `;return}
productsGrid.innerHTML=products.map(product=>`
        <div class="product-card fade-in" data-category="${product.category}">
            <div class="product-card__badge">Популярный</div>
            <img src="${product.image}" alt="${product.name}" class="product-card__image" loading="lazy">
            <div class="product-card__content">
                <div class="product-card__header">
                    <h3 class="product-card__title">${product.name}</h3>
                    <div class="product-card__rating">
                        <div class="stars">
                            ${generateStars(product.rating)}
                        </div>
                        <span class="rating-value">${product.rating}</span>
                        <span class="reviews">(${product.reviews})</span>
                    </div>
                </div>
                <p class="product-card__description">${product.description}</p>
                <div class="product-card__features">
                    ${product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="product-card__footer">
                    <div class="product-card__price">${formatPrice(product.price)} ₽</div>
                    <div class="product-card__actions">
                        <button class="button button--primary add-to-cart" data-product-id="${product.id}">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.4 5.2 16.4H17M17 13V16.4M9 19C9 19.6 8.6 20 8 20C7.4 20 7 19.6 7 19C7 18.4 7.4 18 8 18C8.6 18 9 18.4 9 19ZM17 19C17 19.6 16.6 20 16 20C15.4 20 15 19.6 15 19C15 18.4 15.4 18 16 18C16.6 18 17 18.4 17 19Z" stroke="currentColor" stroke-width="1.5"/>
                            </svg>
                            В корзину
                        </button>
                        <button class="button button--secondary wishlist-toggle" data-product-id="${product.id}">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 13.35L6.55 12.03C3.4 9.36 1 7.28 1 5.5C1 3.42 3.42 2 6.5 2C8.24 2 9.91 2.81 11 4.09C12.09 2.81 13.76 2 15.5 2C18.58 2 21 3.42 21 5.5C21 7.28 18.6 9.36 13.45 12.04L12 13.35Z" stroke="currentColor" stroke-width="1.5"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');document.querySelectorAll('.add-to-cart').forEach(button=>{button.addEventListener('click',function(){const productId=parseInt(this.getAttribute('data-product-id'));addToCart(productId);this.style.transform='scale(0.95)';setTimeout(()=>{this.style.transform='scale(1)'},150)})});document.querySelectorAll('.wishlist-toggle').forEach(button=>{button.addEventListener('click',function(){const productId=parseInt(this.getAttribute('data-product-id'));toggleWishlist(productId);this.classList.toggle('active')})})}
function generateStars(rating){const fullStars=Math.floor(rating);const hasHalfStar=rating%1>=0.5;const emptyStars=5-fullStars-(hasHalfStar?1:0);let stars='';for(let i=0;i<fullStars;i++){stars+='<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1L10 5L14 5.5L11 8.5L12 13L8 11L4 13L5 8.5L2 5.5L6 5Z"/></svg>'}
if(hasHalfStar){stars+='<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1L10 5L14 5.5L11 8.5L12 13L8 11V1Z"/></svg>'}
for(let i=0;i<emptyStars;i++){stars+='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M8 1L10 5L14 5.5L11 8.5L12 13L8 11L4 13L5 8.5L2 5.5L6 5Z"/></svg>'}
return stars}
function formatPrice(price){return new Intl.NumberFormat('ru-RU').format(price)}
function initFilter(){const filterButtons=document.querySelectorAll('.filter-button');filterButtons.forEach(button=>{button.addEventListener('click',function(){filterButtons.forEach(btn=>btn.classList.remove('active'));this.classList.add('active');const category=this.getAttribute('data-category');const filteredProducts=productManager.filterByCategory(category);renderProducts(filteredProducts);document.getElementById('products').scrollIntoView({behavior:'smooth',block:'start'})})})}
function initSearch(){const searchForm=document.querySelector('.search-form');const searchInput=document.getElementById('search-input');if(searchForm&&searchInput){searchForm.addEventListener('submit',function(e){e.preventDefault();performSearch()});let searchTimeout;searchInput.addEventListener('input',function(){clearTimeout(searchTimeout);searchTimeout=setTimeout(()=>{performSearch()},500)});searchInput.addEventListener('keydown',function(e){if(e.key==='Escape'){this.value='';performSearch()}})}}
function performSearch(){const searchInput=document.getElementById('search-input');const query=searchInput.value.trim();const foundProducts=productManager.searchProducts(query);renderProducts(foundProducts)}
function toggleWishlist(productId){const product=productManager.getProductById(productId);if(!product)return;const wishlist=JSON.parse(localStorage.getItem('techstore_wishlist')||'[]');const existingIndex=wishlist.findIndex(item=>item.id===productId);if(existingIndex>-1){wishlist.splice(existingIndex,1);showNotification('Товар удален из избранного','info')}else{wishlist.push(product);showNotification('Товар добавлен в избранное','success')}
localStorage.setItem('techstore_wishlist',JSON.stringify(wishlist))}
function showNotification(message,type='info'){const notification=document.createElement('div');notification.className=`notification notification--${type}`;notification.innerHTML=`
        <div class="notification__content">
            <span>${message}</span>
            <button class="notification__close">×</button>
        </div>
    `;notification.style.cssText=`
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;document.body.appendChild(notification);setTimeout(()=>{notification.style.transform='translateX(0)'},100);const closeBtn=notification.querySelector('.notification__close');closeBtn.addEventListener('click',()=>{closeNotification(notification)});setTimeout(()=>{closeNotification(notification)},4000)}
function closeNotification(notification){notification.style.transform='translateX(400px)';setTimeout(()=>{if(notification.parentNode){notification.parentNode.removeChild(notification)}},300)}
function initScrollTop(){const scrollTop=document.getElementById('scroll-top');if(!scrollTop)return;function toggleScrollTop(){if(window.pageYOffset>300){scrollTop.classList.add('visible')}else{scrollTop.classList.remove('visible')}}
window.addEventListener('scroll',toggleScrollTop);scrollTop.addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'})});toggleScrollTop()}
function initCookieNotice(){const cookieNotice=document.getElementById('cookie-notice');const cookieAccept=document.getElementById('cookie-accept');if(!cookieNotice||!cookieAccept)return;if(localStorage.getItem('cookies_accepted')){cookieNotice.style.display='none';return}
cookieAccept.addEventListener('click',()=>{localStorage.setItem('cookies_accepted','true');cookieNotice.style.opacity='0';setTimeout(()=>{cookieNotice.style.display='none'},300)})}
function initAnimations(){const observerOptions={threshold:0.1,rootMargin:'0px 0px -50px 0px'};const observer=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('fade-in');observer.unobserve(entry.target)}})},observerOptions);document.addEventListener('DOMContentLoaded',()=>{const productCards=document.querySelectorAll('.product-card');productCards.forEach(card=>{observer.observe(card)})})}
function showErrorMessage(message){showNotification(message,'error')}
function addToCart(productId){const product=productManager.getProductById(productId);if(product){const success=cart.addProduct(product);if(success){showNotification(`"${product.name}" добавлен в корзину`,'success')}else{showErrorMessage('Не удалось добавить товар в корзину')}}else{showErrorMessage('Товар не найден')}}
const skeletonStyles=`
    .skeleton {
        position: relative;
        overflow: hidden;
    }
    
    .skeleton::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: shimmer 1.5s infinite;
    }
    
    .skeleton-image {
        width: 100%;
        height: 200px;
        background: var(--gray-200);
        border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    }
    
    .skeleton-content {
        padding: 20px;
    }
    
    .skeleton-line {
        height: 16px;
        background: var(--gray-200);
        border-radius: 4px;
        margin-bottom: 8px;
    }
    
    .skeleton-title {
        width: 70%;
        height: 20px;
    }
    
    .skeleton-text {
        width: 90%;
    }
    
    .skeleton-text:last-child {
        width: 60%;
    }
    
    .skeleton-price {
        width: 40%;
        height: 24px;
        margin: 16px 0;
    }
    
    .skeleton-actions {
        display: flex;
        gap: 8px;
    }
    
    .skeleton-button {
        flex: 1;
        height: 40px;
        background: var(--gray-200);
        border-radius: var(--radius-md);
    }
    
    .skeleton-button:last-child {
        flex: 0 0 40px;
    }
    
    @keyframes shimmer {
        100% {
            transform: translateX(100%);
        }
    }
    
    .no-products {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        color: var(--gray-500);
    }
    
    .no-products svg {
        margin-bottom: 20px;
    }
    
    .no-products h3 {
        font-size: 20px;
        margin-bottom: 8px;
        color: var(--gray-700);
    }
    
    .product-card__badge {
        position: absolute;
        top: 12px;
        left: 12px;
        background: var(--success);
        color: white;
        padding: 4px 8px;
        border-radius: var(--radius-sm);
        font-size: 12px;
        font-weight: 600;
        z-index: 2;
    }
    
    .product-card__header {
        margin-bottom: 12px;
    }
    
    .product-card__rating {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 4px;
    }
    
    .stars {
        display: flex;
        gap: 2px;
        color: var(--warning);
    }
    
    .rating-value {
        font-size: 14px;
        font-weight: 600;
        color: var(--gray-700);
    }
    
    .reviews {
        font-size: 12px;
        color: var(--gray-500);
    }
    
    .product-card__features {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-bottom: 16px;
    }
    
    .feature-tag {
        background: var(--gray-100);
        color: var(--gray-600);
        padding: 4px 8px;
        border-radius: var(--radius-sm);
        font-size: 12px;
        font-weight: 500;
    }
    
    .product-card__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
    }
    
    .wishlist-toggle.active {
        color: var(--error);
    }
    
    .notification {
        max-width: 300px;
    }
    
    .notification__content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
    }
    
    .notification__close {
        background: none;
        border: none;
        font-size: 18px;
        color: var(--gray-500);
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification--success {
        border-left: 4px solid var(--success);
    }
    
    .notification--error {
        border-left: 4px solid var(--error);
    }
    
    .notification--info {
        border-left: 4px solid var(--primary-500);
    }
`;const styleSheet=document.createElement('style');styleSheet.textContent=skeletonStyles;document.head.appendChild(styleSheet)