// =========================================================
// script.js
// Interaksi seluruh halaman portfolio
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    initMobileNav();

    markActiveLink();

    initScrollReveal();

    initContactForm();

    initProfileSocial();

});



// =========================================================
// TOGGLE NAVIGATION MOBILE
// =========================================================

function initMobileNav() {

    const toggle = document.querySelector(".navtoggle");
    const nav = document.querySelector(".tabnav");

    if (!toggle || !nav) return;


    toggle.addEventListener("click", () => {

        const isOpen =
            nav.classList.toggle("is-open");


        toggle.classList.toggle(
            "is-open",
            isOpen
        );


        toggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });


    nav
        .querySelectorAll(".tabnav__link")
        .forEach((link) => {

            link.addEventListener("click", () => {

                nav.classList.remove("is-open");

                toggle.classList.remove("is-open");

                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

}



// =========================================================
// ACTIVE NAVIGATION
// =========================================================

function markActiveLink() {

    const current =
        location.pathname.split("/").pop() ||
        "index.html";


    document
        .querySelectorAll(".tabnav__link")
        .forEach((link) => {

            const href =
                link.getAttribute("href");


            if (href === current) {

                link.classList.add("is-active");

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            }

        });

}



// =========================================================
// SCROLL REVEAL
// =========================================================

function initScrollReveal() {

    const items =
        document.querySelectorAll("[data-reveal]");


    if (!items.length) return;


    // Browser lama yang tidak mendukung
    // IntersectionObserver

    if (!("IntersectionObserver" in window)) {

        items.forEach((el) => {

            el.classList.add("is-visible");

        });

        return;

    }


    const observer =
        new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "is-visible"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.12
            }

        );


    items.forEach((el) => {

        observer.observe(el);

    });

}


// =========================================================
// FORM KONTAK — FORMSPREE
// =========================================================

function initContactForm() {

    const form = document.querySelector("#contact-form");

    if (!form) return;

    const msg = form.querySelector(".form-msg");
    const button = form.querySelector("#contact-submit");


    form.addEventListener("submit", async(e) => {

        e.preventDefault();


        // =====================================================
        // AMBIL DATA FORM
        // =====================================================

        const name =
            form.querySelector("#name").value.trim();

        const email =
            form.querySelector("#email").value.trim();

        const message =
            form.querySelector("#message").value.trim();


        // =====================================================
        // VALIDASI
        // =====================================================

        if (!name || !email || !message) {

            showMessage(
                msg,
                "Mohon lengkapi semua kolom sebelum mengirim.",
                false
            );

            return;
        }


        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

            showMessage(
                msg,
                "Format email belum valid.",
                false
            );

            return;
        }


        // =====================================================
        // BUTTON LOADING
        // =====================================================

        const originalText = button.textContent;

        button.disabled = true;
        button.textContent = "Mengirim...";


        // =====================================================
        // KIRIM KE FORMSPREE
        // =====================================================

        try {

            const response = await fetch(
                form.action, {
                    method: "POST",

                    body: new FormData(form),

                    headers: {
                        "Accept": "application/json"
                    }
                }
            );


            // =================================================
            // BERHASIL
            // =================================================

            if (response.ok) {

                showMessage(
                    msg,
                    "Terima kasih, " + name + ". Pesan kamu berhasil dikirim.",
                    true
                );

                form.reset();

            }


            // =================================================
            // GAGAL
            // =================================================
            else {

                let data = {};

                try {

                    data = await response.json();

                } catch (error) {

                    console.error(
                        "Response bukan JSON:",
                        error
                    );

                }


                let errorMessage =
                    "Pesan gagal dikirim. Silakan coba lagi.";


                if (
                    data &&
                    data.errors &&
                    data.errors.length > 0 &&
                    data.errors[0].message
                ) {

                    errorMessage =
                        data.errors[0].message;

                }


                showMessage(
                    msg,
                    errorMessage,
                    false
                );

            }


        } catch (error) {

            console.error(
                "Formspree error:",
                error
            );


            showMessage(
                msg,
                "Terjadi kesalahan koneksi. Silakan coba lagi.",
                false
            );

        }


        // =====================================================
        // KEMBALIKAN BUTTON
        // =====================================================

        button.disabled = false;

        button.textContent = originalText;

    });

}

// =========================================================
// PESAN FORM
// =========================================================

function showMessage(el, text, success) {

    if (!el) return;

    el.textContent = text;

    el.style.color =
        success ?
        "var(--jade)" :
        "#b3492f";

    el.classList.add("is-visible");

}



// =========================================================
// PROFILE SOCIAL MEDIA
//
// Klik foto:
// Foto menjadi blur/gelap
// Social media muncul
//
// Klik foto lagi:
// Social media hilang
// Foto kembali normal
// =========================================================

function initProfileSocial() {

    const profilePhoto =
        document.querySelector(
            "#profile-photo"
        );


    // Kalau halaman tidak mempunyai
    // profile photo, hentikan fungsi.

    if (!profilePhoto) return;



    // =======================================================
    // TOGGLE SOCIAL
    // =======================================================

    function toggleSocial() {

        const isOpen =
            profilePhoto.classList.toggle(
                "is-social-open"
            );


        profilePhoto.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    }



    // =======================================================
    // KLIK FOTO
    // =======================================================

    profilePhoto.addEventListener(
        "click",
        (event) => {

            /*
             * Kalau yang diklik adalah icon social media,
             * jangan toggle foto.
             */

            if (
                event.target.closest(
                    ".social-icon"
                )
            ) {

                return;

            }


            toggleSocial();

        }
    );



    // =======================================================
    // KEYBOARD ACCESSIBILITY
    // ENTER / SPACE
    // =======================================================

    profilePhoto.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                toggleSocial();

            }

        }
    );



    // =======================================================
    // ESC UNTUK MENUTUP
    // =======================================================

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                profilePhoto.classList.contains(
                    "is-social-open"
                )
            ) {

                profilePhoto.classList.remove(
                    "is-social-open"
                );


                profilePhoto.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}