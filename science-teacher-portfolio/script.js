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


    // ==================== 2-WAY LIVE CHATBOT (WEBSITE <-> TELEGRAM) ====================
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSuggestions = document.getElementById('chatbot-suggestions');
    const chatbotBadge = document.querySelector('.chatbot-btn-badge');

    const CHATBOT_BOT_TOKEN = '8934848544:AAFtQ0l0aBlkjHN0qY2ISZeuy0QrHOWqhFM';
    const CHATBOT_CHAT_ID = '7226362241';

    // Unique Visitor Session ID (persisted per student browser)
    let visitorId = localStorage.getItem('atef_visitor_id');
    if (!visitorId) {
        visitorId = 'V-' + Math.floor(1000 + Math.random() * 9000);
        localStorage.setItem('atef_visitor_id', visitorId);
    }

    let lastUpdateId = parseInt(localStorage.getItem('atef_last_update_id') || '0', 10);

    const CHATBOT_FAQS = {
        "طريقة الحجز والأماكن": "📍 <b>أماكن الشرح وطريقة الحجز:</b><br>• سناتر ومقرات الشرح المتاحة.<br>• إمكانية المتابعة أونلاين عبر المنصة.<br>للحجز المباشر يمكنك ملء استمارة التواصل بالأسفل أو إرسال طلبك هنا فوراً 🚀",
        "تفاصيل المنهج": "📚 <b>منهج علوم الصف الثالث الإعدادي:</b><br>1️⃣ القوى والحركة (الفيزياء)<br>2️⃣ الطاقة الضوئية (المرايا والعدسات)<br>3️⃣ الكون والنظام الشمسي<br>4️⃣ التكاثر واستمرار النوع (الأحياء)",
        "نظام المتابعة": "📊 <b>نظام المتابعة الرقمي للأستاذ عاطف:</b><br>• تقارير أداء دورية تصل لولي الأمر.<br>• اختبارات قصيرة بعد كل وحدة لتحديد نقاط القوة والتحسين.<br>• متابعة واجبات الفيزياء ورسومات العدسات.",
        "تواصل تليجرام": "💬 <b>أنت الآن في المحادثة المباشرة مع مستر عاطف!</b><br>اكتب استفسارك هنا وسيقوم الأستاذ عاطف بالرد عليك من التليجرام مباشرة داخل هذا الشات. ⚡"
    };

    function escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function playNotificationSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch (e) {
            // Audio context fallback ignore
        }
    }

    function appendMessage(text, sender = 'bot', save = true) {
        if (!chatbotBody) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `chatbot-message ${sender}`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'msg-avatar';
        if (sender === 'teacher') {
            avatarDiv.innerHTML = '👨‍🏫';
        } else if (sender === 'user') {
            avatarDiv.innerHTML = '👤';
        } else {
            avatarDiv.innerHTML = '🤖';
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'msg-content';
        contentDiv.innerHTML = text;

        msgDiv.appendChild(avatarDiv);
        msgDiv.appendChild(contentDiv);
        chatbotBody.appendChild(msgDiv);

        chatbotBody.scrollTop = chatbotBody.scrollHeight;

        if (save) {
            saveChatHistory();
        }
    }

    function saveChatHistory() {
        if (!chatbotBody) return;
        const history = [];
        chatbotBody.querySelectorAll('.chatbot-message').forEach(el => {
            let sender = 'bot';
            if (el.classList.contains('user')) sender = 'user';
            if (el.classList.contains('teacher')) sender = 'teacher';
            const content = el.querySelector('.msg-content')?.innerHTML || '';
            history.push({ sender, content });
        });
        localStorage.setItem(`atef_chat_history_${visitorId}`, JSON.stringify(history.slice(-30)));
    }

    function loadChatHistory() {
        const saved = localStorage.getItem(`atef_chat_history_${visitorId}`);
        if (!saved || !chatbotBody) return;
        try {
            const history = JSON.parse(saved);
            if (history.length > 0) {
                chatbotBody.innerHTML = '';
                history.forEach(item => {
                    appendMessage(item.content, item.sender, false);
                });
            }
        } catch (e) {}
    }

    // Poll Telegram for Mr. Atef's Live Replies
    async function checkTelegramUpdates() {
        try {
            const url = `https://api.telegram.org/bot${CHATBOT_BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&limit=10`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
                data.result.forEach(update => {
                    lastUpdateId = Math.max(lastUpdateId, update.update_id);
                    localStorage.setItem('atef_last_update_id', lastUpdateId);

                    const msg = update.message;
                    if (!msg || !msg.text) return;

                    let targetVisitorId = null;
                    let replyText = msg.text.trim();

                    // Method 1: Teacher replied directly to Telegram notification message
                    if (msg.reply_to_message && msg.reply_to_message.text) {
                        const originalText = msg.reply_to_message.text;
                        const match = originalText.match(/#(V-\d{4})/);
                        if (match) {
                            targetVisitorId = match[1];
                        }
                    }

                    // Method 2: Teacher typed "#V-1234 message text"
                    if (!targetVisitorId) {
                        const match = replyText.match(/^#(V-\d{4})\s+([\s\S]+)/);
                        if (match) {
                            targetVisitorId = match[1];
                            replyText = match[2];
                        }
                    }

                    // If this reply belongs to the current visitor:
                    if (targetVisitorId === visitorId) {
                        appendMessage(`👨‍🏫 <b>الأستاذ عاطف:</b><br>${escapeHTML(replyText)}`, 'teacher');
                        playNotificationSound();

                        if (chatbotWindow && !chatbotWindow.classList.contains('active')) {
                            chatbotWindow.classList.add('active');
                        }
                        if (chatbotBadge) {
                            chatbotBadge.style.display = 'flex';
                            chatbotBadge.innerText = '💬 رد جديد';
                        }
                    }
                });
            }
        } catch (err) {
            // Ignore temporary network polling errors
        }
    }

    if (chatbotToggleBtn && chatbotWindow) {
        // Load history on initialization
        loadChatHistory();

        // Start Polling Telegram every 3 seconds for live replies from Mr. Atef
        setInterval(checkTelegramUpdates, 3000);

        chatbotToggleBtn.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
            if (chatbotBadge) chatbotBadge.style.display = 'none';
        });

        if (chatbotCloseBtn) {
            chatbotCloseBtn.addEventListener('click', () => {
                chatbotWindow.classList.remove('active');
            });
        }

        // Suggestions chip clicks
        if (chatbotSuggestions) {
            chatbotSuggestions.querySelectorAll('.chatbot-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    const question = chip.getAttribute('data-question');
                    const textLabel = chip.innerText;

                    appendMessage(textLabel, 'user');

                    setTimeout(() => {
                        let reply = CHATBOT_FAQS[question] || "أهلاً بك! كيف يمكنني مساعدتك اليوم؟";
                        appendMessage(reply, 'bot');
                    }, 500);
                });
            });
        }

        // Submit message form
        if (chatbotForm && chatbotInput) {
            chatbotForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const userMsg = chatbotInput.value.trim();
                if (!userMsg) return;

                appendMessage(userMsg, 'user');
                chatbotInput.value = '';

                // FAQ check
                const clean = userMsg.toLowerCase();
                let isFaqMatched = false;

                if (clean.includes('حجز') || clean.includes('مكان') || clean.includes('سنتر') || clean.includes('مواعيد')) {
                    isFaqMatched = true;
                    setTimeout(() => appendMessage(CHATBOT_FAQS["طريقة الحجز والأماكن"], 'bot'), 500);
                } else if (clean.includes('منهج') || clean.includes('وحدات') || clean.includes('دروس')) {
                    isFaqMatched = true;
                    setTimeout(() => appendMessage(CHATBOT_FAQS["تفاصيل المنهج"], 'bot'), 500);
                } else if (clean.includes('متابعة') || clean.includes('تقرير') || clean.includes('درجات')) {
                    isFaqMatched = true;
                    setTimeout(() => appendMessage(CHATBOT_FAQS["نظام المتابعة"], 'bot'), 500);
                }

                // Forward ALL custom questions to Mr. Atef's Telegram with 2-Way Reply Capability!
                const nowTime = new Date().toLocaleString('ar-EG');
                const safeUserMsg = escapeHTML(userMsg);

                const tgText = 
                    `💬 <b>محادثة شات جديدة من الموقع</b> 🌐\n` +
                    `🆔 <b>كود الجلسة:</b> <code>#${visitorId}</code>\n\n` +
                    `✉️ <b>رسالة الطالب:</b>\n${safeUserMsg}\n\n` +
                    `⏰ <b>التوقيت:</b> ${nowTime}\n` +
                    `-----------------------------------\n` +
                    `↩️ <b>للرد على الطالب في الموقع:</b>\n` +
                    `• اعمل <b>Reply (رد)</b> مباشر على هذه الرسالة هنا في التليجرام واكتب ردك.\n` +
                    `• أو أرسل: <code>#${visitorId} نص الرد</code>`;

                try {
                    const res = await fetch(`https://api.telegram.org/bot${CHATBOT_BOT_TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: CHATBOT_CHAT_ID,
                            text: tgText,
                            parse_mode: 'HTML'
                        })
                    });
                    const data = await res.json();

                    if (!isFaqMatched) {
                        if (data.ok) {
                            setTimeout(() => {
                                appendMessage(`💬 <b>تم إرسال استفسارك لمستر عاطف على التليجرام!</b> (كود المحادثة: <code>#${visitorId}</code>)<br>يمكنك البقاء في هذه الصفحة وسوف يصلك رد مستر عاطف المباشر هنا فوراً ⚡`, 'bot');
                            }, 500);
                        } else {
                            throw new Error(data.description || 'تعذر الوصول للتليجرام');
                        }
                    }
                } catch (err) {
                    console.error('Telegram Chatbot Error:', err);
                    if (!isFaqMatched) {
                        setTimeout(() => {
                            appendMessage("⚠️ يتعذر الاتصال بالتليجرام حالياً. يمكنك استخدام نموذج التواصل بأسفل الصفحة.", 'bot');
                        }, 500);
                    }
                }
            });
        }
    }

});


