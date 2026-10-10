<<<<<<< Updated upstream
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
=======
const dock = document.querySelector("#site-dock");
const dockPanel = dock ? dock.querySelector(".dock-panel") : null;
const navLinks = dock ? [...dock.querySelectorAll("[data-dock-link]")] : [];
const typedText = document.getElementById("typed-text");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const prefersReducedMotion = reducedMotionQuery.matches;

let activeLink = navLinks[0] || null;
let navigationTarget = null;

function updateActiveLink(link) {
    if (!link) {
        return;
    }

    navLinks.forEach((item) => {
        if (item === link) {
            item.setAttribute("aria-current", "page");
            item.classList.add("is-active");
        } else {
            item.removeAttribute("aria-current");
            item.classList.remove("is-active");
        }
    });

    activeLink = link;
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

function resizeDockItems(pointerX = Infinity) {
    if (!dockPanel || prefersReducedMotion) {
        return;
    }

    const baseItemSize = 50;
    const magnification = 70;
    const distance = 170;

    navLinks.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const offset = Math.abs(pointerX - center);
        const strength = Math.max(0, 1 - offset / distance);
        const eased = strength * strength * (3 - 2 * strength);
        const size = Math.round(baseItemSize + (magnification - baseItemSize) * eased);

        item.style.setProperty("--dock-size", `${size}px`);
    });
}

function resetDockItems() {
    navLinks.forEach((item) => {
        item.style.removeProperty("--dock-size");
    });
}

function setupDockNavigation() {
    if (!dockPanel || navLinks.length === 0) {
        return;
    }

    updateActiveLink(getCurrentLink());

    navLinks.forEach((link) => {
        link.addEventListener("focus", () => updateActiveLink(link));

        link.addEventListener("click", () => {
            navigationTarget = document.querySelector(link.hash);
            updateActiveLink(link);
        });
    });

    dockPanel.addEventListener("pointermove", (event) => resizeDockItems(event.clientX));
    dockPanel.addEventListener("pointerleave", resetDockItems);

    window.addEventListener("scroll", () => {
        if (navigationTarget) {
            const targetRect = navigationTarget.getBoundingClientRect();

            if (Math.abs(targetRect.top) <= 160) {
                navigationTarget = null;
            } else {
                return;
            }
        }

        const currentLink = getCurrentLink();

        if (currentLink && currentLink !== activeLink) {
            updateActiveLink(currentLink);
        }
    }, { passive: true });

    window.addEventListener("resize", resetDockItems);
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
const projects = [
    {
        id: "shinobi",
        title: "Shinobi Odyssey",
        image: "assets/images/shinobi.gif",
        href: "https://www.roblox.com/games/17374083159/Shinobi-Odyssey",
        description: "Mon projet le plus récent datant de 2025, j'ai participé à la modélisation 3D et à la programmation du jeu. Cependant faute par manque de temps de la part de l'équipe, le projet est en pause.",
        tags: [{ label: "Lua", className: "lua" }],
        actions: [{ label: "Page du jeu", href: "https://www.roblox.com/games/17374083159/Shinobi-Odyssey" }]
    },
    {
        id: "rivals",
        title: "Anime Rivals",
        image: "assets/images/rivals.gif",
        description: "Depuis juillet 2024, j'ai intégré l'équipe QA Testing d'Anime Rivals. Mon rôle est de tester les nouvelles fonctionnalités, identifier les points forts et signaler les axes d'amélioration avant publication. Ce projet est toujours en cours de développement, aucune date de sortie n'a été annoncée publiquement pour le moment.",
        tags: [{ label: "QA testing", className: "qa" }],
        actions: []
    },
    {
        id: "site43",
        title: "SCP: Site-43 | RP FR",
        image: "assets/images/site43.gif",
        href: "https://www.roblox.com/games/4733728555/SCP-Site-43-RP-FR",
        description: "De 2023 à 2024, j'ai approfondi mes connaissances en Lua en participant au développement du jeu Roblox SCP: Site-43. Ce projet semblant anodin au départ, a désormais atteint les 3 millions de connexions.",
        tags: [{ label: "Lua", className: "lua" }],
        actions: [
            { label: "Page du jeu", href: "https://www.roblox.com/games/4733728555/SCP-Site-43-RP-FR" },
            { label: "Studio", href: "https://www.roblox.com/communities/5654094/Studio-Baguette#!/about", secondary: true }
        ]
    },
    {
        id: "car-crushers",
        title: "Car Crushers 2",
        image: "assets/images/CC2.gif",
        href: "https://www.roblox.com/communities/2726951/Car-Crushers-Community#!/about",
        description: "Ma plus vieille contribution, datant de 2019, ce fut mon premier contact avec le monde du QA Testing. Je faisais partie de l'équipe de Beta Testing, les tests réalisés étaient surtout axés sur les performances du moteur physique. Aujourd'hui le jeu compte plus de 1,3 milliards de connexions et une communauté de plus de 8 millions de membres.",
        tags: [
            { label: "QA testing", className: "qa" },
            { label: "Lua", className: "lua" }
        ],
        actions: [{ label: "Site du studio", href: "https://www.roblox.com/communities/2726951/Car-Crushers-Community#!/about" }]
    }
];

function columnFactor(index, variance) {
    const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;

    return 1 + variance * pseudo;
}

function setupDriftWall() {
    const root = document.getElementById("projects-drift-wall");

    if (!root || projects.length === 0) {
        return;
    }

    const baseConfig = {
        columns: 5,
        tileWidth: 200,
        tileHeight: 132,
        gap: 18,
        radius: 14,
        tilt: 16,
        turn: -14,
        roll: 0,
        perspective: 1200,
        depth: 120,
        speed: 42,
        direction: "up",
        variance: 0.45,
        parallax: 0.6,
        lift: 64,
        fade: 0.6,
        dim: 0.55,
        grayscale: false,
        overlayColor: "#060010"
    };

    let config = baseConfig;
    let columnItems = [];
    let columnMeta = [];
    let trackElements = [];
    let offsets = [];
    let velocities = [];
    let hoveredColumn = -1;
    let wallHovered = false;
    let pointer = { x: 0, y: 0 };
    let dampedPointer = { x: 0, y: 0 };
    let activeTile = null;
    let plane = null;
    let rafId = null;
    let lastTimestamp = null;
    let resizeTimer = null;
    let lastRect = { width: 0, height: 0 };
    let reduced = reducedMotionQuery.matches;
    let detail = null;
    let detailOpen = false;
    let lastFocusedElement = null;

    function getResponsiveConfig() {
        const compact = root.getBoundingClientRect().width < 720;

        if (!compact) {
            return { ...baseConfig };
        }

        return {
            ...baseConfig,
            columns: 3,
            tileWidth: 156,
            tileHeight: 104,
            gap: 14,
            lift: 44,
            speed: 30,
            depth: 96
        };
    }

    function setCssVars() {
        root.classList.add("drift-wall");
        root.style.setProperty("--dw-tile-w", `${config.tileWidth}px`);
        root.style.setProperty("--dw-tile-h", `${config.tileHeight}px`);
        root.style.setProperty("--dw-gap", `${config.gap}px`);
        root.style.setProperty("--dw-radius", `${config.radius}px`);
        root.style.setProperty("--dw-perspective", `${config.perspective}px`);
        root.style.setProperty("--dw-lift", `${config.lift}px`);
        root.style.setProperty("--dw-dim", config.dim);
        root.style.setProperty("--dw-gray", config.grayscale ? 1 : 0);
        root.style.setProperty("--dw-overlay", config.overlayColor);
        root.style.setProperty("--dw-edge", `${Math.max(0, (1 - config.fade) * 100)}%`);
    }

    function distributeItems() {
        const wallItems = Array.from({ length: Math.max(config.columns * 3, projects.length) }, (_, index) => {
            return projects[index % projects.length];
        });
        const cols = Array.from({ length: config.columns }, () => []);

        wallItems.forEach((item, index) => {
            cols[index % config.columns].push(item);
        });

        return cols.map((col) => col.length ? col : projects.slice(0, 1));
    }

    function activateTile(tile) {
        if (!tile || tile === activeTile) {
            return;
        }

        if (activeTile) {
            activeTile.classList.remove("is-active");
        }

        activeTile = tile;
        activeTile.classList.add("is-active");
        hoveredColumn = Number(activeTile.dataset.col);
        updateProjectFeature(projects.find((project) => project.id === activeTile.dataset.project));
    }

    function releaseTile() {
        if (activeTile) {
            activeTile.classList.remove("is-active");
        }

        activeTile = null;
        hoveredColumn = -1;
    }

    function createTag(label, className) {
        const item = document.createElement("span");
        item.className = `tag ${className}`;
        item.textContent = label;

        return item;
    }

    function createActionLink(action) {
        const link = document.createElement("a");
        link.className = action.secondary ? "button button-secondary" : "button";
        link.href = action.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = action.label;

        return link;
    }

    function createProjectDetail() {
        const wrapper = document.createElement("div");
        wrapper.className = "project-detail";
        wrapper.setAttribute("role", "dialog");
        wrapper.setAttribute("aria-modal", "true");
        wrapper.setAttribute("aria-hidden", "true");
        wrapper.hidden = true;

        const image = document.createElement("img");
        image.className = "project-detail__image";
        image.alt = "";

        const scrim = document.createElement("span");
        scrim.className = "project-detail__scrim";
        scrim.setAttribute("aria-hidden", "true");

        const content = document.createElement("div");
        content.className = "project-detail__content";

        const eyebrow = document.createElement("p");
        eyebrow.className = "eyebrow";
        eyebrow.textContent = "Projet";

        const title = document.createElement("h3");

        const tags = document.createElement("div");
        tags.className = "tags";

        const description = document.createElement("p");

        const actions = document.createElement("div");
        actions.className = "project-actions";

        const close = document.createElement("button");
        close.className = "project-detail__close";
        close.type = "button";
        close.setAttribute("aria-label", "Fermer le détail du projet");
        close.innerHTML = '<svg viewBox="0 0 24 24" focusable="false"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg>';
        close.addEventListener("click", closeProjectDetail);

        content.append(eyebrow, title, tags, description, actions);
        wrapper.append(image, scrim, content, close);

        wrapper.addEventListener("click", (event) => {
            if (event.target === wrapper) {
                closeProjectDetail();
            }
        });

        return { wrapper, image, title, tags, description, actions, close };
    }

    function populateProjectDetail(project) {
        if (!detail) {
            return;
        }

        detail.image.src = project.image;
        detail.image.alt = project.title;
        detail.title.textContent = project.title;
        detail.description.textContent = project.description;
        detail.tags.replaceChildren(...project.tags.map((tag) => createTag(tag.label, tag.className)));
        detail.actions.replaceChildren(...project.actions.map(createActionLink));
    }

    function openProjectDetail(project, tile) {
        if (!project || !tile || !detail) {
            return;
        }

        const tileRect = tile.querySelector(".drift-wall__inner").getBoundingClientRect();
        const rootRect = root.getBoundingClientRect();

        lastFocusedElement = document.activeElement;
        detailOpen = true;
        populateProjectDetail(project);
        document.body.classList.add("is-project-detail-open");
        root.classList.add("is-detail-open");
        detail.wrapper.hidden = false;
        detail.wrapper.classList.remove("is-expanded");
        detail.wrapper.classList.add("is-open");
        detail.wrapper.setAttribute("aria-hidden", "false");
        detail.image.style.setProperty("--detail-left", `${tileRect.left - rootRect.left}px`);
        detail.image.style.setProperty("--detail-top", `${tileRect.top - rootRect.top}px`);
        detail.image.style.setProperty("--detail-width", `${tileRect.width}px`);
        detail.image.style.setProperty("--detail-height", `${tileRect.height}px`);
        releaseTile();

        window.requestAnimationFrame(() => {
            detail.wrapper.classList.add("is-expanded");
            detail.close.focus({ preventScroll: true });
        });
    }

    function closeProjectDetail() {
        if (!detail || !detailOpen) {
            return;
        }

        detailOpen = false;
        detail.wrapper.classList.remove("is-expanded");

        window.setTimeout(() => {
            if (detailOpen || !detail) {
                return;
            }

            detail.wrapper.classList.remove("is-open");
            detail.wrapper.setAttribute("aria-hidden", "true");
            detail.wrapper.hidden = true;
            root.classList.remove("is-detail-open");
            document.body.classList.remove("is-project-detail-open");

            if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
                lastFocusedElement.focus({ preventScroll: true });
            }
        }, reduced ? 0 : 520);
    }

    function renderTile(project, tileId, colIndex) {
        const tile = document.createElement("button");
        tile.className = "drift-wall__tile";
        tile.dataset.tileId = tileId;
        tile.dataset.project = project.id;
        tile.dataset.col = String(colIndex);
        tile.setAttribute("aria-label", project.title);
        tile.type = "button";

        const inner = document.createElement("span");
        inner.className = "drift-wall__inner";

        const image = document.createElement("img");
        image.src = project.image;
        image.alt = project.title;
        image.loading = "lazy";
        image.decoding = "async";
        image.draggable = false;

        const overlay = document.createElement("span");
        overlay.className = "drift-wall__overlay";
        overlay.setAttribute("aria-hidden", "true");

        const label = document.createElement("span");
        label.className = "drift-wall__label";
        label.textContent = project.title;

        inner.append(image, overlay, label);
        tile.append(inner);

        tile.addEventListener("pointerenter", () => {
            if (!detailOpen) {
                activateTile(tile);
            }
        });
        tile.addEventListener("focus", () => {
            if (!detailOpen) {
                activateTile(tile);
            }
        });
        tile.addEventListener("click", () => openProjectDetail(project, tile));

        return tile;
    }

    function applyPlaneTransform(px, py) {
        if (!plane) {
            return;
        }

        plane.style.transform = `translate(-50%, -50%) scale(1.18) rotateX(${config.tilt + py}deg) rotateY(${config.turn + px}deg) rotateZ(${config.roll}deg) translateZ(${-config.depth}px)`;
    }

    function animate(timestamp) {
        if (lastTimestamp === null) {
            lastTimestamp = timestamp;
        }

        const dt = Math.min(0.05, Math.max(0, timestamp - lastTimestamp) / 1000);
        lastTimestamp = timestamp;

        if (!reduced) {
            const maxTilt = config.parallax * 8;
            const targetX = pointer.x * maxTilt;
            const targetY = -pointer.y * maxTilt;
            const damp = 1 - Math.exp(-dt / 0.12);

            dampedPointer.x += (targetX - dampedPointer.x) * damp;
            dampedPointer.y += (targetY - dampedPointer.y) * damp;
            applyPlaneTransform(dampedPointer.x, dampedPointer.y);

            for (let col = 0; col < trackElements.length; col += 1) {
                const meta = columnMeta[col];
                const track = trackElements[col];

                if (!meta || !track) {
                    continue;
                }

                const directionSign = config.direction === "up" ? 1 : -1;
                const alternateSign = col % 2 === 0 ? 1 : -1;
                const paused = hoveredColumn === col;
                const target = paused ? 0 : config.speed * columnFactor(col, config.variance) * directionSign * alternateSign;
                const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));

                velocities[col] += (target - velocities[col]) * ease;

                let next = offsets[col] + velocities[col] * dt;
                next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
                offsets[col] = next;
                track.style.transform = `translate3d(0, ${-next}px, 0)`;
            }
        }

        rafId = window.requestAnimationFrame(animate);
    }

    function renderWall() {
        if (rafId) {
            window.cancelAnimationFrame(rafId);
        }

        config = getResponsiveConfig();
        setCssVars();
        detailOpen = false;
        detail = null;
        document.body.classList.remove("is-project-detail-open");
        root.replaceChildren();
        root.setAttribute("role", "group");
        root.setAttribute("aria-label", "Mur animé des projets");

        const rootRect = root.getBoundingClientRect();
        const containerHeight = rootRect.height || 600;
        const unit = config.tileHeight + config.gap;
        lastRect = { width: rootRect.width, height: containerHeight };

        columnItems = distributeItems();
        columnMeta = columnItems.map((col) => {
            const copyHeight = Math.max(unit, col.length * unit);
            const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);

            return { copyHeight, copies };
        });
        trackElements = [];
        offsets = columnMeta.map((meta, col) => meta.copyHeight * ((col * 0.37) % 1));
        velocities = columnItems.map(() => 0);
        pointer = { x: 0, y: 0 };
        dampedPointer = { x: 0, y: 0 };
        activeTile = null;
        hoveredColumn = -1;
        lastTimestamp = null;

        plane = document.createElement("div");
        plane.className = "drift-wall__plane";
        applyPlaneTransform(0, 0);

        columnItems.forEach((col, colIndex) => {
            const column = document.createElement("div");
            column.className = "drift-wall__col";

            const track = document.createElement("div");
            track.className = "drift-wall__track";
            trackElements[colIndex] = track;

            for (let copyIndex = 0; copyIndex < columnMeta[colIndex].copies; copyIndex += 1) {
                col.forEach((project, itemIndex) => {
                    track.append(renderTile(project, `${colIndex}-${copyIndex}-${itemIndex}`, colIndex));
                });
            }

            column.append(track);
            plane.append(column);
        });

        detail = createProjectDetail();
        root.append(plane, detail.wrapper);

        if (reduced) {
            applyPlaneTransform(0, 0);

            trackElements.forEach((track, col) => {
                if (track) {
                    track.style.transform = `translate3d(0, ${-(offsets[col] || 0)}px, 0)`;
                }
            });

            return;
        }

        rafId = window.requestAnimationFrame(animate);
    }

    root.addEventListener("pointerenter", () => {
        wallHovered = true;
    });

    root.addEventListener("pointermove", (event) => {
        if (detailOpen) {
            return;
        }

        const rect = root.getBoundingClientRect();

        if (rect.width > 0 && rect.height > 0 && !reduced) {
            pointer = {
                x: (event.clientX - rect.left) / rect.width - 0.5,
                y: (event.clientY - rect.top) / rect.height - 0.5
            };
        }

        const hit = document.elementFromPoint(event.clientX, event.clientY);
        const tile = hit && hit.closest ? hit.closest("[data-tile-id]") : null;

        if (tile && root.contains(tile)) {
            activateTile(tile);
        }
    });

    root.addEventListener("pointerleave", () => {
        wallHovered = false;
        pointer = { x: 0, y: 0 };
        releaseTile();
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeProjectDetail();
        }
    });

    function queueRender() {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(renderWall, 120);
    }

    if ("ResizeObserver" in window) {
        const observer = new ResizeObserver(([entry]) => {
            if (wallHovered) {
                return;
            }

            const rect = entry.contentRect;
            const sizeChanged = Math.abs(rect.width - lastRect.width) > 2 || Math.abs(rect.height - lastRect.height) > 2;

            if (!sizeChanged) {
                return;
            }

            queueRender();
        });

        observer.observe(root);
    }

    reducedMotionQuery.addEventListener("change", (event) => {
        reduced = event.matches;
        queueRender();
    });

    window.addEventListener("resize", queueRender);

    renderWall();
}

setupDockNavigation();
startTypingEffect();
setupDriftWall();
>>>>>>> Stashed changes
