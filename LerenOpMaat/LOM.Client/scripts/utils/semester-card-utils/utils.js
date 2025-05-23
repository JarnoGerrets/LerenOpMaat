export function calculateAchievedECs(progress, selectedModule) {
  if (!progress?.CompletedEvls || !selectedModule?.Evls) return 0;

  return progress.CompletedEvls.reduce((sum, completed) => {
    const evl = selectedModule.Evls.find(ev => ev.Id === completed.ModuleEvl.Id);
    return sum + (evl?.Ec || 10);
  }, 0);
}

export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}