// Database
const USERS_KEY = 'portfolio_users';
const CURRENT_USER_KEY = 'currentUser';

if (!localStorage.getItem(USERS_KEY)) {
  localStorage.setItem(USERS_KEY, JSON.stringify([]));
}

function validateEmailRules(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, msg: "Invalid email format. Use example@gmail.com" };
  }

  const [localPart, domainPart] = email.split('@');
  const lowerDomain = domainPart.toLowerCase();
  const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'live.com', 'me.com'];

  if (!allowedDomains.includes(lowerDomain)) {
    return { isValid: false, msg: "Please use a common provider (Gmail, Yahoo, etc.)" };
  }

  if (localPart.length < 4) {
    return { isValid: false, msg: "The part before @ must be at least 4 characters." };
  }

  if (/([._]){2,}/.test(localPart)) {
    return { isValid: false, msg: "Email cannot contain consecutive dots or underscores." };
  }

  if (/^[._]|[._]$/.test(localPart)) {
    return { isValid: false, msg: "Email cannot start or end with a dot or underscore." };
  }

  return { isValid: true, msg: "" };
}

function validateInput(inputElement) {
  const id = inputElement.id;
  const value = inputElement.value.trim();
  const errorElement = document.getElementById(`error-${id}`);
  let isValid = true;
  let msg = '';

  if (value === '') {
    isValid = true; 
    msg = '';
  } else if (id.includes('email')) {
    const emailCheck = validateEmailRules(value);
    isValid = emailCheck.isValid;
    msg = emailCheck.msg;
  } else if (id.includes('name')) {
    if (value.length < 3) {
      isValid = false;
      msg = 'Name must be at least 3 characters.';
    }
  } else if (id.includes('password')) {
    if (value.length < 8) {
      isValid = false;
      msg = 'Password must be at least 8 characters.';
    }
  }

  if (!isValid && value !== '') {
    inputElement.classList.add('invalid');
    if (errorElement) {
      errorElement.textContent = msg;
      errorElement.classList.add('active');
    }
  } else {
    inputElement.classList.remove('invalid');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('active');
    }
  }
  
  return isValid;
}

function showMsg(message, type) {
  const msgDiv = document.getElementById('auth-msg');
  msgDiv.textContent = message;
  msgDiv.className = `auth-message ${type}`;
  msgDiv.style.display = 'block';
}

function switchTab(tab) {
  const card = document.querySelector('.auth-page__card');
  if (tab === 'signup') {
    card.classList.add('signup-mode');
  } else {
    card.classList.remove('signup-mode');
  }

  document.getElementById('tab-login').classList.remove('active');
  document.getElementById('tab-signup').classList.remove('active');
  document.getElementById(`tab-${tab}`).classList.add('active');

  document.getElementById('form-login').classList.remove('active');
  document.getElementById('form-signup').classList.remove('active');
  document.getElementById(`form-${tab}`).classList.add('active');

  const msgDiv = document.getElementById('auth-msg');
  if (msgDiv) {
    msgDiv.className = 'auth-message';
    msgDiv.style.display = 'none';
  }
  
  const headerTitle = document.querySelector('.auth-header h1');
  const headerDesc = document.querySelector('.auth-header p');
  
  if (tab === 'login') {
    headerTitle.textContent = 'Welcome Back';
    headerDesc.textContent = 'Please sign in to access the portfolio.';
  } else {
    headerTitle.textContent = 'Create Account';
    headerDesc.textContent = 'Join to explore professional digital experiences.';
  }
}

function handleSignup(event) {
  event.preventDefault();
  
  const nameInput = document.getElementById('signup-name');
  const emailInput = document.getElementById('signup-email');
  const passwordInput = document.getElementById('signup-password');

  const isNameValid = validateInput(nameInput) && nameInput.value.trim() !== '';
  const isEmailValid = validateInput(emailInput) && emailInput.value.trim() !== '';
  const isPasswordValid = validateInput(passwordInput) && passwordInput.value !== '';

  if (!isNameValid || !isEmailValid || !isPasswordValid) {
    return;
  }

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (password.length < 8) {
    showMsg('Password must be at least 8 characters long.', 'error');
    return;
  }

  const users = JSON.parse(localStorage.getItem(USERS_KEY));

  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    showMsg('This email is already registered.', 'error');
    return;
  }

  const newUser = { name, email, password };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  showMsg('Success! Now you can sign in.', 'success');
  event.target.reset();
  
  setTimeout(() => {
    switchTab('login');
  }, 1500);
}

function handleLogin(event) {
  event.preventDefault();

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  const isEmailValid = validateInput(emailInput) && emailInput.value.trim() !== '';
  const isPasswordValid = validateInput(passwordInput) && passwordInput.value !== '';

  if (!isEmailValid || !isPasswordValid) {
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const users = JSON.parse(localStorage.getItem(USERS_KEY));
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (user) {
    showMsg(`Welcome back, ${user.name}!`, 'success');
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ name: user.name, email: user.email }));
    
    setTimeout(() => {
      revealPortfolio();
    }, 1000);
  } else {
    showMsg('Invalid email or password.', 'error');
  }
}

function revealPortfolio() {
  const authPage = document.getElementById('auth-page');
  const mainContent = document.getElementById('main-content');
  
  if (authPage) authPage.style.display = 'none';
  if (mainContent) mainContent.style.display = 'block';
  document.body.classList.remove('auth-locked');
  
  updateAuthUI();
}

function updateAuthUI() {
  const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  const loginBtn = document.getElementById('nav-login-btn');
  const mobileLoginBtn = document.getElementById('mobile-login-btn');

  if (currentUser) {
    const firstName = currentUser.name.split(' ')[0];
    const uiContent = `<i class="fa-solid fa-user" style="font-size:0.85rem;"></i> ${firstName}`;
    
    if (loginBtn) {
      loginBtn.innerHTML = uiContent;
      loginBtn.onclick = handleLogout;
    }
    if (mobileLoginBtn) {
      mobileLoginBtn.innerHTML = uiContent;
      mobileLoginBtn.onclick = handleLogout;
    }
  }
}

function handleLogout(e) {
  if (e) e.stopPropagation();
  const modal = document.getElementById('custom-confirm');
  if (modal) modal.classList.add('active');
}

function closeConfirmModal() {
  const modal = document.getElementById('custom-confirm');
  if (modal) modal.classList.remove('active');
}

function executeLogout() {
  localStorage.removeItem(CURRENT_USER_KEY);
  window.location.reload();
}

window.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  if (currentUser) {
    revealPortfolio();
  } else {
    document.getElementById('auth-page').style.display = 'flex';
    document.getElementById('main-content').style.display = 'none';
    document.body.classList.add('auth-locked');
  }
});

/* ============================================================
   PROJECT LINK HANDLING & MODALS
   ============================================================ */
function handleProjectLink(event, url, title, type) {
  if (event) event.preventDefault();
  // Explicitly handle project behavior by name
  if (title === 'Mobile Store') {
    if (type === 'demo') {
      openPreviewModal(url, title);
    } else {
      window.open(url, '_blank');
    }
  } else {
    // For Accurate Productivity, Archiva, and Khoshou App
    showPrivateModal();
  }
  return false;
}

function openPreviewModal(url, title) {
  const modal = document.getElementById('preview-modal');
  const iframe = document.getElementById('preview-iframe');
  const titleEl = document.getElementById('preview-title');

  if (modal && iframe && titleEl) {
    titleEl.textContent = title + " | Live Demo";
    iframe.src = url;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
}

function closePreviewModal() {
  const modal = document.getElementById('preview-modal');
  const iframe = document.getElementById('preview-iframe');

  if (modal && iframe) {
    modal.classList.remove('active');
    iframe.src = ''; // Stop the iframe content
    document.body.style.overflow = ''; // Restore scrolling
  }
}

function showPrivateModal() {
  const modal = document.getElementById('private-modal');
  if (modal) modal.classList.add('active');
}

function closePrivateModal() {
  const modal = document.getElementById('private-modal');
  if (modal) modal.classList.remove('active');
}
