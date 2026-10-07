/* ==========================================================================
   Ahmed Ragab Portfolio - Interactive JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Set Current Year in Footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    /* -------------------------------------------------------------------------- */
    /* 1. Theme Toggle (Dark / Light Mode)                                         */
    /* -------------------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);

            // Re-render chart colors if active
            if (myInteractiveChart) updateChartColors();
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'light') {
            icon.className = 'fa-solid fa-sun';
            icon.style.color = '#f59e0b';
        } else {
            icon.className = 'fa-solid fa-moon';
            icon.style.color = '#00f2fe';
        }
    }

    /* -------------------------------------------------------------------------- */
    /* 2. Scroll Progress Bar & Navbar Shadow                                     */
    /* -------------------------------------------------------------------------- */
    const progressBar = document.getElementById('scroll-progress');
    const navbarHeader = document.querySelector('.navbar-header');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        if (progressBar) progressBar.style.width = scrollPercent + '%';

        if (navbarHeader) {
            if (scrollTop > 50) {
                navbarHeader.style.padding = '0.7rem 2rem';
                navbarHeader.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
            } else {
                navbarHeader.style.padding = '1rem 2rem';
                navbarHeader.style.boxShadow = 'none';
            }
        }

        highlightNavOnScroll();
    });

    /* -------------------------------------------------------------------------- */
    /* 3. Mobile Navigation Hamburger Menu                                         */
    /* -------------------------------------------------------------------------- */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    function highlightNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /* -------------------------------------------------------------------------- */
    /* 4. Typing Effect for Subtitle                                              */
    /* -------------------------------------------------------------------------- */
    const typingText = document.querySelector('.typing-text');
    const roles = [
        "Junior Data Analyst",
        "CS & AI Student @ Beni Suef Univ",
        "Power BI & SQL Specialist",
        "Machine Learning Developer",
        "DEPI Full Stack .NET Graduate"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        if (!typingText) return;

        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at top
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(typeEffect, typingSpeed);
    }
    typeEffect();

    /* -------------------------------------------------------------------------- */
    /* 5. Animated Counter Stats                                                  */
    /* -------------------------------------------------------------------------- */
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const suffix = stat.getAttribute('data-suffix') || '';
            const duration = 2000;
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.ceil(current) + suffix;
                }
            }, stepTime);
        });
    }

    // Trigger counter when hero section visible
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedStats) {
                    animateStats();
                    animatedStats = true;
                }
            });
        }, { threshold: 0.5 });
        observer.observe(heroStats);
    }

    /* -------------------------------------------------------------------------- */
    /* 6. Skills & Project Filter Logic                                           */
    /* -------------------------------------------------------------------------- */
    // Skill Filter Tabs
    const skillTabs = document.querySelectorAll('.skill-tab');
    const skillCards = document.querySelectorAll('.skill-card');

    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            skillTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => { card.style.display = 'none'; }, 250);
                }
            });
        });
    });

    // Project Filter Buttons
    const projectFilterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    projectFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            projectFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-project-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'flex';
                    setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => { card.style.display = 'none'; }, 250);
                }
            });
        });
    });

    /* -------------------------------------------------------------------------- */
    /* 7. Interactive Chart.js Analytics Lab Showcase                            */
    /* -------------------------------------------------------------------------- */
    const ctx = document.getElementById('interactive-chart');
    let myInteractiveChart = null;

    const datasets = {
        sales: {
            label: 'Quarterly Sales Revenue ($K)',
            labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025 (Forecast)'],
            data: [45.2, 58.6, 72.4, 94.5, 88.1, 105.0],
            peak: '$105.0K',
            avg: '$77.3K'
        },
        churn: {
            label: 'Customer Churn Risk Rate (%)',
            labels: ['Tech Support', 'E-Commerce', 'Financial Services', 'Healthcare', 'SaaS Subscriptions'],
            data: [14.2, 28.5, 9.1, 12.3, 22.8],
            peak: '28.5% (E-Commerce)',
            avg: '17.3%'
        },
        ml_acc: {
            label: 'Algorithm Model Accuracy Score (%)',
            labels: ['Random Forest', 'SVM Classifier', 'Logistic Regression', 'XGBoost', 'Decision Tree'],
            data: [94.2, 89.6, 84.1, 95.8, 81.4],
            peak: '95.8% (XGBoost)',
            avg: '89.0%'
        }
    };

    function initInteractiveChart(datasetKey = 'sales', chartType = 'bar') {
        if (!ctx) return;

        const currentTheme = htmlElement.getAttribute('data-theme');
        const textColor = currentTheme === 'light' ? '#334155' : '#cbd5e1';
        const gridColor = currentTheme === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)';

        const selected = datasets[datasetKey];

        // Update analytics summary cards
        document.getElementById('demo-peak').textContent = selected.peak;
        document.getElementById('demo-avg').textContent = selected.avg;

        if (myInteractiveChart) {
            myInteractiveChart.destroy();
        }

        const barColors = [
            '#00f2fe', '#4facfe', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'
        ];

        myInteractiveChart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: selected.labels,
                datasets: [{
                    label: selected.label,
                    data: selected.data,
                    backgroundColor: chartType === 'line' ? 'rgba(0, 242, 254, 0.15)' : barColors,
                    borderColor: '#00f2fe',
                    borderWidth: 2,
                    fill: chartType === 'line',
                    tension: 0.35,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: textColor, font: { family: 'Outfit', size: 13 } }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#00f2fe',
                        bodyColor: '#fff',
                        borderColor: '#00f2fe',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8
                    }
                },
                scales: chartType !== 'doughnut' ? {
                    x: {
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    },
                    y: {
                        ticks: { color: textColor },
                        grid: { color: gridColor },
                        beginAtZero: true
                    }
                } : {}
            }
        });
    }

    function updateChartColors() {
        const datasetSelect = document.getElementById('chart-dataset-select');
        const typeSelect = document.getElementById('chart-type-select');
        if (datasetSelect && typeSelect) {
            initInteractiveChart(datasetSelect.value, typeSelect.value);
        }
    }

    // Chart Select Handlers
    const datasetSelect = document.getElementById('chart-dataset-select');
    const typeSelect = document.getElementById('chart-type-select');
    const randomizeBtn = document.getElementById('randomize-data-btn');

    if (datasetSelect && typeSelect) {
        datasetSelect.addEventListener('change', () => initInteractiveChart(datasetSelect.value, typeSelect.value));
        typeSelect.addEventListener('change', () => initInteractiveChart(datasetSelect.value, typeSelect.value));

        if (randomizeBtn) {
            randomizeBtn.addEventListener('click', () => {
                const key = datasetSelect.value;
                const currentData = datasets[key].data;
                const randomized = currentData.map(val => +(val + (Math.random() * 8 - 4)).toFixed(1));
                myInteractiveChart.data.datasets[0].data = randomized;
                myInteractiveChart.update();
            });
        }

        initInteractiveChart();
    }

    /* -------------------------------------------------------------------------- */
    /* 8. Modals Handler                                                          */
    /* -------------------------------------------------------------------------- */
    const modalOpenBtns = document.querySelectorAll('.open-modal');
    const closeBtns = document.querySelectorAll('.close-modal');
    const modals = document.querySelectorAll('.modal');

    modalOpenBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            if (targetModal) targetModal.classList.add('active');
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modals.forEach(m => m.classList.remove('active'));
        });
    });

    window.addEventListener('click', (e) => {
        modals.forEach(m => {
            if (e.target === m) m.classList.remove('active');
        });
    });

    /* -------------------------------------------------------------------------- */
    /* 9. Copy to Clipboard                                                       */
    /* -------------------------------------------------------------------------- */
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-copy');
            navigator.clipboard.writeText(text).then(() => {
                const origIcon = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check text-success"></i>';
                setTimeout(() => { btn.innerHTML = origIcon; }, 2000);
            });
        });
    });

    /* -------------------------------------------------------------------------- */
    /* 10. Contact Form Simulation                                                */
    /* -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                formStatus.className = 'form-status success';
                formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully to Ahmed.';
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    /* -------------------------------------------------------------------------- */
    /* 11. Particle Matrix Canvas Background                                      */
    /* -------------------------------------------------------------------------- */
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctxCanvas = canvas.getContext('2d');
        let particles = [];
        const particleCount = 65;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctxCanvas.beginPath();
                ctxCanvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctxCanvas.fillStyle = 'rgba(0, 242, 254, 0.6)';
                ctxCanvas.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            ctxCanvas.clearRect(0, 0, canvas.width, canvas.height);

            const isLight = htmlElement.getAttribute('data-theme') === 'light';
            const lineColor = isLight ? 'rgba(2, 132, 199, ' : 'rgba(0, 242, 254, ';

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        ctxCanvas.beginPath();
                        ctxCanvas.moveTo(particles[i].x, particles[i].y);
                        ctxCanvas.lineTo(particles[j].x, particles[j].y);
                        ctxCanvas.strokeStyle = lineColor + (1 - dist / 130) * 0.25 + ')';
                        ctxCanvas.lineWidth = 0.8;
                        ctxCanvas.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }
});
