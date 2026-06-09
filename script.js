document.addEventListener('DOMContentLoaded', () => {
    const loginView = document.getElementById('login-view');
    const signupView = document.getElementById('signup-view');
    const loginForm = document.getElementById('login-form');
    
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    
    // Toggle Password Visibility
    if(togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        });
    }

    // Handle Form Submission
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const errorContainer = document.getElementById('login-error');
            const errorText = document.getElementById('error-text');
            
            if (passwordInput && passwordInput.value.length < 8) {
                if (errorContainer) {
                    errorContainer.style.display = 'flex';
                    errorText.textContent = 'Invalid credentials. Try again.';
                }
                return;
            }
            
            if (errorContainer) {
                errorContainer.style.display = 'none';
            }

            if (emailInput && emailInput.value) {
                const emailVal = emailInput.value.trim();
                sessionStorage.setItem('playerEmail', emailVal);
                const namePart = emailVal.split('@')[0];
                sessionStorage.setItem('playerName', namePart);
            }
            
            const roleSelect = document.getElementById('role-select');
            const selectedRole = roleSelect ? roleSelect.value : 'player';
            
            // Redirect to appropriate dashboard
            if (selectedRole === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'player.html';
            }
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
        
        if (!name || !role || !email || !emailRegex.test(email) || password.length < 8 || password !== confirm || (terms && !terms.checked)) {
            isValid = false;
        }
        
        if (!isValid) {
            if (errorContainer && errorText) {
                errorContainer.style.display = 'flex';
                errorText.textContent = 'Mission failed. Check your inputs.';
            }
            return;
        }
        
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
        
        alert("Avatar Created Successfully!");
        
        sessionStorage.setItem('playerEmail', email);
        sessionStorage.setItem('playerName', name);
        
        // Redirect to appropriate dashboard right after signup
        if (role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'player.html';
        }
    };

    // Handle Sidebar Tab Switching
    const sidebarItems = document.querySelectorAll('.sidebar-nav li');
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            if(!targetId) return;

            // Save active tab
            sessionStorage.setItem('activeTab', targetId);

            // Remove active from sibling lis
            const parentNav = item.parentElement;
            parentNav.querySelectorAll('li').forEach(li => li.classList.remove('active'));
            item.classList.add('active');

            const roleContainer = document.querySelector('.role-specific-content');
            
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

            // Close sidebar on mobile after clicking
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                if (overlay) {
                    overlay.classList.remove('active');
                }
            }
        });
    });

    // Handle Mobile Menu Toggle
    const mobileMenuBtns = document.querySelectorAll('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (mobileMenuBtns.length > 0 && sidebar) {
        mobileMenuBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                if (overlay) {
                    overlay.classList.toggle('active');
                }
            });
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }

    // Restore active tab on page load
    const savedTab = sessionStorage.getItem('activeTab');
    if (savedTab) {
        const targetItem = Array.from(sidebarItems).find(item => item.getAttribute('data-target') === savedTab);
        if (targetItem) {
            targetItem.click();
        }
    }

    // Dynamic Profile Update
    const storedEmail = sessionStorage.getItem('playerEmail');
    const storedName = sessionStorage.getItem('playerName');
    
    if (storedEmail) {
        document.querySelectorAll('.user-email').forEach(el => el.textContent = storedEmail);
    }
    if (storedName) {
        document.querySelectorAll('.user-name').forEach(el => el.textContent = storedName);
    }
});
