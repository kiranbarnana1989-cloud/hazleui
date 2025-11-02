<!-- Admin Login Modal -->
<div id="admin-modal" class="fixed inset-0 bg-primary-dark bg-opacity-80 hidden items-center justify-center z-50 transition-opacity duration-300">
    <div class="bg-primary-white p-8 rounded-2xl shadow-deep w-11/12 max-w-md">
        <div class="flex justify-between items-center border-b border-border-light pb-4 mb-6">
            <h3 class="text-2xl font-bold text-primary-dark">Administrative Console</h3>
            <button onclick="app.toggleAdminModal(false)" class="text-gray-500 text-3xl hover:text-primary-dark leading-none">&times;</button>
        </div>
        <form onsubmit="event.preventDefault(); app.handleAdminLogin(this);">
            <div class="mb-5">
                <label for="admin-username" class="block text-sm font-medium text-text-faded mb-2">Admin Email</label>
                <input type="text" id="admin-username" name="username" required placeholder="Enter admin email"
                    class="w-full p-3 border border-border-light rounded-lg text-text-dark transition">
            </div>
            <div class="mb-8">
                <label for="admin-password" class="block text-sm font-medium text-text-faded mb-2">Password</label>
                <input type="password" id="admin-password" name="password" required placeholder="Enter password"
                    class="w-full p-3 border border-border-light rounded-lg text-text-dark transition">
            </div>
            <button type="submit" id="admin-login-btn"
                class="w-full bg-button-teal text-white p-3 rounded-lg font-semibold hover:bg-opacity-90 transition duration-200 shadow-md flex items-center justify-center">
                Log In Securely
            </button>
        </form>
    </div>
</div>