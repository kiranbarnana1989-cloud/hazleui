// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Initialize global constants
    window.CONTENT_AREA = document.getElementById('app-container');
    window.ADMIN_MODAL = document.getElementById('admin-modal');
    window.REGISTRATION_FEE = 500.00;
    
    // Start the application
    initializeApp();
});

// --- Utility Functions ---

// API Functions
async function apiRequest(action, data) {
    try {
        const response = await fetch('includes/functions.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: action,
                ...data
            })
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, message: 'An error occurred' };
    }
}

const showMessage = (message, type = 'success') => {
    const color = type === 'success' ? 'bg-success-green' : 'bg-error-red';
    
    let existingToast = document.getElementById('custom-toast');
    if (existingToast) { existingToast.remove(); }

    const toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.className = `fixed top-6 right-6 p-4 rounded-lg shadow-deep z-50 text-white font-medium transition-opacity duration-300 ${color}`;
    toast.innerHTML = `<p>${message}</p>`;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
};

const toggleAdminModal = (show) => {
    if (show) {
        ADMIN_MODAL.classList.remove('hidden');
        ADMIN_MODAL.classList.add('flex');
    } else {
        ADMIN_MODAL.classList.add('hidden');
        ADMIN_MODAL.classList.remove('flex');
    }
};

const scrollToApplication = () => {
    document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' });
};


// --- Auth View (Registration / Login) ---

const renderAuthView = (isLogin = false) => {
    let html = `
        <div class="max-w-md mx-auto w-full">
            <a id="application-form" class="relative -top-16 block"></a>
            <h2 class="text-3xl font-bold text-center mb-2 text-primary-dark">
                ${isLogin ? 'Student Login' : 'New Registration'}
            </h2>
            <p class="text-md text-center text-text-faded mb-8">
                ${isLogin ? 'Access your dashboard and application status.' : 'Start your application journey now.'}
            </p>
            
            <!-- Pill Switch (Classic High Contrast) -->
            <div class="p-1 border border-border-light rounded-lg flex mb-10 shadow-classic">
                <button id="tab-login" onclick="renderAuthView(true)" 
                    class="flex-1 py-2 text-md font-semibold rounded-md transition duration-300 ${isLogin ? 'bg-button-teal text-white shadow-md' : 'text-text-faded hover:text-primary-dark'}">
                    Log In
                </button>
                <button id="tab-register" onclick="renderAuthView(false)" 
                    class="flex-1 py-2 text-md font-semibold rounded-md transition duration-300 ${!isLogin ? 'bg-button-teal text-white shadow-md' : 'text-text-faded hover:text-primary-dark'}">
                    Register
                </button>
            </div>
        </div>
    `;

    if (isLogin) {
        // Login Form
        html += `
            <div class="max-w-md mx-auto w-full bg-white p-6 rounded-lg shadow-md">
                <form onsubmit="event.preventDefault(); handleStudentLogin(this);" class="space-y-6">
                    <div>
                        <label for="login-identifier" class="block text-sm font-medium text-text-dark mb-2">
                            Email or Student ID
                        </label>
                        <input type="text" 
                            id="login-identifier" 
                            name="identifier" 
                            required 
                            placeholder="Enter ID or Email"
                            class="w-full p-3 border border-border-light rounded-lg text-text-dark transition">
                    </div>
                    <div>
                        <label for="login-password" class="block text-sm font-medium text-text-dark mb-2">
                            Password
                        </label>
                        <input type="password" 
                            id="login-password" 
                            name="password" 
                            required 
                            placeholder="Your secret password"
                            class="w-full p-3 border border-border-light rounded-lg text-text-dark transition">
                    </div>
                    <button type="submit"
                        class="w-full bg-button-teal text-white p-3 rounded-lg font-semibold hover:bg-opacity-90 transition duration-200 shadow-md">
                        Secure Login
                    </button>
                </form>
            </div>
        `;
    } else {
        // Registration Step 1 Form
        html += `
            <div id="reg-step-1">
                <div class="flex items-center space-x-2 text-lg font-semibold text-primary-dark mb-6 border-b border-border-light pb-2">
                    <span class="w-6 h-6 flex items-center justify-center bg-button-teal text-white rounded-full text-sm">1</span>
                    <span>Personal & College Details</span>
                </div>
                <form id="registration-form" onsubmit="event.preventDefault(); handleRegistration(this);">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${renderInput('text', 'name', 'Full Name *')}
                        ${renderInput('text', 'studentId', 'Student ID *')}
                        ${renderInput('email', 'email', 'Email *')}
                        ${renderInput('tel', 'phone', 'Phone Number *')}
                        ${renderInput('text', 'collegeName', 'College Name *')}
                        ${renderInput('text', 'collegeCity', 'College City *')}
                        ${renderInput('text', 'collegeState', 'College State *', 'md:col-span-2')}
                        ${renderInput('password', 'password', 'Create Password *', 'md:col-span-2')}
                    </div>
                    
                    <button type="submit"
                        class="w-full bg-button-teal text-white p-3 mt-8 rounded-lg font-semibold hover:bg-opacity-90 transition duration-200 shadow-md">
                        Next: Payment (₹${REGISTRATION_FEE.toFixed(2)})
                    </button>
                </form>
            </div>

            <!-- Payment Step 2 (Hidden initially) -->
            <div id="reg-step-2" class="hidden">
                <div class="flex items-center space-x-2 text-lg font-semibold text-primary-dark mb-6 border-b border-border-light pb-2">
                    <span class="w-6 h-6 flex items-center justify-center bg-button-teal text-white rounded-full text-sm">2</span>
                    <span>Confirm Payment</span>
                </div>
                <div class="bg-button-teal/10 border-l-4 border-button-teal p-4 mb-8 rounded-lg">
                    <p class="font-bold text-primary-dark text-xl">Processing Fee: ₹${REGISTRATION_FEE.toFixed(2)}</p>
                    <p class="text-sm text-text-faded mt-1">This is a one-time, mandatory fee for assessment access.</p>
                </div>
                
                <p class="text-center font-semibold text-text-dark mb-4">Pay via UPI</p>
                <div class="flex justify-center mb-6">
                    <!-- Mock QR Code (Classic Teal Accent Placeholder) -->
                    <img src="https://placehold.co/220x220/17A2B8/FFFFFF?text=HAZLE+PAY" alt="Payment QR Code"
                         class="rounded-lg shadow-deep border-4 border-border-light">
                </div>

                <form onsubmit="event.preventDefault(); completeRegistration(this);">
                    ${renderInput('text', 'transactionId', 'Transaction ID (Mandatory) *')}
                    ${renderInput('file', 'screenshot', 'Payment Screenshot (Optional)', 'col-span-2', 'image/*')}

                    <button type="submit" id="complete-reg-btn"
                        class="w-full bg-success-green text-white p-3 mt-8 rounded-lg font-semibold hover:bg-opacity-90 transition duration-200 shadow-md flex items-center justify-center">
                        Complete Registration
                    </button>
                </form>
            </div>
        `;
    }

    CONTENT_AREA.innerHTML = html;
    window.tempRegData = {}; // Reset temp data
};

const renderInput = (type, name, label, className = '', accept = '') => {
    const inputType = type === 'file' ? 'type="file"' : `type="${type}" placeholder="${label.replace(' *', '')}"`;
    const acceptAttr = type === 'file' ? `accept="${accept}"` : '';

    return `
        <div class="${className || 'mb-4'}">
            <label for="reg-${name}" class="block text-sm font-medium text-text-dark mb-2">
                ${label}
            </label>
            <input ${inputType} 
                id="reg-${name}" 
                name="${name}" 
                ${label.includes('*') ? 'required' : ''} 
                ${acceptAttr}
                class="w-full p-3 border border-border-light rounded-lg text-text-dark transition focus:border-button-teal focus:ring-2 focus:ring-button-teal focus:ring-opacity-20">
        </div>
    `;
};

const handleRegistration = async (form) => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const result = await apiRequest('register', data);
    
    if (result.success) {
        showMessage('Registration successful!', 'success');
        renderAuthView(true); // Switch to login view
    } else {
        showMessage(result.message || 'Registration failed', 'error');
    }
};

const completeRegistration = async (form) => {
    const button = document.getElementById('complete-reg-btn');
    button.disabled = true;
    button.innerHTML = '<span class="spinner mr-3"></span> Activating Account...';

    const formData = new FormData(form);
    const paymentData = Object.fromEntries(formData.entries());

    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

    if (!window.tempRegData || !paymentData.transactionId) {
        showMessage('Registration data missing or Transaction ID is required.', 'error');
        button.disabled = false;
        button.innerHTML = 'Complete Registration';
        return;
    }

    const newUser = {
        ...window.tempRegData,
        transactionId: paymentData.transactionId,
        registrationDate: new Date().toISOString(),
        // Mock marks/score generation
        mockScore: Math.floor(Math.random() * 100),
        mockRank: Math.floor(Math.random() * 500) + 1
    };

    const users = getUsers();
    users.push(newUser);
    saveUsers(users);

    window.tempRegData = {};
    
    showMessage('Registration Complete! Account is active.', 'success');
    renderAuthView(true); // Redirect to Login
};


const handleStudentLogin = async (form) => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const result = await apiRequest('login', data);

    if (user) {
        showMessage(`Welcome back, ${user.name}!`, 'success');
        
        // Display user dashboard
        CONTENT_AREA.innerHTML = `
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
                
                <button onclick="renderAuthView(true); scrollToApplication();" 
                    class="mt-8 w-full bg-error-red text-white p-3 rounded-lg font-semibold hover:bg-opacity-90 transition duration-200 shadow-md">
                    Sign Out
                </button>
            </div>
        `;
        scrollToApplication();
    } else {
        showMessage('Login failed. Check your ID/Email and password.', 'error');
        renderAuthView(true); // Re-render login form on failure
        scrollToApplication();
    }
};


const handleAdminLogin = async (form) => {
    const button = document.getElementById('admin-login-btn');
    button.disabled = true;
    button.innerHTML = '<span class="spinner mr-3"></span> Authenticating...';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const result = await apiRequest('admin_login', data);

    if (result.success) {
        toggleAdminModal(false);
        showMessage('Admin Console Access Granted!', 'success');
        loadAdminDashboard();
    } else {
        showMessage(result.message || 'Admin login failed', 'error');
        button.disabled = false;
        button.innerHTML = 'Log In Securely';
    }
};

// --- Admin Dashboard View ---
const renderAdminDashboard = () => {
    const users = getUsers();
    const userCount = users.length;
    
    CONTENT_AREA.innerHTML = `
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
                    <p class="text-4xl font-extrabold mt-2">₹${(userCount * REGISTRATION_FEE).toLocaleString()}</p>
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
                                <td class="px-3 py-3 whitespace-nowrap text-xs text-text-faded">${user.transactionId.substring(0, 10)}...</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>`
        }
        
        <button onclick="renderAuthView(true); scrollToApplication();" class="mt-8 w-full bg-error-red text-white p-3 rounded-lg font-semibold hover:bg-opacity-90 transition">Log Out Admin</button>
    `;
    scrollToApplication();
};

const renderFeedback = () => {
     CONTENT_AREA.innerHTML = `
        <div class="max-w-2xl mx-auto w-full">
            <a id="application-form" class="relative -top-16 block"></a>
            
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-primary-dark">Share Your Feedback</h2>
                <p class="text-md text-text-faded mt-2">
                    Help us improve the HAZLE SCHOLARSHIPS experience
                </p>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-lg">
                <form onsubmit="event.preventDefault(); showMessage('Thank you for your valuable feedback!', 'success'); this.reset();"
                    class="space-y-6">
                    <div>
                        <label for="feedback-name" class="block text-sm font-medium text-text-dark mb-2">
                            Name / Student ID (Optional)
                        </label>
                        <input type="text" 
                            id="feedback-name" 
                            placeholder="Name or ID"
                            class="w-full p-3 border border-border-light rounded-lg text-text-dark transition
                                focus:border-button-teal focus:ring-2 focus:ring-button-teal focus:ring-opacity-20">
                    </div>
                    <div>
                        <label for="feedback-message" class="block text-sm font-medium text-text-dark mb-2">
                            Your Comments *
                        </label>
                        <textarea id="feedback-message" 
                            rows="5" 
                            required 
                            placeholder="Tell us about your experience..."
                            class="w-full p-3 border border-border-light rounded-lg text-text-dark transition
                                focus:border-button-teal focus:ring-2 focus:ring-button-teal focus:ring-opacity-20"></textarea>
                    </div>
                    <button type="submit"
                        class="w-full bg-primary-dark text-white p-3 rounded-lg font-semibold 
                            hover:bg-opacity-90 transition duration-200 shadow-md">
                        Submit Feedback
                    </button>
                </form>
            </div>
        </div>
    `;
    scrollToApplication();
};

// Initializer
document.addEventListener('DOMContentLoaded', () => {
    renderAuthView(false); // Start on the Registration tab
    console.log('HAZLE SCHOLARSHIPS Classic Portal initialized. Users stored in:', USER_KEY);
});