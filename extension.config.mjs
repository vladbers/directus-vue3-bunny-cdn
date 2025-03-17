import replace from '@rollup/plugin-replace'
import dotenv from 'dotenv';
dotenv.config();

export default {
    plugins: [
        replace({
            '__CDN_API_URL__': 'https://la.storage.bunnycdn.com/mckp-live-storage',
            '__CDN_API_KEY__': '840f968d-7235-4c28-8da439cda2f5-1a6f-4d68', 
            '__CDN_API_GET_URL__': 'https://mockup-live-cdn.b-cdn.net',
            preventAssignment: true
        })
    ],
};
