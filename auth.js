// Database / LocalStorage keys
const USERS_KEY = 'portfolio_users';
const CURRENT_USER_KEY = 'currentUser';

// Initialize DB if empty
if (!localStorage.getItem(USERS_KEY)) {
  localStorage.setItem(USERS_KEY, JSON.stringify([]));
}

// Validation Rules from Main Site
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

  // Update Tabs
  document.getElementById('tab-login').classList.remove('active');
  document.getElementById('tab-signup').classList.remove('active');
  document.getElementById(`tab-${tab}`).classList.add('active');

  // Update Forms
  document.getElementById('form-login').classList.remove('active');
  document.getElementById('form-signup').classList.remove('active');
  document.getElementById(`form-${tab}`).classList.add('active');

  // Clear messages
  const msgDiv = document.getElementById('auth-msg');
  if (msgDiv) {
    msgDiv.className = 'auth-message';
    msgDiv.style.display = 'none';
  }
  
  // Update header text dynamically
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
  
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;

  if (name.length < 3) {
    showMsg('Name must be at least 3 characters long.', 'error');
    return;
  }

  const emailValidation = validateEmailRules(email);
  if (!emailValidation.isValid) {
    showMsg(emailValidation.msg, 'error');
    return;
  }

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

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  const emailValidation = validateEmailRules(email);
  if (!emailValidation.isValid) {
    showMsg(emailValidation.msg, 'error');
    return;
  }

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
  
  // Re-initialize any components if needed
  updateAuthUI();
}

function updateAuthUI() {
  const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  const loginBtn = document.getElementById('nav-login-btn');
  const mobileLoginBtn = document.getElementById('mobile-login-btn');

  if (currentUser) {
    const firstName = currentUser.name.split(' ')[0];
    const uiContent = `👤 ${firstName}`;
    
    if (loginBtn) {
      loginBtn.innerText = uiContent;
      loginBtn.onclick = handleLogout;
    }
    if (mobileLoginBtn) {
      mobileLoginBtn.innerText = uiContent;
      mobileLoginBtn.onclick = handleLogout;
    }
  }
}

function handleLogout(e) {
  e.stopPropagation();
  if (confirm('Are you sure you want to log out?')) {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.reload();
  }
}

// Initial Load
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
