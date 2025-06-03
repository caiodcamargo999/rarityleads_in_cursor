// Language Management
const languages = {
    'en': {
        hero: {
            title: 'Automate Your Leads. Scale With Precision.',
            subtitle: 'Rarity Leads is your AI-native platform to attract, qualify, and close clients — without the manual grind.'
        },
        features: {
            one: {
                title: 'AI-Powered SDR That Qualifies Leads for You',
                description: 'Our intelligent chatbot works 24/7 to qualify leads through natural conversations, ensuring only high-intent prospects reach your team.'
            },
            two: {
                title: 'Smart WhatsApp Follow-ups, No Manual Messaging',
                description: 'Automate your follow-up sequences with rich media support, intelligent sequencing, and AI-powered response logic.'
            },
            three: {
                title: 'Campaign Intelligence for Google and Meta',
                description: 'Optimize your ad campaigns with AI-driven insights, automated bidding, and real-time performance tracking.'
            }
        },
        cta: {
            title: 'Stop Chasing Leads. Start Closing.',
            button: 'Get Started'
        }
    },
    'pt-BR': {
        hero: {
            title: 'Automatize Seus Leads. Escale com Precisão.',
            subtitle: 'Rarity Leads é sua plataforma nativa em IA para atrair, qualificar e fechar clientes — sem o trabalho manual.'
        },
        features: {
            one: {
                title: 'SDR com IA que Qualifica Leads para Você',
                description: 'Nosso chatbot inteligente trabalha 24/7 para qualificar leads através de conversas naturais, garantindo que apenas prospects com alta intenção cheguem à sua equipe.'
            },
            two: {
                title: 'Follow-ups Inteligentes no WhatsApp, Sem Mensagens Manuais',
                description: 'Automatize suas sequências de follow-up com suporte a mídia rica, sequenciamento inteligente e lógica de resposta baseada em IA.'
            },
            three: {
                title: 'Inteligência de Campanhas para Google e Meta',
                description: 'Otimize suas campanhas publicitárias com insights baseados em IA, lances automatizados e acompanhamento de desempenho em tempo real.'
            }
        },
        cta: {
            title: 'Pare de Perseguir Leads. Comece a Fechar.',
            button: 'Começar Agora'
        }
    },
    'es': {
        hero: {
            title: 'Automatiza tus Leads. Escala con Precisión.',
            subtitle: 'Rarity Leads es tu plataforma nativa en IA para atraer, calificar y cerrar clientes — sin el trabajo manual.'
        },
        features: {
            one: {
                title: 'SDR con IA que Califica Leads para Ti',
                description: 'Nuestro chatbot inteligente trabaja 24/7 para calificar leads a través de conversaciones naturales, asegurando que solo prospectos con alta intención lleguen a tu equipo.'
            },
            two: {
                title: 'Seguimientos Inteligentes en WhatsApp, Sin Mensajes Manuales',
                description: 'Automatiza tus secuencias de seguimiento con soporte para medios ricos, secuenciación inteligente y lógica de respuesta basada en IA.'
            },
            three: {
                title: 'Inteligencia de Campañas para Google y Meta',
                description: 'Optimiza tus campañas publicitarias con insights basados en IA, pujas automatizadas y seguimiento de rendimiento en tiempo real.'
            }
        },
        cta: {
            title: 'Deja de Perseguir Leads. Comienza a Cerrar.',
            button: 'Comenzar Ahora'
        }
    },
    'fr': {
        hero: {
            title: 'Automatisez vos Leads. Évoluez avec Précision.',
            subtitle: 'Rarity Leads est votre plateforme native en IA pour attirer, qualifier et conclure des clients — sans le travail manuel.'
        },
        features: {
            one: {
                title: 'SDR avec IA qui Qualifie les Leads pour Vous',
                description: 'Notre chatbot intelligent travaille 24/7 pour qualifier les leads à travers des conversations naturelles, assurant que seuls les prospects à forte intention atteignent votre équipe.'
            },
            two: {
                title: 'Suivis Intelligents sur WhatsApp, Sans Messages Manuels',
                description: 'Automatisez vos séquences de suivi avec support multimédia, séquençage intelligent et logique de réponse basée sur l\'IA.'
            },
            three: {
                title: 'Intelligence des Campagnes pour Google et Meta',
                description: 'Optimisez vos campagnes publicitaires avec des insights basés sur l\'IA, des enchères automatisées et un suivi des performances en temps réel.'
            }
        },
        cta: {
            title: 'Arrêtez de Courir après les Leads. Commencez à Conclure.',
            button: 'Commencer Maintenant'
        }
    }
};

// DOM Elements
const languageSelector = document.querySelector('.language-selector');
const currentLang = document.querySelector('.current-lang');
const langDropdown = document.querySelector('.lang-dropdown');
const mobileMenuToggle = document.querySelector('.nav-mobile-toggle');
const navLinks = document.querySelector('.nav-links');

// Detect browser language
const browserLang = navigator.language.split('-')[0];
const supportedLangs = ['en', 'pt-BR', 'es', 'fr'];

// Set initial language
let currentLanguage = supportedLangs.includes(browserLang) ? browserLang : 'en';
updateLanguage(currentLanguage);

// Language selector toggle
currentLang.addEventListener('click', () => {
    langDropdown.style.display = langDropdown.style.display === 'block' ? 'none' : 'block';
});

// Language selection
document.querySelectorAll('.lang-dropdown a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = e.target.dataset.lang;
        updateLanguage(lang);
        langDropdown.style.display = 'none';
    });
});

// Mobile menu toggle
mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        }
    });
});

// Update page content based on selected language
function updateLanguage(lang) {
    const content = languages[lang];
    if (!content) return;

    // Update hero section
    document.querySelector('#hero-section h1').textContent = content.hero.title;
    document.querySelector('#hero-section .hero-subtitle').textContent = content.hero.subtitle;

    // Update features
    document.querySelector('#feature-one h2').textContent = content.features.one.title;
    document.querySelector('#feature-one p').textContent = content.features.one.description;
    document.querySelector('#feature-two h2').textContent = content.features.two.title;
    document.querySelector('#feature-two p').textContent = content.features.two.description;
    document.querySelector('#feature-three h2').textContent = content.features.three.title;
    document.querySelector('#feature-three p').textContent = content.features.three.description;

    // Update CTA section
    document.querySelector('#cta-footer h2').textContent = content.cta.title;
    document.querySelector('#cta-footer .btn-primary').textContent = content.cta.button;

    // Update language selector
    currentLang.textContent = `${getFlagEmoji(lang)} ${lang.toUpperCase()}`;
    document.documentElement.lang = lang;
}

// Get flag emoji for language
function getFlagEmoji(lang) {
    const flags = {
        'en': '🇺🇸',
        'pt-BR': '🇧🇷',
        'es': '🇪🇸',
        'fr': '🇫🇷'
    };
    return flags[lang] || '🌐';
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!languageSelector.contains(e.target)) {
        langDropdown.style.display = 'none';
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        navLinks.style.display = 'flex';
    } else {
        navLinks.style.display = 'none';
    }
});

// Add skip link for accessibility
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
document.body.insertBefore(skipLink, document.body.firstChild);

// Add main content ID
document.querySelector('main')?.setAttribute('id', 'main-content');

// Metrics rotation
let activeMetricIndex = 0;
const metrics = document.querySelectorAll('.metric-card');

function rotateMetrics() {
    metrics.forEach((metric, index) => {
        metric.classList.toggle('active', index === activeMetricIndex);
    });
    activeMetricIndex = (activeMetricIndex + 1) % metrics.length;
}

// Start metrics rotation
setInterval(rotateMetrics, 2000);

// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card').forEach(el => {
    observer.observe(el);
});

// Form submission handling
const ctaForm = document.querySelector('.cta-form');
if (ctaForm) {
    ctaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = ctaForm.querySelector('input[type="email"]').value;
        
        try {
            // Show loading state
            const submitButton = ctaForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = 'Processing...';
            submitButton.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thank you! We\'ll be in touch soon.';
            ctaForm.appendChild(successMessage);

            // Reset form
            ctaForm.reset();
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;

            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Something went wrong. Please try again.');
        }
    });
}

// Add parallax effect to background blobs
document.addEventListener('mousemove', (e) => {
    const blobs = document.querySelectorAll('.gradient-blob');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    blobs.forEach((blob, index) => {
        const speed = (index + 1) * 0.1;
        const x = (mouseX - 0.5) * speed * 100;
        const y = (mouseY - 0.5) * speed * 100;
        blob.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Add CSS classes for animations
document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes to elements
    document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card').forEach(el => {
        el.classList.add('fade-in');
    });

    // Initialize tooltips if needed
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', (e) => {
            const text = e.target.dataset.tooltip;
            const tooltipEl = document.createElement('div');
            tooltipEl.className = 'tooltip';
            tooltipEl.textContent = text;
            document.body.appendChild(tooltipEl);

            const rect = e.target.getBoundingClientRect();
            tooltipEl.style.top = `${rect.bottom + 5}px`;
            tooltipEl.style.left = `${rect.left + (rect.width / 2) - (tooltipEl.offsetWidth / 2)}px`;
        });

        tooltip.addEventListener('mouseleave', () => {
            const tooltipEl = document.querySelector('.tooltip');
            if (tooltipEl) {
                tooltipEl.remove();
            }
        });
    });
}); 