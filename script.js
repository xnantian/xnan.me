document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

const revealItems = [...document.querySelectorAll(".reveal")];

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.12 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const signalStage = document.querySelector("[data-signal-stage]");

if (signalStage && finePointer.matches && !reducedMotion.matches) {
  let frame = 0;

  signalStage.addEventListener("pointermove", (event) => {
    if (frame) cancelAnimationFrame(frame);

    frame = requestAnimationFrame(() => {
      const rect = signalStage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      signalStage.style.setProperty("--tilt-x", `${y * -5}deg`);
      signalStage.style.setProperty("--tilt-y", `${x * 5}deg`);
    });
  });

  signalStage.addEventListener("pointerleave", () => {
    if (frame) cancelAnimationFrame(frame);
    signalStage.style.setProperty("--tilt-x", "0deg");
    signalStage.style.setProperty("--tilt-y", "0deg");
  });
}

if (finePointer.matches) {
  document.querySelectorAll("[data-pointer-card]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    });
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
