const glideBar = document.querySelector("#nbtw-10-bar");
const glidePill = document.querySelector("#nbtw-10-pill");
const navLinks = glideBar ? [...glideBar.querySelectorAll(".nbtw-10__link")] : [];
const typedText = document.getElementById("typed-text");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

function updateActiveAttributes(activeLink) {
    navLinks.forEach((link) => {
        if (link === activeLink) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

function getCurrentLink() {
    const sections = [...document.querySelectorAll("main section")];

    const currentSection = sections
        .filter((section) => section.getBoundingClientRect().top <= 140)
        .at(-1);

    if (!currentSection) {
        return navLinks[0];
    }

    return navLinks.find(
        (link) => link.hash === `#${currentSection.id}`
    ) || navLinks[0];
}

function setupSpringGlideMenu() {
    if (!glideBar || !glidePill || navLinks.length === 0) {
        return;
    }

    let activeLink = getCurrentLink();

    updateActiveAttributes(activeLink);

    navLinks.forEach((link) => {
        link.addEventListener("pointerenter", () => {
            movePillTo(link);
        });

        link.addEventListener("focus", () => {
            movePillTo(link);
        });

        link.addEventListener("click", () => {
            activeLink = link;
            navigationTarget = document.querySelector(link.hash);

            updateActiveAttributes(activeLink);
            movePillTo(activeLink);
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

        activeLink = getCurrentLink();
        updateActiveAttributes(activeLink);
        movePillTo(activeLink);
    }, { passive: true });

    window.addEventListener("resize", () => {
        movePillTo(activeLink);
    });

    requestAnimationFrame(() => {
        movePillTo(activeLink);
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

setupSpringGlideMenu();
startTypingEffect();