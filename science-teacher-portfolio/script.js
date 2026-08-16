// ==========================================================================
// EGYPTIAN SCIENCE TEACHER PORTFOLIO - SCRIPT.JS (LIQUID GLASS EDITION)
// Mr. Atef — Faculty of Computers & Information — Grade 3 Preparatory Science
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // ==================== NAVIGATION ====================
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleNavbarScroll() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlight
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 220;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleNavbarScroll);


    // ==================== MOBILE MENU ====================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileToggle && navLinksContainer) {
        mobileToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }


    // ==================== SCROLL ANIMATIONS ====================
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

    // Progress Bar Animation
    const followupSection = document.querySelector('#followup');
    if (followupSection) {
        const progressObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressFills = entry.target.querySelectorAll('.progress-bar-fill');
                    progressFills.forEach(fill => {
                        const targetWidth = fill.getAttribute('data-progress');
                        fill.style.width = targetWidth + '%';
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        progressObserver.observe(followupSection);
    }


    // ==================== LIQUID GLASS MOUSE PARALLAX ====================
    const teacherImg = document.querySelector('.hero-teacher-img');
    const heroBgBgCard = document.querySelector('.hero-image-bg-card');
    const liquidBlobs = document.querySelectorAll('.liquid-blob');
    let ticking = false;

    if (window.innerWidth > 1024) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
            window.addEventListener('mousemove', (e) => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        const { clientX, clientY } = e;
                        const { innerWidth, innerHeight } = window;

                        const moveX = (clientX - innerWidth / 2) / 35;
                        const moveY = (clientY - innerHeight / 2) / 35;

                        if (teacherImg) {
                            teacherImg.style.transform = `scale(1.04) translate(${moveX * -0.8}px, ${moveY * -0.8}px)`;
                        }

                        if (heroBgBgCard) {
                            heroBgBgCard.style.transform = `rotate(-3deg) translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
                        }

                        // Soft parallax on liquid background blobs
                        liquidBlobs.forEach((blob, idx) => {
                            const factor = (idx + 1) * 0.4;
                            blob.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
                        });

                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }
    }


    // ==================== COUNTERS ====================
    const achievementsSection = document.querySelector('#achievements');
    if (achievementsSection) {
        let counted = false;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    counted = true;
                    const counters = entry.target.querySelectorAll('.counter-num');

                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const duration = 2000;
                        const stepTime = 30;
                        const totalSteps = duration / stepTime;
                        const increment = target / totalSteps;
                        let current = 0;

                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                counter.innerText = target + counter.getAttribute('data-suffix');
                                clearInterval(timer);
                            } else {
                                counter.innerText = Math.ceil(current) + counter.getAttribute('data-suffix');
                            }
                        }, stepTime);
                    });
                }
            });
        }, { threshold: 0.3 });

        counterObserver.observe(achievementsSection);
    }


    // ==================== CURRICULUM ACCORDION ====================
    const curriculumHeaders = document.querySelectorAll('.curriculum-header');

    curriculumHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.curriculum-content');

            const isOpen = item.classList.contains('active');

            // Close all items
            document.querySelectorAll('.curriculum-item').forEach(i => {
                i.classList.remove('active');
                const c = i.querySelector('.curriculum-content');
                if (c) c.style.maxHeight = null;
            });

            // Toggle clicked item
            if (!isOpen) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // Open first curriculum item by default
    const firstCurriculumItem = document.querySelector('.curriculum-item');
    if (firstCurriculumItem) {
        firstCurriculumItem.classList.add('active');
        const content = firstCurriculumItem.querySelector('.curriculum-content');
        if (content) {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    }


    // ==================== TESTIMONIAL SLIDER ====================
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        showSlide(0);

        if (nextBtn) nextBtn.addEventListener('click', () => { showSlide(currentSlide + 1); resetAutoSlide(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { showSlide(currentSlide - 1); resetAutoSlide(); });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetAutoSlide();
            });
        });

        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 6000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        startAutoSlide();
    }


    // ==================== GALLERY LIGHTBOX ====================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.querySelector('.lightbox-modal');
    const lightboxImg = document.querySelector('.lightbox-content');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (galleryItems.length > 0 && lightboxModal) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('.gallery-img').getAttribute('src');
                lightboxImg.setAttribute('src', imgSrc);
                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeLightbox() {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || e.target.classList.contains('lightbox-close')) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                closeLightbox();
            }
        });
    }


    // ==================== CONTACT FORM (FAIL-PROOF TELEGRAM BOT + WHATSAPP FALLBACK) ====================
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        const TELEGRAM_BOT_TOKEN = '8934848544:AAFtQ0l0aBlkjHN0qY2ISZeuy0QrHOWqhFM';
        const TELEGRAM_CHAT_ID = '7226362241';
        const TEACHER_WHATSAPP = '201012345678'; // Mr. Atef's WhatsApp number

        const formStatus = document.getElementById('formStatus');

        function escapeHTML(str) {
            if (!str) return '';
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }

        function showFormStatus(msg, type = 'success') {
            if (!formStatus) return;
            formStatus.style.display = 'block';
            if (type === 'success') {
                formStatus.style.background = 'rgba(34, 197, 94, 0.15)';
                formStatus.style.border = '1px solid rgba(34, 197, 94, 0.4)';
                formStatus.style.color = '#4ade80';
            } else if (type === 'warning') {
                formStatus.style.background = 'rgba(234, 179, 8, 0.15)';
                formStatus.style.border = '1px solid rgba(234, 179, 8, 0.4)';
                formStatus.style.color = '#facc15';
            } else {
                formStatus.style.background = 'rgba(239, 68, 68, 0.15)';
                formStatus.style.border = '1px solid rgba(239, 68, 68, 0.4)';
                formStatus.style.color = '#f87171';
            }
            formStatus.innerHTML = msg;
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const studentName = document.getElementById('studentName')?.value.trim();
            const parentName = document.getElementById('parentName')?.value.trim();
            const phone = document.getElementById('phone')?.value.trim();
            const grade = document.getElementById('grade')?.value.trim();
            const message = document.getElementById('message')?.value.trim();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
                submitBtn.innerHTML = '<span>جاري الإرسال للتليجرام...</span><span class="spin-icon">⏳</span>';
            }

            if (formStatus) formStatus.style.display = 'none';

            // Escape HTML for Telegram HTML mode
            const safeStudent = escapeHTML(studentName);
            const safeParent = escapeHTML(parentName);
            const safePhone = escapeHTML(phone);
            const safeGrade = escapeHTML(grade);
            const safeMsg = escapeHTML(message);

            const nowTime = new Date().toLocaleString('ar-EG');

            // 1. Formatted HTML message
            const telegramHtmlText = 
                `📩 <b>طلب حجز جديد — الأستاذ عاطف</b>\n\n` +
                `👨‍🎓 <b>اسم الطالب:</b> ${safeStudent}\n` +
                `👤 <b>اسم ولي الأمر:</b> ${safeParent}\n` +
                `📱 <b>رقم الهاتف / الواتساب:</b> <code>${safePhone}</code>\n` +
                `📚 <b>الصف الدراسي:</b> ${safeGrade}\n\n` +
                `💬 <b>الرسالة / الاستفسار:</b>\n${safeMsg}\n\n` +
                `⏰ <b>توقيت الطلب:</b> ${nowTime}`;

            // 2. Fallback Plain Text message
            const plainText = 
                `📩 طلب حجز جديد — الأستاذ عاطف\n\n` +
                `👨‍🎓 اسم الطالب: ${studentName}\n` +
                `👤 اسم ولي الأمر: ${parentName}\n` +
                `📱 رقم الهاتف / الواتساب: ${phone}\n` +
                `📚 الصف الدراسي: ${grade}\n\n` +
                `💬 الرسالة / الاستفسار:\n${message}\n\n` +
                `⏰ توقيت الطلب: ${nowTime}`;

            try {
                // Try sending HTML formatted message first
                let response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: telegramHtmlText,
                        parse_mode: 'HTML'
                    })
                });

                let data = await response.json();

                // If HTML mode failed, try sending plain text
                if (!data.ok) {
                    console.warn('HTML mode failed, retrying plain text...', data.description);
                    response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: TELEGRAM_CHAT_ID,
                            text: plainText
                        })
                    });
                    data = await response.json();
                }

                if (data.ok) {
                    showFormStatus('✅ تم إرسال طلب الحجز بنجاح إلى تليجرام الأستاذ عاطف! سيتم التواصل معكم في أقرب وقت.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error(data.description || 'تعذر الإرسال عبر تليجرام');
                }

            } catch (err) {
                console.error('Telegram Send Error:', err);
                // WhatsApp fallback URL
                const waUrl = `https://wa.me/${TEACHER_WHATSAPP}?text=${encodeURIComponent(plainText)}`;
                showFormStatus(
                    `❌ تعذر الإرسال المباشر لتليجرام بسبب الشبكة.<br><br>` +
                    `<a href="${waUrl}" target="_blank" style="display:inline-block; padding: 0.6rem 1.2rem; background: #25D366; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 0.5rem;">📲 اضغط هنا لإرسال طلبك عبر الواتساب مباشرة</a>`,
                    'warning'
                );
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.innerHTML = originalBtnContent;
                }
            }
        });
    }

});

