// Import required modules
import { ApiClient } from './api-client.js';

// Initialize the API client
const apiClient = new ApiClient();

// DOM Elements
const app = document.getElementById('app');

// Initialize the application
async function init() {
    try {
        // Add your initialization code here
        console.log('Application initialized');
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    init();
});

// Export any necessary functions or objects
export {
    apiClient
}; 