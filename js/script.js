const glideBar = document.querySelector("#nbtw-10-bar");
const glidePill = document.querySelector("#nbtw-10-pill");
const navLinks = glideBar ? [...glideBar.querySelectorAll(".nbtw-10__link")] : [];
const typedText = document.getElementById("typed-text");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let activeLink = navLinks[0] || null;
let navigationTarget = null;

function movePillTo(link) {
    if (!glideBar || !glidePill || !link) {
        return;
    }

    const barRect = glideBar.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    glidePill.style.left = `${linkRect.left - barRect.left}px`;
    glidePill.style.width = `${linkRect.width}px`;
}

function updateActiveLink(link) {
    if (!link) {
        return;
    }

    navLinks.forEach((item) => {
        if (item === link) {
            item.setAttribute("aria-current", "page");
        } else {
            item.removeAttribute("aria-current");
        }
    });

    activeLink = link;
    movePillTo(activeLink);
}

function getCurrentLink() {
    const sections = [...document.querySelectorAll("main section")];

    const currentSection = sections
        .filter((section) => section.getBoundingClientRect().top <= 140)
        .at(-1);

    if (!currentSection) {
        return navLinks[0] || null;
    }

    return navLinks.find((link) => {
        return link.hash === `#${currentSection.id}`;
    }) || navLinks[0] || null;
}

function setupSpringGlideMenu() {
    if (!glideBar || !glidePill || navLinks.length === 0) {
        return;
    }

    updateActiveLink(getCurrentLink());

    navLinks.forEach((link) => {
        link.addEventListener("pointerenter", () => {
            movePillTo(link);
        });

        link.addEventListener("focus", () => {
            movePillTo(link);
        });

        link.addEventListener("click", () => {
            navigationTarget = document.querySelector(link.hash);
            updateActiveLink(link);
        });
    });

    glideBar.addEventListener("pointerleave", () => {
        movePillTo(activeLink);
    });

    window.addEventListener("scroll", () => {
        if (navigationTarget) {
            const targetRect = navigationTarget.getBoundingClientRect();

            if (Math.abs(targetRect.top) <= 160) {
                navigationTarget = null;
            } else {
                movePillTo(activeLink);
                return;
            }
        }

        const currentLink = getCurrentLink();

        if (currentLink && currentLink !== activeLink) {
            updateActiveLink(currentLink);
        }
    }, { passive: true });

    window.addEventListener("resize", () => {
        movePillTo(activeLink);
    });

    requestAnimationFrame(() => {
        movePillTo(activeLink);
    });
}

function startTypingEffect() {
    if (!typedText) {
        return;
    }

    const message = "André PEREIRA";

    if (prefersReducedMotion) {
        typedText.textContent = message;
        return;
    }

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

setupSpringGlideMenu();
startTypingEffect();