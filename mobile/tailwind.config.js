/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#014D9F",
                secondary: "#EA5D1A",
                success: "#10B981",
                error: "#EF4444",
                warning: "#F59E0B",
                background: {
                    light: "#F8FAFC",
                    dark: "#0F172A",
                },
                surface: {
                    light: "#FFFFFF",
                    dark: "#1E293B",
                }
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '16px',
                '3xl': '24px',
            }
        },
    },
    plugins: [],
}
