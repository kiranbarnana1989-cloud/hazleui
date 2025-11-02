<!-- Header: Fixed, Classic White Bar -->
<header class="bg-primary-white sticky top-0 shadow-classic p-4 flex justify-center items-center z-20 border-b border-border-light">
    <div class="flex items-center space-x-3 w-full max-w-6xl">
        <!-- Logo: Deep Navy Blue 'H' -->
        <div class="bg-primary-dark text-white p-2 rounded-lg font-black text-xl shadow-md">H</div>
        <!-- Name: HAZLE SCHOLARSHIPS in bold Navy -->
        <span class="text-2xl font-extrabold tracking-tight text-primary-dark uppercase">HAZLE SCHOLARSHIPS</span>
        
        <!-- Hamburger Menu Button -->
        <button id="hamburger-btn" class="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </button>

        <!-- Mobile Menu Dropdown -->
        <div id="mobile-menu" class="hidden fixed right-4 top-16 bg-white rounded-lg shadow-deep border border-border-light w-48">
            <div class="py-2">
                <a href="#application-form" onclick="app.scrollToApplication(); toggleMobileMenu(false);" 
                   class="block px-4 py-2 text-sm text-primary-dark hover:bg-gray-100 transition-colors">
                    Apply Now
                </a>
                <a href="#feedback-section" onclick="app.renderFeedback(); toggleMobileMenu(false);"
                   class="block px-4 py-2 text-sm text-primary-dark hover:bg-gray-100 transition-colors">
                    Feedback
                </a>
                <button onclick="app.toggleAdminModal(true); toggleMobileMenu(false);"
                    class="w-full text-left px-4 py-2 text-sm text-primary-dark hover:bg-gray-100 transition-colors">
                    Admin Login
                </button>
            </div>
        </div>
    </div>
</header>

<!-- Mobile Menu Toggle Script -->
<script>
    document.getElementById('hamburger-btn').addEventListener('click', () => {
        toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('mobile-menu');
        const hamburgerBtn = document.getElementById('hamburger-btn');
        
        if (!menu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            toggleMobileMenu(false);
        }
    });

    function toggleMobileMenu(force) {
        const menu = document.getElementById('mobile-menu');
        if (typeof force === 'boolean') {
            menu.classList.toggle('hidden', !force);
        } else {
            menu.classList.toggle('hidden');
        }
    }
</script>