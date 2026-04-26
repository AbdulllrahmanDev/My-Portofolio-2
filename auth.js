// Database / LocalStorage keys
const USERS_KEY = 'portfolio_users';
const CURRENT_USER_KEY = 'currentUser';

// Initialize DB if empty
if (!localStorage.getItem(USERS_KEY)) {
  localStorage.setItem(USERS_KEY, JSON.stringify([]));
}

function showMsg(message, type) {
  const msgDiv = document.getElementById('auth-msg');
  msgDiv.textContent = message;
  msgDiv.className = `auth-message ${type}`;
}

function switchTab(tab) {
  // Update Tabs
  document.getElementById('tab-login').classList.remove('active');
  document.getElementById('tab-signup').classList.remove('active');
  document.getElementById(`tab-${tab}`).classList.add('active');

  // Update Forms
  document.getElementById('form-login').classList.remove('active');
  document.getElementById('form-signup').classList.remove('active');
  document.getElementById(`form-${tab}`).classList.add('active');

  // Clear messages
  document.getElementById('auth-msg').className = 'auth-message';
  
  // Update header text dynamically
  const headerTitle = document.querySelector('.auth-header h1');
  const headerDesc = document.querySelector('.auth-header p');
  
  if (tab === 'login') {
    headerTitle.textContent = 'Welcome Back';
    headerDesc.textContent = 'Please enter your details to continue.';
  } else {
    headerTitle.textContent = 'Create Account';
    headerDesc.textContent = 'Get started with your free account.';
  }
}

function handleSignup(event) {
  event.preventDefault();
  
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;

  const users = JSON.parse(localStorage.getItem(USERS_KEY));

  // Check if email already exists
  if (users.find(u => u.email === email)) {
    showMsg('Email is already registered. Please log in.', 'error');
    return;
  }

  // Add new user
  const newUser = { name, email, password };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  showMsg('Account created successfully! You can now log in.', 'success');
  event.target.reset(); // clear form
  
  // Auto switch to login tab after 1.5 seconds
  setTimeout(() => {
    switchTab('login');
  }, 1500);
}

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  const users = JSON.parse(localStorage.getItem(USERS_KEY));
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    showMsg(`Welcome back, ${user.name}! Redirecting...`, 'success');
    
    // Set current user session
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ name: user.name, email: user.email }));
    
    // Redirect to home page
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } else {
    showMsg('Invalid email or password.', 'error');
  }
}

function openAuthModal() {
  document.getElementById('auth-modal').classList.add('open');
  switchTab('login');
  document.getElementById('form-login').reset();
  document.getElementById('form-signup').reset();
  document.getElementById('auth-msg').style.display = 'none';
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.remove('open');
}

// Update UI on load
window.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  if (currentUser) {
    const loginBtns = [document.getElementById('nav-login-btn'), document.getElementById('mobile-login-btn')];
    loginBtns.forEach(btn => {
      if (btn) {
        btn.innerText = '👤 ' + currentUser.name.split(' ')[0];
        btn.onclick = (e) => {
          e.stopPropagation();
          if (confirm('Do you want to log out?')) {
            localStorage.removeItem(CURRENT_USER_KEY);
            window.location.reload();
          }
        };
      }
    });
  }
});
