const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const navLinks = [...document.querySelectorAll(".top-nav a")];
const tiltCards = [...document.querySelectorAll(".tilt-card")];
const magneticItems = [...document.querySelectorAll(".magnetic")];

function initLenis() {
    if (prefersReducedMotion || typeof Lenis === "undefined") {
        return;
    }

    const lenis = new Lenis({
        anchors: {
            offset: -86,
        },
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        stopInertiaOnNavigate: true,
        respectReducedMotion: true,
    });

    if (window.ScrollTrigger) {
        lenis.on("scroll", ScrollTrigger.update);
    }

    if (window.gsap) {
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }
}

function initActiveNavigation() {
    const sections = navLinks
        .map((link) => document.querySelector(link.hash))
        .filter(Boolean);

    if (!("IntersectionObserver" in window) || sections.length === 0) {
        return;
    }

    function setCurrent(id) {
        navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.hash === `#${id}`);
        });
    }

    const observer = new IntersectionObserver((entries) => {
        const activeEntry = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (activeEntry) {
            setCurrent(activeEntry.target.id);
        }
    }, {
        rootMargin: "-28% 0px -52% 0px",
        threshold: [0.16, 0.32, 0.48],
    });

    sections.forEach((section) => observer.observe(section));
}

function initTiltCards() {
    if (prefersReducedMotion) {
        return;
    }

    tiltCards.forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateY = ((x / rect.width) - 0.5) * 4;
            const rotateX = ((y / rect.height) - 0.5) * -4;

            card.style.setProperty("--mx", `${x}px`);
            card.style.setProperty("--my", `${y}px`);
            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        });

        card.addEventListener("pointerleave", () => {
            card.style.transform = "";
        });
    });
}

function initMagneticItems() {
    if (prefersReducedMotion) {
        return;
    }

    magneticItems.forEach((item) => {
        item.addEventListener("pointermove", (event) => {
            const rect = item.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;

            item.style.transform = `translate(${x * 0.12}px, ${y * 0.16}px)`;
        });

        item.addEventListener("pointerleave", () => {
            item.style.transform = "";
        });
    });
}

function initGsap() {
    if (prefersReducedMotion || typeof gsap === "undefined") {
        return;
    }

    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    gsap.set(".js-title span, .js-reveal", {
        autoAlpha: 0,
        y: 28,
    });

    gsap.timeline({
        defaults: {
            duration: 0.9,
            ease: "power3.out",
        },
    })
        .to(".js-title span", {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,
            duration: 1.05,
        })
        .to(".js-reveal", {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,
        }, "-=0.7");

    if (!window.ScrollTrigger) {
        return;
    }

    gsap.utils.toArray(".js-section").forEach((element) => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 84%",
            },
            autoAlpha: 0,
            y: 34,
            duration: 0.78,
            ease: "power3.out",
        });
    });

    gsap.utils.toArray(".js-project").forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 82%",
            },
            autoAlpha: 0,
            y: 42,
            duration: 0.78,
            delay: index * 0.035,
            ease: "power3.out",
        });
    });

    gsap.to(".page-glow", {
        scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
        },
        yPercent: 26,
        xPercent: -18,
        ease: "none",
    });
}

window.addEventListener("load", () => {
    initLenis();
    initActiveNavigation();
    initTiltCards();
    initMagneticItems();
    initGsap();
});
