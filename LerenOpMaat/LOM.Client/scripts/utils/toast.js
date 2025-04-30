function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
  
    const toast = document.createElement('div');
    toast.classList.add('toast', type);
  
    toast.innerText = message;
    toast.style.display = 'block';
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }
  window.showToast = showToast;