export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

export async function loadTemplate(link) {
    const response = await fetch(link);
    const template = await response.text();
    return template;
}

export function mapPeriodToPresentableString(period) {
    if (period === 3 || period === '3'){
        return "Beide";
    }

    return period.toString();
}
