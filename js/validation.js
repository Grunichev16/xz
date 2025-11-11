class FormValidator{constructor(){this.patterns={email:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,phone:/^\+7\s?[\(]?\d{3}[\)]?\s?\d{3}[-]?\d{2}[-]?\d{2}$/,name:/^[a-zA-Zа-яА-ЯёЁ\s\-']+$/u,password:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/};this.messages={required:'Это поле обязательно для заполнения',email:'Введите корректный email адрес',phone:'Введите телефон в формате +7 (XXX) XXX-XX-XX',name:'Имя может содержать только буквы и дефисы',password:'Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы и цифры',minLength:(min)=>`Минимальная длина: ${min} символов`,maxLength:(max)=>`Максимальная длина: ${max} символов`,match:'Пароли не совпадают'}}
validateField(field,rules){const value=field.value.trim();const fieldName=field.getAttribute('data-field-name')||field.name;if(rules.required&&!value){return this.messages.required}
if(!value){return null}
if(rules.minLength&&value.length<rules.minLength){return this.messages.minLength(rules.minLength)}
if(rules.maxLength&&value.length>rules.maxLength){return this.messages.maxLength(rules.maxLength)}
if(rules.pattern&&!this.patterns[rules.pattern].test(value)){return this.messages[rules.pattern]}
if(rules.matchWith){const matchField=document.querySelector(`[name="${rules.matchWith}"]`);if(matchField&&value!==matchField.value.trim()){return this.messages.match}}
if(rules.custom&&!rules.custom(value)){return rules.customMessage||'Неверное значение'}
return null}
validateForm(form,fieldsRules){let isValid=!0;const errors={};for(const[fieldName,rules]of Object.entries(fieldsRules)){const field=form.querySelector(`[name="${fieldName}"]`);if(field){const error=this.validateField(field,rules);if(error){isValid=!1;errors[fieldName]=error;this.showFieldError(field,error)}else{this.clearFieldError(field);this.showFieldSuccess(field)}}}
return{isValid,errors}}
showFieldError(field,message){this.clearFieldError(field);field.classList.add('error');field.classList.remove('success');const errorElement=document.createElement('div');errorElement.className='error-message';errorElement.textContent=message;errorElement.setAttribute('role','alert');errorElement.setAttribute('aria-live','polite');field.parentNode.appendChild(errorElement);field.setAttribute('aria-invalid','true');field.setAttribute('aria-describedby',`error-${field.name}`);errorElement.id=`error-${field.name}`}
showFieldSuccess(field){field.classList.remove('error');field.classList.add('success');field.setAttribute('aria-invalid','false')}
clearFieldError(field){field.classList.remove('error');field.setAttribute('aria-invalid','false');const existingError=field.parentNode.querySelector('.error-message');if(existingError){existingError.remove()}}
initFormValidation(formSelector,fieldsRules,onSubmit){const form=document.querySelector(formSelector);if(!form)return;const validator=this;Object.keys(fieldsRules).forEach(fieldName=>{const field=form.querySelector(`[name="${fieldName}"]`);if(field){field.addEventListener('blur',function(){const error=validator.validateField(this,fieldsRules[fieldName]);if(error){validator.showFieldError(this,error)}else{validator.clearFieldError(this);validator.showFieldSuccess(this)}});field.addEventListener('input',function(){if(this.classList.contains('error')){const error=validator.validateField(this,fieldsRules[fieldName]);if(!error){validator.clearFieldError(this);validator.showFieldSuccess(this)}}})}});form.addEventListener('submit',function(e){e.preventDefault();const{isValid,errors}=validator.validateForm(this,fieldsRules);if(isValid){if(onSubmit){onSubmit(this)}else{this.submit()}}else{const firstErrorField=this.querySelector('.error');if(firstErrorField){firstErrorField.focus()}
validator.showFormError(this,'Пожалуйста, исправьте ошибки в форме')}})}
showFormError(form,message){this.clearFormError(form);const errorElement=document.createElement('div');errorElement.className='form-error-message';errorElement.textContent=message;errorElement.setAttribute('role','alert');errorElement.setAttribute('aria-live','assertive');form.insertBefore(errorElement,form.firstChild)}
clearFormError(form){const existingError=form.querySelector('.form-error-message');if(existingError){existingError.remove()}}
initPhoneMask(field){field.addEventListener('input',function(e){let value=this.value.replace(/\D/g,'');if(value.startsWith('7')||value.startsWith('8')){value=value.substring(1)}
let formattedValue='+7 ';if(value.length>0){formattedValue+='('+value.substring(0,3)}
if(value.length>3){formattedValue+=') '+value.substring(3,6)}
if(value.length>6){formattedValue+='-'+value.substring(6,8)}
if(value.length>8){formattedValue+='-'+value.substring(8,10)}
this.value=formattedValue})}}
document.addEventListener('DOMContentLoaded',function(){const validator=new FormValidator();const registrationRules={name:{required:!0,minLength:2,maxLength:50,pattern:'name'},email:{required:!0,pattern:'email'},phone:{required:!0,pattern:'phone'},password:{required:!0,minLength:8,pattern:'password'},password_confirm:{required:!0,matchWith:'password'}};const newsletterRules={email:{required:!0,pattern:'email'}};validator.initFormValidation('#newsletter-form',newsletterRules,function(form){const formData=new FormData(form);const email=formData.get('email');const submitButton=form.querySelector('button[type="submit"]');const originalText=submitButton.innerHTML;submitButton.innerHTML=`
            <svg class="spinner" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="24" stroke-dashoffset="24">
                    <animate attributeName="stroke-dashoffset" dur="1s" values="24;0;24" repeatCount="indefinite"/>
                </circle>
            </svg>
            Подписываем...
        `;submitButton.disabled=!0;setTimeout(()=>{console.log('Email подписки:',email);showNewsletterSuccess(form);submitButton.innerHTML=originalText;submitButton.disabled=!1;form.reset();const emailField=form.querySelector('[name="email"]');emailField.classList.remove('success')},1500)});const phoneFields=document.querySelectorAll('input[type="tel"]');phoneFields.forEach(field=>{validator.initPhoneMask(field)});function showNewsletterSuccess(form){const successHTML=`
            <div class="newsletter-success">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M24 44C35 44 44 35 44 24C44 13 35 4 24 4C13 4 4 13 4 24C4 35 13 44 24 44Z" fill="#10b981"/>
                    <path d="M16 24L22 30L32 18" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h3>Спасибо за подписку!</h3>
                <p>Мы отправили вам письмо с подтверждением и промокодом на скидку 10%.</p>
            </div>
        `;const successElement=document.createElement('div');successElement.innerHTML=successHTML;form.parentNode.appendChild(successElement);setTimeout(()=>{successElement.style.opacity='1';successElement.style.transform='translateY(0)'},100);setTimeout(()=>{successElement.style.opacity='0';successElement.style.transform='translateY(-20px)';setTimeout(()=>{if(successElement.parentNode){successElement.parentNode.removeChild(successElement)}},300)},5000)}});const validationStyles=`
    .error {
        border-color: #ef4444 !important;
        background-color: #fef2f2 !important;
    }
    
    .success {
        border-color: #10b981 !important;
        background-color: #f0fdf4 !important;
    }
    
    .error-message {
        color: #ef4444;
        font-size: 12px;
        margin-top: 4px;
        font-weight: 500;
    }
    
    .form-error-message {
        background: #fef2f2;
        color: #ef4444;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 16px;
        border: 1px solid #fecaca;
        font-weight: 500;
    }
    
    .error:focus {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .success:focus {
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
    
    .newsletter-success {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(4px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 32px;
        border-radius: 16px;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1;
    }
    
    .newsletter-success h3 {
        color: #10b981;
        margin: 16px 0 8px;
        font-size: 20px;
    }
    
    .newsletter-success p {
        color: #64748b;
        line-height: 1.5;
    }
    
    .spinner {
        animation: rotate 1s linear infinite;
    }
    
    @keyframes rotate {
        100% {
            transform: rotate(360deg);
        }
    }
`;const validationStyleSheet=document.createElement('style');validationStyleSheet.textContent=validationStyles;document.head.appendChild(validationStyleSheet)