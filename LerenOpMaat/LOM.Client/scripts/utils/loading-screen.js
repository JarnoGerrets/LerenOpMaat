export function showLoading() {
  document.getElementById("loading-overlay")?.classList.add("active");
}

export function hideLoading() {
  document.getElementById("loading-overlay")?.classList.remove("active");
}