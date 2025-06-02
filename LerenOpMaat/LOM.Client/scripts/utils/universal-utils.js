export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

export default async function loadTemplate(link) {
    const response = await fetch(link);
    const template = await response.text();
    return template;
}