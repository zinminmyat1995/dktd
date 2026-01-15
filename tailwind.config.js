import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */


export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', 'Battambang', 'sans-serif'],
                display: ['Fredoka One', 'Content', 'cursive'],
            },
            fontWeight: {
                'body': '500', // This adds font-medium as the default for body text
            },
        },
    },

    plugins: [forms],
};
