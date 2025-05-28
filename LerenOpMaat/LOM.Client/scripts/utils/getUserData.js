import { getUserData } from '../../client/api-client.js'; // pas dit pad aan

export let userData;

const storedUserData = localStorage.getItem('userData');

if (storedUserData) {
    userData = Promise.resolve(JSON.parse(storedUserData));
} else {
    userData = getUserData().then(data => {
        if (data) {
            localStorage.setItem('userData', JSON.stringify(data));
        }
        return data;
    });
}

window.userData = userData;