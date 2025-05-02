export function smoothScrollTo(targetY: number, duration = 800) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let startTime: number | null = null;

  function step(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const time = timestamp - startTime;
    const percent = Math.min(time / duration, 1);

    // Ease-in-out function
    const easing = 0.5 * (1 - Math.cos(Math.PI * percent));

    window.scrollTo(0, startY + diff * easing);

    if (time < duration) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
