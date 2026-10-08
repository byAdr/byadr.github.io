const header = document.querySelector("[data-header]");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const typedText = document.getElementById("typed-text");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function setActiveLink() {
    const currentSection = [...document.querySelectorAll("main section")]
        .filter((section) => section.getBoundingClientRect().top <= 120)
        .at(-1);

    if (!currentSection) {
        return;
    }

    navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.hash === `#${currentSection.id}`);
    });
}

function startTypingEffect() {
    if (!typedText || prefersReducedMotion) {
        return;
    }

    const message = "André PEREIRA";
    let index = 0;

    typedText.textContent = "";

    function type() {
        if (index >= message.length) {
            return;
        }

        index += 1;
        typedText.textContent = message.slice(0, index);
        window.setTimeout(type, 80);
    }

    window.setTimeout(type, 350);
}

window.addEventListener("scroll", () => {
    updateHeader();
    setActiveLink();
}, { passive: true });

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.forEach((item) => item.classList.remove("is-active"));
        link.classList.add("is-active");
    });
});

updateHeader();
setActiveLink();
startTypingEffect();
