<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HAZLE SCHOLARSHIPS | Academic Portal</title>
    <!-- Load Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        // New Classic Light Theme Palette
                        'primary-white': '#FFFFFF',       /* Crisp White Background */
                        'primary-dark': '#053742',       /* Deep Navy Blue (Primary Academic Color) */
                        'secondary-accent': '#FFD700',   /* Gold/Yellow for Highlights (Simulated) */
                        'button-teal': '#17A2B8',        /* Stately Teal for interactive elements */
                        'text-dark': '#1F2937',          /* Dark Slate Text */
                        'text-faded': '#6B7280',         /* Medium Gray for subtle text */
                        'border-light': '#E5E7EB',       /* Very light border for separation */
                        'success-green': '#28A745',      /* Classic Success Green */
                        'error-red': '#DC3545',          /* Classic Error Red */
                    },
                    boxShadow: {
                        'classic': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        'deep': '0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    }
                }
            }
        }
    </script>
    <style>
        /* Base styling: Crisp white background, classic font */
        body {
            font-family: 'Inter', sans-serif;
            background-color: theme('colors.border-light'); /* Light off-white body background */
            min-height: 100vh;
            color: theme('colors.text-dark');
        }

        /* Hero Banner Style - Deep Blue background for authority */
        #hero-banner {
            background-color: theme('colors.primary-dark');
            color: theme('colors.primary-white');
        }

        /* Input focus style: Teal ring for professionalism */
        input:focus, textarea:focus, select:focus {
            border-color: theme('colors.button-teal') !important;
            box-shadow: 0 0 0 3px rgba(23, 162, 184, 0.25);
            outline: none;
        }

        /* Form Container Style: Pure white card with deep shadow */
        .form-container {
            background-color: theme('colors.primary-white');
            box-shadow: theme('boxShadow.deep');
        }

        /* Spinner for loading state */
        .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>