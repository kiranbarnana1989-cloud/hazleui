<!-- Main Content Area: Centered and Structured -->
<main class="flex-grow flex flex-col items-center">
    <!-- Hero Banner Section - Deep Navy Background for authority -->
    <section id="hero-banner" class="w-full py-16 text-center shadow-inner">
        <h1 class="text-4xl md:text-5xl font-extrabold mb-3">The Future of Academic Funding</h1>
        <p class="text-lg text-white/90 max-w-4xl mx-auto">
            Dedicated to supporting the next generation of scholars through merit-based and need-based financial aid programs.
        </p>
        <div class="mt-6 space-x-4">
            <span class="inline-block px-4 py-1.5 bg-secondary-accent text-primary-dark rounded-full font-bold text-sm shadow-md">
                ₹500 Registration Fee
            </span>
            <span class="inline-block px-4 py-1.5 border border-white/50 text-white rounded-full font-semibold text-sm">
                Open for 2025 Cycle
            </span>
        </div>
    </section>

    <!-- Main Content Grid -->
    <div class="w-full max-w-6xl p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-8 relative z-10">
        <!-- Left Panel: Static Information and Links -->
        <div class="lg:col-span-1 space-y-6">
            <?php include 'components/sidebar.php'; ?>
        </div>

        <!-- Right Panel: Dynamic Application Forms -->
        <div class="lg:col-span-2">
            <div id="app-container" class="form-container p-8 md:p-10 rounded-xl border border-border-light min-h-[600px]">
                <!-- Content will be injected here by JavaScript -->
            </div>
        </div>
    </div>
</main>