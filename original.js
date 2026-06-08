document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const loginView = document.getElementById('login-view');
    const dashboardView = document.getElementById('dashboard-view');
    const signupView = document.getElementById('signup-view');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const logoutBtn = document.getElementById('logout-btn');
    
    // UI specific elements
    const userGreeting = document.getElementById('user-greeting');
    const portalBadge = document.getElementById('portal-badge');
    const adminNav = document.getElementById('admin-nav');
    const customerNav = document.getElementById('customer-nav');
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if(mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Toggle Password Visibility
    if(togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        });
    }

    // Set dynamic email if available
    const storedEmail = sessionStorage.getItem('userEmail');
    if (storedEmail) {
        document.querySelectorAll('.user-email').forEach(el => el.textContent = storedEmail);
        
        // Optionally create a dynamic name based on email prefix
        const namePrefix = storedEmail.split('@')[0];
        const formattedName = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1).replace(/[\.\_]/g, ' ');
        document.querySelectorAll('.user-name').forEach(el => el.textContent = formattedName);
    }

    // Handle Form Submission
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const errorContainer = document.getElementById('login-error');
            const errorText = document.getElementById('error-text');
            
            // Basic mock validation: Require a realistic password length for the demo
            if (passwordInput && passwordInput.value.length < 8) {
                if (errorContainer) {
                    errorContainer.style.display = 'flex';
                    errorText.textContent = 'Invalid email or password.';
                }
                return;
            }
            
            // Hide error if previously shown
            if (errorContainer) {
                errorContainer.style.display = 'none';
            }

            const roleSelect = document.getElementById('role-select');
            
            if (emailInput && emailInput.value) {
                sessionStorage.setItem('userEmail', emailInput.value);
            }
            
            const selectedRole = roleSelect.value;
            login(selectedRole);
        });
    }

    // Handle Logout
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logout();
        });
    }

    // Toggle Login/Signup Views
    const goToSignupBtn = document.getElementById('go-to-signup');
    const goToLoginBtn = document.getElementById('go-to-login');

    if (goToSignupBtn) {
        goToSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginView.style.opacity = '0';
            setTimeout(() => {
                loginView.style.display = 'none';
                loginView.classList.remove('active');
                
                signupView.style.display = 'flex';
                setTimeout(() => {
                    signupView.classList.add('active');
                    signupView.style.opacity = '1';
                }, 50);
            }, 300);
        });
    }

    if (goToLoginBtn) {
        goToLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signupView.style.opacity = '0';
            setTimeout(() => {
                signupView.style.display = 'none';
                signupView.classList.remove('active');
                
                loginView.style.display = 'flex';
                setTimeout(() => {
                    loginView.classList.add('active');
                    loginView.style.opacity = '1';
                }, 50);
            }, 300);
        });
    }

    // Handle Signup Submit
    // Define global handleSignup for the onclick attribute
    window.handleSignup = function() {
        const name = document.getElementById('signup-name').value.trim();
        const role = document.getElementById('signup-role').value;
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        const terms = document.getElementById('signup-terms');
        const errorContainer = document.getElementById('signup-error');
        const errorText = document.getElementById('signup-error-text');
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        let isValid = true;
        
        // Validate all registration fields
        if (!name || !role || !email || !emailRegex.test(email) || password.length < 8 || password !== confirm || (terms && !terms.checked)) {
            isValid = false;
        }
        
        // If validation fails, show "Invalid" error message
        if (!isValid) {
            if (errorContainer && errorText) {
                errorContainer.style.display = 'flex';
                errorText.textContent = 'Invalid';
            }
            return;
        }
        
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
        
        // Go directly to index.html upon successful validation
        window.location.href = 'index.html';
    };

    // Handle Sidebar Tab Switching
    const sidebarItems = document.querySelectorAll('.sidebar-nav li');
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Only proceed if it has a target
            const targetId = item.getAttribute('data-target');
            if(!targetId) return;

            // Remove active from sibling lis
            const parentNav = item.parentElement;
            parentNav.querySelectorAll('li').forEach(li => li.classList.remove('active'));
            
            // Add active to clicked li
            item.classList.add('active');

            // Find the correct content wrapper (admin or customer)
            const roleContainerId = targetId.startsWith('admin') ? 'admin-widgets' : 'customer-widgets';
            const roleContainer = document.getElementById(roleContainerId);
            
            if(roleContainer) {
                // Hide all panes
                roleContainer.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                });
                
                // Show target pane
                const targetPane = document.getElementById(targetId);
                if(targetPane) {
                    targetPane.classList.add('active');
                }
            }
            
            // Auto-close sidebar on mobile
            if(window.innerWidth <= 768) {
                const sidebarEl = document.querySelector('.sidebar');
                if(sidebarEl) sidebarEl.classList.remove('open');
            }
        });
    });

    function login(role) {
        if (role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'Patient.html';
        }
    }

    function resetTabs(navId, containerId, defaultTabId) {
        const nav = document.getElementById(navId);
        if(nav) {
            nav.querySelectorAll('li').forEach(li => li.classList.remove('active'));
            const defaultLi = nav.querySelector(`li[data-target="${defaultTabId}"]`);
            if(defaultLi) defaultLi.classList.add('active');
        }
        const container = document.getElementById(containerId);
        if(container) {
            container.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            const defaultPane = document.getElementById(defaultTabId);
            if(defaultPane) defaultPane.classList.add('active');
        }
    }

    function logout() {
        sessionStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    }

    // Handle dummy buttons inside tab panes
    const dummyButtons = document.querySelectorAll('.tab-pane button, .portal-tile');
    dummyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '404.html';
        });
    });
});
