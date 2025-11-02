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
        
        // Initialize
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.renderAuthView(false);
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
        return `
            <div class="bg-white p-6 rounded-xl shadow-lg">
                <form onsubmit="event.preventDefault(); app.handleRegistration(this);" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${this.renderInput('text', 'name', 'Full Name', true)}
                        ${this.renderInput('text', 'studentId', 'Student ID', true)}
                        ${this.renderInput('email', 'email', 'Email Address', true)}
                        ${this.renderInput('tel', 'phone', 'Phone Number', true)}
                        ${this.renderInput('text', 'collegeName', 'College Name', true)}
                        ${this.renderInput('text', 'collegeCity', 'College City', true)}
                        ${this.renderInput('text', 'collegeState', 'College State', true, 'md:col-span-2')}
                        ${this.renderInput('password', 'password', 'Create Password', true, 'md:col-span-2')}
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
        return `
            <div class="${className}">
                <label for="reg-${name}" class="block text-sm font-medium text-text-dark mb-2">
                    ${label} ${required ? '*' : ''}
                </label>
                <input type="${type}" 
                    id="reg-${name}" 
                    name="${name}" 
                    ${required ? 'required' : ''} 
                    placeholder="${label}"
                    class="w-full p-3 border border-border-light rounded-lg text-text-dark transition
                        focus:border-button-teal focus:ring-2 focus:ring-button-teal focus:ring-opacity-20">
            </div>
        `;
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

        try {
            const response = await fetch('includes/functions.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'register', ...data })
            });

            const result = await response.json();
            
            if (result.success) {
                // Show success message in the content area instead of a toast
                this.contentArea.innerHTML = `
                    <div class="max-w-md mx-auto w-full">
                        <div class="bg-white p-8 rounded-xl shadow-lg text-center">
                            <div class="w-16 h-16 bg-success-green rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 class="text-2xl font-bold text-primary-dark mb-2">Registration Successful!</h2>
                            <p class="text-text-faded mb-6">Your account has been created successfully. You can now sign in to access your dashboard.</p>
                            <button onclick="app.renderAuthView(true)" 
                                class="w-full bg-button-teal text-white p-3 rounded-lg font-semibold hover:bg-opacity-90 transition duration-200 shadow-md">
                                Sign In Now
                            </button>
                        </div>
                    </div>
                `;
            } else {
                this.showMessage(result.message || 'Registration failed', 'error');
            }
        } catch (error) {
            this.showMessage('An error occurred during registration', 'error');
            console.error('Registration error:', error);
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