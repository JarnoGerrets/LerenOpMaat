function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.classList.add('toast', type);

    const icon = selectIcon(type);
    toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;
    toast.style.display = 'block';
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function selectIcon(type) {
    let icon = '';

    switch (type) {
        case 'success':
            icon = '✔';
            break;
        case 'error':
            icon = '❌';
            break;
        case 'info':
            icon = 'ℹ️';
            break;
        default:
            icon = 'ℹ️';
            break;
    }

    return icon;
}
window.showToast = showToast;