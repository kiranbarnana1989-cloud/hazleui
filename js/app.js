// Core application logic
class HazleApp {
    constructor() {
        // Constants
        this.REGISTRATION_FEE = 500.00;
        
        // DOM Elements
        this.contentArea = document.getElementById('app-container');
        this.adminModal = document.getElementById('admin-modal');
        
        // State
        this.isAdminLoggedIn = false;
        // Localization map (English default). Keys can be swapped for other locales.
        this.i18n = {
            errors: {
                invalid_email: 'Invalid email address',
                email_taken: 'Email already registered',
                invalid_phone: 'Phone must be 7-15 digits',
                password_weak: 'Password must be at least 8 characters and include uppercase, number and special char',
                password_mismatch: 'Passwords do not match'
                ,
                name_required: 'Enter your full name',
                college_required: 'Enter your college name/city/state'
            },
            requirements: {
                min8: 'At least 8 characters',
                uppercase: 'At least 1 uppercase letter',
                number: 'At least 1 number',
                special: 'At least 1 special character'
            }
        };
        
        // Initialize
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.injectStyles();
        this.renderAuthView(false);
    }

    injectStyles() {
        // Inject minimal styles for error animation and border if not present
        if (document.getElementById('hazle-inline-styles')) return;
        const style = document.createElement('style');
        style.id = 'hazle-inline-styles';
        style.textContent = `
            @keyframes hazle-shake { 0% { transform: translateX(0);} 20% { transform: translateX(-6px);} 40% { transform: translateX(6px);} 60% { transform: translateX(-4px);} 80% { transform: translateX(4px);} 100% { transform: translateX(0);} }
            .hazle-shake { animation: hazle-shake 360ms ease-in-out; }
            .hazle-error-border { border-color: #ef4444 !important; box-shadow: 0 0 0 3px rgba(239,68,68,0.08); }
            .hazle-strength-weak { color: #ef4444; }
            .hazle-strength-medium { color: #f59e0b; }
            .hazle-strength-strong { color: #10b981; }
            input { transition: border-color 160ms ease, box-shadow 160ms ease; }
            .reg-status { display: inline-flex; align-items: center; margin-left: 8px; vertical-align: middle; }
            .reg-status svg { width: 18px; height: 18px; opacity: 0; transition: opacity 180ms ease, transform 180ms ease; transform: scale(0.9); }
            .reg-status.show svg { opacity: 1; transform: scale(1); }
            .reg-status.success svg { color: #10b981; }
            .reg-status.error svg { color: #ef4444; }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Admin modal toggle
        document.querySelectorAll('[data-action="toggle-admin"]').forEach(button => {
            button.addEventListener('click', () => this.toggleAdminModal(true));
        });

        // Admin modal close
        document.querySelectorAll('[data-action="close-admin"]').forEach(button => {
            button.addEventListener('click', () => this.toggleAdminModal(false));
        });
    }

    // UI Components
    showMessage(message, type = 'success') {
        const color = type === 'success' ? 'bg-success-green' : 'bg-error-red';
        
        let existingToast = document.getElementById('custom-toast');
        if (existingToast) { existingToast.remove(); }

        const toast = document.createElement('div');
        toast.id = 'custom-toast';
        toast.className = `fixed top-6 right-6 p-4 rounded-lg shadow-deep z-50 text-white font-medium 
                         transition-opacity duration-300 ${color}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    toggleAdminModal(show) {
        if (show) {
            this.adminModal.classList.remove('hidden');
            this.adminModal.classList.add('flex');
        } else {
            this.adminModal.classList.add('hidden');
            this.adminModal.classList.remove('flex');
        }
    }

    scrollToApplication() {
        document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
    }

    // View Rendering
    renderAuthView(isLogin = false) {
        // Reset admin session when returning to auth view
        this.isAdminLoggedIn = false;
        
        this.contentArea.innerHTML = `
            <div class="max-w-md mx-auto w-full">
                <a id="application-form" class="relative -top-16 block"></a>
                
                <!-- Auth Toggle -->
                <div class="flex justify-center space-x-4 mb-8">
                    <button onclick="app.renderAuthView(false)" 
                        class="px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${!isLogin ? 
                            'bg-button-teal text-white shadow-md' : 
                            'text-text-faded hover:text-primary-dark'
                        }">
                        New Registration
                    </button>
                    <button onclick="app.renderAuthView(true)" 
                        class="px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${isLogin ? 
                            'bg-button-teal text-white shadow-md' : 
                            'text-text-faded hover:text-primary-dark'
                        }">
                        Sign In
                    </button>
                </div>

                <div class="bg-white p-8 rounded-xl shadow-lg">
                    <h2 class="text-3xl font-bold text-center mb-2 text-primary-dark">
                        ${isLogin ? 'Welcome Back!' : 'Create Account'}
                    </h2>
                    <p class="text-md text-center text-text-faded mb-8">
                        ${isLogin ? 
                            'Sign in to access your dashboard and application status.' : 
                            'Start your scholarship journey by creating an account.'}
                    </p>
                    
                    <!-- Auth Form -->
                    ${isLogin ? this.renderLoginForm() : this.renderRegistrationForm()}

                    <!-- Form Footer -->
                    <div class="mt-6 pt-6 border-t border-border-light text-center">
                        <p class="text-sm text-text-faded">
                            ${isLogin ? 
                                "Don't have an account? " : 
                                "Already have an account? "}
                            <button onclick="app.renderAuthView(${!isLogin})" 
                                class="text-button-teal font-semibold hover:underline">
                                ${isLogin ? 'Register Now' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    renderLoginForm() {
        return `
            <form onsubmit="event.preventDefault(); app.handleLogin(this);" class="space-y-6">
                <div class="space-y-4">
                    <div>
                        <label for="login-identifier" class="block text-sm font-medium text-text-dark mb-2">
                            Email or Student ID
                        </label>
                        <input type="text" 
                            id="login-identifier" 
                            name="identifier" 
                            required 
                            placeholder="Enter your email or ID"
                            class="w-full p-3 border border-border-light rounded-lg text-text-dark transition
                                focus:border-button-teal focus:ring-2 focus:ring-button-teal focus:ring-opacity-20">
                    </div>
                    <div>
                        <label for="login-password" class="block text-sm font-medium text-text-dark mb-2">
                            Password
                        </label>
                        <input type="password" 
                            id="login-password" 
                            name="password" 
                            required 
                            placeholder="Enter your password"
                            class="w-full p-3 border border-border-light rounded-lg text-text-dark transition
                                focus:border-button-teal focus:ring-2 focus:ring-button-teal focus:ring-opacity-20">
                    </div>
                </div>

                <button type="submit"
                    class="w-full bg-button-teal text-white p-4 rounded-lg font-semibold hover:bg-opacity-90 
                        transition duration-200 shadow-md flex items-center justify-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign In</span>
                </button>
            </form>
        `;
    }

    renderRegistrationForm() {
        // Better field order: Name, Email, Phone, College Name, College City, College State, Password, Confirm Password
        return `
            <div class="bg-white p-6 rounded-xl shadow-lg">
                <form onsubmit="event.preventDefault(); app.handleRegistration(this);" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${this.renderInput('text', 'name', 'Full Name', true, 'md:col-span-2')}
                        ${this.renderInput('email', 'email', 'Email Address', true, 'md:col-span-2')}
                        ${this.renderInput('tel', 'phone', 'Phone Number', true, '')}
                        ${this.renderInput('text', 'collegeName', 'College Name', true, '')}
                        ${this.renderInput('text', 'collegeCity', 'College City', true, '')}
                        ${this.renderInput('text', 'collegeState', 'College State', true, '')}
                        ${this.renderInput('password', 'password', 'Create Password', true, '')}
                        ${this.renderInput('password', 'confirm_password', 'Confirm Password', true, '')}
                    </div>
                    <button type="submit"
                        class="w-full bg-button-teal text-white p-3 mt-4 rounded-lg font-semibold hover:bg-opacity-90 transition duration-200 shadow-md">
                        Register Now (₹${this.REGISTRATION_FEE.toFixed(2)})
                    </button>
                </form>
            </div>
        `;
    }

    renderInput(type, name, label, required = false, className = '') {
        // Add password strength hook for the primary password field
        let additionalAttr = '';
        if (name === 'password' && type === 'password') {
            // update strength and re-check confirm field live
            additionalAttr = 'oninput="app.updatePasswordStrength(this.value); app.liveConfirmCheck();"';
        }
        if (name === 'confirm_password') {
            // live check on input and on blur
            additionalAttr = 'oninput="app.liveConfirmCheck()" onblur="app.liveConfirmCheck()"';
        }
        const strengthHtml = (name === 'password' && type === 'password') ? `
            <div id="reg-password-strength" class="text-sm mt-1"></div>
            <div id="reg-password-requirements" class="text-xs text-text-faded mt-2">
                <ul class="list-none space-y-1 m-0 p-0">
                    <li id="pwd-req-min8">◻ ${this.i18n.requirements.min8}</li>
                    <li id="pwd-req-upper">◻ ${this.i18n.requirements.uppercase}</li>
                    <li id="pwd-req-number">◻ ${this.i18n.requirements.number}</li>
                    <li id="pwd-req-special">◻ ${this.i18n.requirements.special}</li>
                </ul>
            </div>` : '';
        // Add max length and patterns for specific fields
        let extra = '';
        if (name === 'name') extra = 'maxlength="100"';
        if (name === 'email') extra = 'maxlength="100"';
        if (name === 'phone') extra = 'maxlength="15" pattern="[0-9]*" inputmode="numeric"';
        if (name === 'collegeName' || name === 'collegeCity' || name === 'collegeState') extra = 'maxlength="100"';

        return `
            <div class="${className}">
                <label for="reg-${name}" class="block text-sm font-medium text-text-dark mb-2">
                    ${label} ${required ? '*' : ''}
                </label>
                <div class="relative">
                <input type="${type}" 
                    id="reg-${name}" 
                    name="${name}" 
                    ${required ? 'required' : ''} 
                    placeholder="${label}"
                    ${additionalAttr}
                    ${extra}
                    class="w-full p-3 border border-border-light rounded-lg text-text-dark transition
                        focus:border-button-teal focus:ring-2 focus:ring-button-teal focus:ring-opacity-20">
                <span id="reg-status-${name}" class="reg-status" aria-hidden="true">
                    <svg viewBox="0 0 20 20" fill="currentColor" class="check-circle"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                </span>
                </div>
                <p id="reg-${name}-error" class="text-sm text-error-red mt-1 hidden"></p>
                ${strengthHtml}
            </div>
        `;
    }

    validateRegistration(data, form) {
        // Clear previous errors
        ['name','email','phone','collegeName','collegeCity','collegeState','password','confirm_password'].forEach(k => {
            const el = form.querySelector(`#reg-${k}-error`);
            if (el) { el.textContent = ''; el.classList.add('hidden'); }
            const input = form.querySelector(`#reg-${k}`);
            if (input) input.classList.remove('hazle-error-border');
        });

    let valid = true;
        // Name
        if (!data.name || data.name.trim().length < 2) {
            const el = form.querySelector('#reg-name-error'); el.textContent = (this.i18n.errors.name_required || 'Enter your full name'); el.classList.remove('hidden');
            form.querySelector('#reg-name')?.classList.add('hazle-error-border'); valid = false;
        }
        // Email
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRe.test(data.email)) {
            const el = form.querySelector('#reg-email-error'); el.textContent = (this.i18n.errors.invalid_email || 'Enter a valid email address'); el.classList.remove('hidden');
            form.querySelector('#reg-email')?.classList.add('hazle-error-border'); valid = false;
        }
        // Phone
        if (!data.phone || !/^[0-9]{7,15}$/.test(data.phone)) {
            const el = form.querySelector('#reg-phone-error'); el.textContent = (this.i18n.errors.invalid_phone || 'Enter a valid phone number (7-15 digits)'); el.classList.remove('hidden');
            form.querySelector('#reg-phone')?.classList.add('hazle-error-border'); valid = false;
        }
        // College fields
        if (!data.collegeName || data.collegeName.trim().length < 2) {
            const el = form.querySelector('#reg-collegeName-error'); el.textContent = (this.i18n.errors.college_required || 'Enter your college name'); el.classList.remove('hidden');
            form.querySelector('#reg-collegeName')?.classList.add('hazle-error-border'); valid = false;
        }
        if (!data.collegeCity || data.collegeCity.trim().length < 2) {
            const el = form.querySelector('#reg-collegeCity-error'); el.textContent = (this.i18n.errors.college_required || 'Enter your college city'); el.classList.remove('hidden');
            form.querySelector('#reg-collegeCity')?.classList.add('hazle-error-border'); valid = false;
        }
        if (!data.collegeState || data.collegeState.trim().length < 2) {
            const el = form.querySelector('#reg-collegeState-error'); el.textContent = (this.i18n.errors.college_required || 'Enter your college state'); el.classList.remove('hidden');
            form.querySelector('#reg-collegeState')?.classList.add('hazle-error-border'); valid = false;
        }
        // Password strength - require: min 8, uppercase, number, special char
        const pwd = data.password || '';
        const hasMin = pwd.length >= 8;
        const hasUpper = /[A-Z]/.test(pwd);
        const hasNum = /[0-9]/.test(pwd);
        const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
        if (!hasMin || !hasUpper || !hasNum || !hasSpecial) {
            const el = form.querySelector('#reg-password-error'); el.textContent = 'Password must be ≥8 chars with uppercase, number and special char'; el.classList.remove('hidden');
            form.querySelector('#reg-password')?.classList.add('hazle-error-border'); valid = false;
        }

        // Show success icons for valid fields
        ['name','email','phone','collegeName','collegeCity','collegeState','password'].forEach(k => {
            const status = form.querySelector(`#reg-status-${k}`);
            const input = form.querySelector(`#reg-${k}`);
            const err = form.querySelector(`#reg-${k}-error`);
            if (status) {
                if (err && !err.classList.contains('hidden') || !input || input.classList.contains('hazle-error-border')) {
                    status.classList.remove('show','success'); status.classList.add('error');
                } else {
                    status.classList.add('show','success'); status.classList.remove('error');
                }
            }
        });

        return valid;
    }

    copyToClipboard(text) {
        if (!navigator.clipboard) {
            // fallback
            const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch(e) {} ta.remove();
            this.showMessage('Copied to clipboard', 'success');
            return;
        }
        navigator.clipboard.writeText(text).then(() => this.showMessage('Copied Student ID to clipboard', 'success'))
            .catch(() => this.showMessage('Could not copy to clipboard', 'error'));
    }

    updatePasswordStrength(value) {
        const el = document.getElementById('reg-password-strength');
        if (!el) return;
        const reqMin = document.getElementById('pwd-req-min8');
        const reqUpper = document.getElementById('pwd-req-upper');
        const reqNum = document.getElementById('pwd-req-number');
        const reqSpec = document.getElementById('pwd-req-special');

        const hasMin = value.length >= 8;
        const hasUpper = /[A-Z]/.test(value);
        const hasNum = /[0-9]/.test(value);
        const hasSpec = /[^A-Za-z0-9]/.test(value);

        if (reqMin) reqMin.textContent = (hasMin ? '✓ ' : '◻ ') + this.i18n.requirements.min8;
        if (reqUpper) reqUpper.textContent = (hasUpper ? '✓ ' : '◻ ') + this.i18n.requirements.uppercase;
        if (reqNum) reqNum.textContent = (hasNum ? '✓ ' : '◻ ') + this.i18n.requirements.number;
        if (reqSpec) reqSpec.textContent = (hasSpec ? '✓ ' : '◻ ') + this.i18n.requirements.special;

        const score = this.calculatePasswordScore(value);
        el.className = 'text-sm mt-1';
        el.textContent = '';
        el.classList.remove('hazle-strength-weak','hazle-strength-medium','hazle-strength-strong');
        if (!hasMin || !hasUpper || !hasNum || !hasSpec) {
            el.textContent = 'Requirements not met';
            el.classList.add('hazle-strength-weak');
        } else if (score === 2) {
            el.textContent = 'Medium strength';
            el.classList.add('hazle-strength-medium');
        } else {
            el.textContent = 'Strong password';
            el.classList.add('hazle-strength-strong');
        }
    }

    // Live confirm password check: shows/hides inline error and status icon
    liveConfirmCheck() {
        const pwdEl = document.getElementById('reg-password');
        const confEl = document.getElementById('reg-confirm_password');
        const errEl = document.getElementById('reg-confirm_password-error');
        const status = document.getElementById('reg-status-confirm_password');
        if (!confEl) return;

        const pwd = pwdEl ? pwdEl.value : '';
        const conf = confEl.value || '';

        // If both fields are empty, clear state
        if (!pwd && !conf) {
            if (errEl) { errEl.textContent = ''; errEl.classList.add('hidden'); }
            confEl.classList.remove('hazle-error-border');
            if (status) { status.classList.remove('show','error'); status.classList.remove('success'); }
            return;
        }

        if (conf === '') {
            // don't show mismatch while user hasn't typed confirm
            if (errEl) { errEl.textContent = ''; errEl.classList.add('hidden'); }
            confEl.classList.remove('hazle-error-border');
            if (status) { status.classList.remove('show','error'); status.classList.remove('success'); }
            return;
        }

        if (pwd === conf) {
            // match
            if (errEl) { errEl.textContent = ''; errEl.classList.add('hidden'); }
            confEl.classList.remove('hazle-error-border');
            if (status) { status.classList.add('show','success'); status.classList.remove('error'); }
        } else {
            // mismatch
            const message = (this.i18n && this.i18n.errors && this.i18n.errors.password_mismatch) ? this.i18n.errors.password_mismatch : 'Passwords do not match';
            if (errEl) { errEl.textContent = message; errEl.classList.remove('hidden'); }
            confEl.classList.add('hazle-error-border');
            if (status) { status.classList.add('show','error'); status.classList.remove('success'); }
        }
    }

    calculatePasswordScore(value) {
        let score = 0;
        if (!value) return 0;
        if (value.length >= 8) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;
        // Normalize: return 0..3
        if (score <= 1) return 1;
        if (score === 2) return 2;
        return 3;
    }

    // Form Handlers
    async handleLogin(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            console.log('Attempting student login:', { identifier: data.identifier });
            
            const response = await fetch('includes/functions.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'login', ...data })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Login response:', result);
            
            if (result.success && result.user) {
                this.showMessage(`Welcome back, ${result.user.name}!`, 'success');
                this.renderDashboard(result.user);
            } else {
                throw new Error(result.message || 'Invalid login credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage(error.message || 'An error occurred during login', 'error');
        }
    }

    renderDashboard(user) {
        this.contentArea.innerHTML = `
            <div class="max-w-4xl mx-auto w-full">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-success-green">
                        Welcome, ${user.name.split(' ')[0]}
                    </h2>
                    <p class="text-md text-text-faded mt-2">
                        Your application status and assessment results
                    </p>
                </div>
                    
                <div class="bg-white p-6 rounded-xl border border-button-teal/20 shadow-lg space-y-6">
                    <div class="border-b border-border-light pb-4">
                        <p class="text-xl font-semibold text-primary-dark">${user.name}</p>
                        <p class="text-sm text-text-faded mt-1">
                            Student ID: ${user.studentId} 
                            <span class="mx-2">•</span> 
                            ${user.collegeName}
                        </p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-4 rounded-lg border border-border-light bg-button-teal/5 text-center">
                            <p class="text-sm font-medium text-text-faded">Assessment Score</p>
                            <p class="text-4xl font-extrabold text-button-teal mt-2">${user.mockScore}</p>
                        </div>
                        <div class="p-4 rounded-lg border border-border-light bg-primary-dark/5 text-center">
                            <p class="text-sm font-medium text-text-faded">Current Rank</p>
                            <p class="text-4xl font-extrabold text-primary-dark mt-2">${user.mockRank}</p>
                        </div>
                    </div>

                    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                        <h4 class="text-yellow-800 font-semibold">Next Steps</h4>
                        <p class="text-yellow-700 text-sm mt-1">
                            Final Assessment date will be communicated via email 15 days prior.
                        </p>
                    </div>
                </div>
                
                <button onclick="app.renderAuthView(true)" 
                    class="mt-8 w-full bg-error-red text-white p-3 rounded-lg font-semibold hover:bg-opacity-90 transition duration-200 shadow-md">
                    Sign Out
                </button>
            </div>
        `;
        this.scrollToApplication();
    }

    async handleRegistration(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Run a live confirm check so inline state is up-to-date before validation
        this.liveConfirmCheck();

        // Client-side validation: validate fields first
        if (!this.validateRegistration(data, form)) {
            return;
        }

        // Client-side validation: ensure password and confirmation match
    const confirmVal = form.querySelector('#reg-confirm_password')?.value.trim() || '';
    const pwdVal = (data.password || '').trim();
    if (pwdVal !== confirmVal) {
            const errEl = form.querySelector('#reg-confirm_password-error');
            const confirmEl = form.querySelector('#reg-confirm_password');
            const message = (this.i18n && this.i18n.errors && this.i18n.errors.password_mismatch) ? this.i18n.errors.password_mismatch : 'Passwords do not match';
            if (errEl) {
                errEl.textContent = message;
                errEl.classList.remove('hidden');
            } else {
                this.showMessage(message, 'error');
            }
            if (confirmEl) {
                confirmEl.classList.add('hazle-error-border');
                // Add shake animation to the wrapper
                const wrapper = confirmEl.closest('div');
                if (wrapper) {
                    wrapper.classList.remove('hazle-shake');
                    // trigger reflow
                    void wrapper.offsetWidth;
                    wrapper.classList.add('hazle-shake');
                    setTimeout(() => wrapper.classList.remove('hazle-shake'), 400);
                }
                confirmEl.focus();
            }
            return;
        }

        // Hide any previous error for confirm_password and remove error border
        const prevErr = form.querySelector('#reg-confirm_password-error');
        if (prevErr) {
            prevErr.textContent = '';
            prevErr.classList.add('hidden');
        }
        const confirmEl2 = form.querySelector('#reg-confirm_password');
        if (confirmEl2) confirmEl2.classList.remove('hazle-error-border');

    // Remove confirm_password before sending to server (if present)
    if (Object.prototype.hasOwnProperty.call(data, 'confirm_password')) delete data.confirm_password;

    // Disable submit button to prevent double submissions
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; }

    try {
            const response = await fetch('includes/functions.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'register', ...data })
            });

            const result = await response.json();
            
            if (result.success) {
                // Show success message in the content area and display the generated Student ID if available
                const studentId = result.user?.studentId || null;
                this.contentArea.innerHTML = `
                    <div class="max-w-md mx-auto w-full">
                        <div class="bg-white p-8 rounded-xl shadow-lg text-center">
                            <div class="w-16 h-16 bg-success-green rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 class="text-2xl font-bold text-primary-dark mb-2">Registration Successful!</h2>
                            <p class="text-text-faded mb-3">Your account has been created successfully.</p>
                                        ${studentId ? `<p class="text-lg font-semibold mb-4">Student ID: <span class="text-button-teal">${studentId}</span> <button onclick="app.copyToClipboard('${studentId}')" class="ml-3 px-3 py-1 bg-gray-100 rounded text-sm">Copy</button></p>` : `<p class="text-text-faded mb-6">You can now sign in to access your dashboard.</p>`}
                            <button onclick="app.renderAuthView(true)" 
                                class="w-full bg-button-teal text-white p-3 rounded-lg font-semibold hover:bg-opacity-90 transition duration-200 shadow-md">
                                Sign In Now
                            </button>
                        </div>
                    </div>
                `;
            } else {
                if (result.errors && typeof result.errors === 'object') {
                    // Attach field-specific errors
                    Object.keys(result.errors).forEach(field => {
                        const el = form.querySelector(`#reg-${field}-error`);
                        const input = form.querySelector(`#reg-${field}`);
                        const status = form.querySelector(`#reg-status-${field}`);
                        const payload = result.errors[field];
                        let message = '';
                        if (typeof payload === 'string') message = payload;
                        else if (payload && typeof payload === 'object') {
                            if (payload.code && this.i18n && this.i18n.errors && this.i18n.errors[payload.code]) {
                                message = this.i18n.errors[payload.code];
                            } else {
                                message = payload.message || '';
                            }
                        }
                        if (el) { el.textContent = message; el.classList.remove('hidden'); }
                        if (input) input.classList.add('hazle-error-border');
                        if (status) { status.classList.add('show','error'); status.classList.remove('success'); }
                    });
                } else {
                    this.showMessage(result.message || 'Registration failed', 'error');
                }
            }
        } catch (error) {
            this.showMessage('An error occurred during registration', 'error');
            console.error('Registration error:', error);
        } finally {
            if (submitBtn) { submitBtn.disabled = false; }
        }
    }

    async handleAdminLogin(form) {
        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;
        button.innerHTML = '<span class="spinner mr-3"></span> Authenticating...';

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            console.log('Sending admin login request:', { ...data, password: '***' });
            
            const response = await fetch('includes/functions.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'admin_login', ...data })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Admin login response:', result);
            
            if (result.success) {
                this.isAdminLoggedIn = true;
                this.toggleAdminModal(false);
                this.showMessage('Admin access granted', 'success');
                await this.loadAdminDashboard();
            } else {
                throw new Error(result.message || 'Admin login failed');
            }
        } catch (error) {
            console.error('Admin login error:', error);
            this.showMessage(`Error: ${error.message}`, 'error');
            button.disabled = false;
            button.innerHTML = 'Log In Securely';
        }
    }

    async loadAdminDashboard() {
        if (!this.isAdminLoggedIn) {
            this.showMessage('Admin access required', 'error');
            this.renderAuthView(true);
            return;
        }

        try {
            console.log('Fetching admin dashboard data...');
            
            const response = await fetch('includes/functions.php', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({ 
                    action: 'get_users',
                    admin: true
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Dashboard data response:', result);
            
            if (result.success) {
                this.renderAdminDashboard(result.users);
            } else {
                throw new Error(result.message || 'Failed to load dashboard data');
            }
        } catch (error) {
            console.error('Dashboard loading error:', error);
            this.showMessage(`Error: ${error.message}`, 'error');
            
            // If it's an unauthorized error, return to auth view
            if (error.message === 'Unauthorized') {
                this.isAdminLoggedIn = false;
                this.renderAuthView(true);
            }
        }
    }

    renderAdminDashboard(users = []) {
        const userCount = users.length;
        
        this.contentArea.innerHTML = `
            <div class="max-w-6xl mx-auto w-full">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-primary-dark">Administrative Console</h2>
                    <p class="text-md text-text-faded mt-2">Scholarship Program Overview</p>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div class="bg-primary-dark text-white p-6 rounded-xl shadow-lg">
                        <p class="text-sm font-medium opacity-80">Total Registrations</p>
                        <p class="text-4xl font-extrabold mt-2">${userCount}</p>
                    </div>
                    <div class="bg-success-green text-white p-6 rounded-xl shadow-lg">
                        <p class="text-sm font-medium opacity-80">Revenue Generated</p>
                        <p class="text-4xl font-extrabold mt-2">₹${(userCount * this.REGISTRATION_FEE).toLocaleString()}</p>
                    </div>
                    <div class="bg-button-teal text-white p-6 rounded-xl shadow-lg">
                        <p class="text-sm font-medium opacity-80">Highest Score</p>
                        <p class="text-4xl font-extrabold mt-2">${userCount > 0 ? Math.max(...users.map(u => u.mockScore)) : 'N/A'}</p>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-xl font-semibold text-primary-dark mb-4 pb-2 border-b">
                        Student Applications
                    </h3>
            
                    ${userCount === 0 
                        ? '<p class="text-text-faded text-center py-8">No records available yet.</p>'
                        : `<div class="overflow-x-auto w-full">
                            <table class="min-w-full divide-y divide-border-light">
                                <thead class="bg-border-light">
                                    <tr>
                                        <th class="px-3 py-3 text-left text-xs font-medium text-primary-dark uppercase tracking-wider">Student/College</th>
                                        <th class="px-3 py-3 text-left text-xs font-medium text-primary-dark uppercase tracking-wider">Score</th>
                                        <th class="px-3 py-3 text-left text-xs font-medium text-primary-dark uppercase tracking-wider">Trans ID</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-border-light">
                                    ${users.map(user => `
                                        <tr class="hover:bg-gray-50 transition">
                                            <td class="px-3 py-3 whitespace-nowrap">
                                                <p class="text-sm font-semibold text-primary-dark">${user.name} (${user.studentId})</p>
                                                <p class="text-xs text-text-faded">${user.collegeCity}, ${user.collegeState}</p>
                                            </td>
                                            <td class="px-3 py-3 whitespace-nowrap text-md font-extrabold text-button-teal">${user.mockScore}</td>
                                            <td class="px-3 py-3 whitespace-nowrap text-xs text-text-faded">${user.transactionId?.substring(0, 10)}...</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>`
                    }
                </div>
                
                <button onclick="app.renderAuthView(true)" 
                    class="mt-8 w-full bg-error-red text-white p-3 rounded-lg font-semibold hover:bg-opacity-90 transition">
                    Log Out Admin
                </button>
            </div>
        `;
        this.scrollToApplication();
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new HazleApp();
});