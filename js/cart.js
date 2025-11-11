class ProductCart{constructor(){this.items=[];this.loadFromStorage()}
addProduct(product){if(!this.validateProduct(product)){return!1}
const existingItem=this.items.find(item=>item.id===product.id);if(existingItem){existingItem.quantity+=1}else{this.items.push({...product,quantity:1})}
this.saveToStorage();this.updateCartUI();return!0}
removeProduct(productId){const initialLength=this.items.length;this.items=this.items.filter(item=>item.id!==productId);if(this.items.length!==initialLength){this.saveToStorage();this.updateCartUI();return!0}
return!1}
updateQuantity(productId,quantity){if(quantity<=0){return this.removeProduct(productId)}
const item=this.items.find(item=>item.id===productId);if(item){item.quantity=quantity;this.saveToStorage();this.updateCartUI();return!0}
return!1}
clear(){this.items=[];this.saveToStorage();this.updateCartUI()}
calculateTotal(){return this.items.reduce((total,item)=>{return total+(item.price*item.quantity)},0)}
getItemCount(){return this.items.reduce((count,item)=>{return count+item.quantity},0)}
isFreeDeliveryAvailable(){return this.calculateTotal()>=20000}
validateProduct(product){return product&&product.id&&product.name&&product.price>0}
saveToStorage(){try{localStorage.setItem('techstore_cart',JSON.stringify(this.items))}catch(error){console.error('Ошибка сохранения корзины:',error)}}
loadFromStorage(){try{const storedCart=localStorage.getItem('techstore_cart');if(storedCart){this.items=JSON.parse(storedCart)}}catch(error){console.error('Ошибка загрузки корзины:',error);this.items=[]}}
updateCartUI(){const cartCount=document.getElementById('cart-count');if(cartCount){const count=this.getItemCount();cartCount.textContent=count;cartCount.style.display=count>0?'flex':'none'}
this.renderCartItems();this.updateCartTotal()}
updateCartTotal(){const totalPrice=document.getElementById('total-price');const cartNotice=document.querySelector('.cart__notice');if(totalPrice){totalPrice.textContent=formatPrice(this.calculateTotal())}
if(cartNotice){if(this.isFreeDeliveryAvailable()){cartNotice.innerHTML='🎉 <strong>Бесплатная доставка</strong> доступна!';cartNotice.style.color='var(--success)'}else{const remaining=20000-this.calculateTotal();cartNotice.innerHTML=`До бесплатной доставки: <strong>${formatPrice(remaining)} ₽</strong>`;cartNotice.style.color='var(--gray-500)'}}}
renderCartItems(){const cartItems=document.getElementById('cart-items');const cartEmpty=document.getElementById('cart-empty');if(!cartItems||!cartEmpty)return;if(this.items.length===0){cartEmpty.style.display='block';cartItems.style.display='none';return}
cartEmpty.style.display='none';cartItems.style.display='block';cartItems.innerHTML=this.items.map(item=>`
            <div class="cart-item fade-in">
                <img src="${item.image}" alt="${item.name}" class="cart-item__image" loading="lazy">
                <div class="cart-item__details">
                    <h4 class="cart-item__title">${item.name}</h4>
                    <div class="cart-item__price">${formatPrice(item.price)} ₽</div>
                </div>
                <div class="cart-item__actions">
                    <div class="cart-item__quantity">
                        <button class="quantity-button decrease-quantity" 
                                data-product-id="${item.id}"
                                aria-label="Уменьшить количество">
                            −
                        </button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-button increase-quantity" 
                                data-product-id="${item.id}"
                                aria-label="Увеличить количество">
                            +
                        </button>
                    </div>
                    <button class="cart-item__remove" 
                            data-product-id="${item.id}"
                            aria-label="Удалить товар">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 4L12 12M4 12L12 4" stroke="currentColor" stroke-width="1.5"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');this.bindCartEvents()}
bindCartEvents(){document.querySelectorAll('.decrease-quantity').forEach(button=>{button.addEventListener('click',(e)=>{e.stopPropagation();const productId=parseInt(button.getAttribute('data-product-id'));const item=this.items.find(item=>item.id===productId);if(item){this.updateQuantity(productId,item.quantity-1)}})});document.querySelectorAll('.increase-quantity').forEach(button=>{button.addEventListener('click',(e)=>{e.stopPropagation();const productId=parseInt(button.getAttribute('data-product-id'));const item=this.items.find(item=>item.id===productId);if(item){this.updateQuantity(productId,item.quantity+1)}})});document.querySelectorAll('.cart-item__remove').forEach(button=>{button.addEventListener('click',(e)=>{e.stopPropagation();const productId=parseInt(button.getAttribute('data-product-id'));if(confirm('Вы уверены, что хотите удалить товар из корзины?')){this.removeProduct(productId)}})})}}
const cart=new ProductCart();function initCart(){const cartToggle=document.getElementById('cart-toggle');const cartModal=document.getElementById('cart-modal');const cartClose=document.getElementById('cart-close');if(cartToggle&&cartModal&&cartClose){cartToggle.addEventListener('click',()=>{openCartModal()});cartClose.addEventListener('click',()=>{closeCartModal()});cartModal.addEventListener('click',(e)=>{if(e.target===cartModal||e.target.classList.contains('modal__overlay')){closeCartModal()}});document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&cartModal.classList.contains('active')){closeCartModal()}})}
const checkoutButton=document.getElementById('checkout-button');if(checkoutButton){checkoutButton.addEventListener('click',handleCheckout)}
cart.updateCartUI()}
function openCartModal(){const cartModal=document.getElementById('cart-modal');if(!cartModal)return;cartModal.classList.add('active');document.body.style.overflow='hidden';const modalContent=cartModal.querySelector('.modal__content');modalContent.style.transform='scale(0.9)';modalContent.style.opacity='0';setTimeout(()=>{modalContent.style.transform='scale(1)';modalContent.style.opacity='1'},10)}
function closeCartModal(){const cartModal=document.getElementById('cart-modal');if(!cartModal)return;const modalContent=cartModal.querySelector('.modal__content');modalContent.style.transform='scale(0.9)';modalContent.style.opacity='0';setTimeout(()=>{cartModal.classList.remove('active');document.body.style.overflow=''},200)}
function handleCheckout(){if(cart.items.length===0){showNotification('Корзина пуста. Добавьте товары перед оформлением заказа.','error');return}
const checkoutButton=document.getElementById('checkout-button');const originalText=checkoutButton.innerHTML;checkoutButton.innerHTML=`
        <svg class="spinner" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="32" stroke-dashoffset="32">
                <animate attributeName="stroke-dashoffset" dur="1s" values="32;0;32" repeatCount="indefinite"/>
            </circle>
        </svg>
        Оформление...
    `;checkoutButton.disabled=!0;setTimeout(()=>{const orderNumber=Math.floor(Math.random()*1000000);showNotification(`Заказ #${orderNumber} успешно оформлен! Спасибо за покупку.`,'success');cart.clear();closeCartModal();checkoutButton.innerHTML=originalText;checkoutButton.disabled=!1;showOrderConfirmation(orderNumber)},2000)}
function showOrderConfirmation(orderNumber){const confirmationHTML=`
        <div class="order-confirmation">
            <div class="confirmation-icon">✅</div>
            <h3>Заказ успешно оформлен!</h3>
            <p>Номер вашего заказа: <strong>#${orderNumber}</strong></p>
            <p>Мы свяжемся с вами в ближайшее время для подтверждения заказа.</p>
            <button class="button button--primary" onclick="this.parentElement.remove()">Понятно</button>
        </div>
    `;const confirmation=document.createElement('div');confirmation.innerHTML=confirmationHTML;confirmation.style.cssText=`
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 32px;
        border-radius: 16px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        text-align: center;
        z-index: 4000;
        max-width: 400px;
        width: 90%;
    `;document.body.appendChild(confirmation);const overlay=document.createElement('div');overlay.style.cssText=`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 3999;
    `;document.body.appendChild(overlay);overlay.addEventListener('click',()=>{confirmation.remove();overlay.remove()})}
function formatPrice(price){return new Intl.NumberFormat('ru-RU').format(price)}
function showNotification(message,type='info'){console.log(`[${type.toUpperCase()}] ${message}`)}
const cartStyles=`
    .spinner {
        animation: rotate 1s linear infinite;
    }
    
    @keyframes rotate {
        100% {
            transform: rotate(360deg);
        }
    }
    
    .order-confirmation .confirmation-icon {
        font-size: 48px;
        margin-bottom: 16px;
    }
    
    .order-confirmation h3 {
        font-size: 24px;
        margin-bottom: 12px;
        color: var(--success);
    }
    
    .order-confirmation p {
        margin-bottom: 8px;
        color: var(--gray-600);
    }
    
    .cart-item__quantity {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--gray-100);
        border-radius: var(--radius-md);
        padding: 4px;
    }
    
    .quantity-button {
        width: 28px;
        height: 28px;
        border: none;
        background: white;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-weight: 600;
        transition: var(--transition);
        box-shadow: var(--shadow-sm);
    }
    
    .quantity-button:hover {
        background: var(--gray-50);
        box-shadow: var(--shadow-md);
    }
    
    .quantity-value {
        min-width: 30px;
        text-align: center;
        font-weight: 600;
        font-size: 14px;
    }
    
    .cart-item__remove {
        background: none;
        border: none;
        padding: 8px;
        cursor: pointer;
        border-radius: var(--radius-sm);
        transition: var(--transition);
        color: var(--gray-500);
    }
    
    .cart-item__remove:hover {
        background: var(--error);
        color: white;
    }
`;const cartStyleSheet=document.createElement('style');cartStyleSheet.textContent=cartStyles;document.head.appendChild(cartStyleSheet)