window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (window.scrollY > 50) { 
        header.classList.add("header-scrolled");
    } else {
        header.classList.remove("header-scrolled");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const text = "Bonjour, moi c'est André 👋";
    const typedText = document.getElementById("typed-text");
    const cursor = document.querySelector(".cursor");
    let index = 0;
    let isDeleting = false;

    function typeWriterEffect() {
        if (!isDeleting && index < text.length) {
            typedText.textContent += text[index];
            index++;
            setTimeout(typeWriterEffect, 100);
        } else if (isDeleting && index > 0) {
            typedText.textContent = text.substring(0, index - 1);
            index--;
            setTimeout(typeWriterEffect, 50); 
        } else {
            isDeleting = !isDeleting;
            setTimeout(typeWriterEffect, 5000);
        }
    }

    setTimeout(typeWriterEffect, 1000);
});

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});


document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("nav ul li a").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                let offset = 0;

                if (targetId === "introduction") {
                    offset = 200;
                }

                if (targetId === "competences") {
                    offset = 200;
                }


                if (targetId === "mesprojets") {
                    offset = 200;
                }

                if (targetId === "certifications") {
                    offset = 95;
                }

                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});

