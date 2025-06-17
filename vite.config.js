import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    // ADICIONE ESTA SEÇÃO
    server: {
        host: '0.0.0.0', // Esta linha é a que resolve o problema
        hmr: {
            host: 'localhost',
        },
    },
});