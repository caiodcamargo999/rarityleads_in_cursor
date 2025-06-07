// Language Management
const languages = {
    'en': {
        nav: {
            features: "Features",
            pricing: "Pricing",
            results: "Results",
            getStarted: "Get Started"
        },
        hero: {
            title: 'Generate Premium Leads on Autopilot',
            subtitle: 'Transform your business with AI-powered lead generation that delivers qualified prospects 24/7. Join 500+ businesses already scaling with Rarity Leads.',
            getStarted: "Get Started",
            strategyCall: "Free Strategy Call",
            badge: "Rated #1 Lead Generation Platform"
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
        },
        metrics: {
            leadQuality: "Lead Quality Score",
            conversionRate: "Conversion Rate",
            costPerLead: "Cost Per Lead",
            responseTime: "Response Time"
        }
    },
    'pt-BR': {
        nav: {
            features: "Recursos",
            pricing: "Preços",
            results: "Resultados",
            getStarted: "Começar"
        },
        hero: {
            title: 'Gere Leads Premium no Piloto Automático',
            subtitle: 'Transforme seu negócio com geração de leads alimentada por IA que entrega prospects qualificados 24/7. Junte-se a mais de 500 empresas já escalando com Rarity Leads.',
            getStarted: "Começar Agora",
            strategyCall: "Chamada Estratégica Gratuita",
            badge: "Plataforma #1 de Geração de Leads"
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
        },
        metrics: {
            leadQuality: "Pontuação de Qualidade de Leads",
            conversionRate: "Taxa de Conversão",
            costPerLead: "Custo por Lead",
            responseTime: "Tempo de Resposta"
        }
    },
    'es': {
        nav: {
            features: "Características",
            pricing: "Precios",
            results: "Resultados",
            getStarted: "Comenzar"
        },
        hero: {
            title: 'Genera Leads Premium en Piloto Automático',
            subtitle: 'Transforma tu negocio con generación de leads impulsada por IA que entrega prospectos calificados 24/7. Únete a más de 500 empresas ya escalando con Rarity Leads.',
            getStarted: "Comenzar Ahora",
            strategyCall: "Llamada Estratégica Gratuita",
            badge: "Plataforma #1 de Generación de Leads"
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
        },
        metrics: {
            leadQuality: "Puntuación de Calidad de Leads",
            conversionRate: "Tasa de Conversión",
            costPerLead: "Costo por Lead",
            responseTime: "Tiempo de Respuesta"
        }
    },
    'fr': {
        nav: {
            features: "Fonctionnalités",
            pricing: "Tarifs",
            results: "Résultats",
            getStarted: "Commencer"
        },
        hero: {
            title: 'Générez des Prospects Premium en Pilote Automatique',
            subtitle: 'Transformez votre entreprise avec la génération de prospects alimentée par IA qui livre des prospects qualifiés 24/7. Rejoignez plus de 500 entreprises déjà en croissance avec Rarity Leads.',
            getStarted: "Commencer Maintenant",
            strategyCall: "Appel Stratégique Gratuit",
            badge: "Plateforme #1 de Génération de Prospects"
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
        },
        metrics: {
            leadQuality: "Score de Qualité des Prospects",
            conversionRate: "Taux de Conversion",
            costPerLead: "Coût par Prospect",
            responseTime: "Temps de Réponse"
        }
    }
};

// DOM Elements - with null checks
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
// Wait for DOM to be ready before updating language
document.addEventListener('DOMContentLoaded', () => {
    updateLanguage(currentLanguage);
});

// Language selector toggle
if (currentLang && langDropdown) {
    currentLang.addEventListener('click', () => {
        langDropdown.style.display = langDropdown.style.display === 'block' ? 'none' : 'block';
    });
}

// Language selection
if (langDropdown) {
    document.querySelectorAll('.lang-dropdown a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.target.dataset.lang;
            updateLanguage(lang);
            langDropdown.style.display = 'none';
        });
    });
}

// Mobile menu toggle
if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

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

    // Generic function to update elements with data-i18n attributes
    function updateI18nElements() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const value = getNestedValue(content, key);
            if (value) {
                element.textContent = value;
            }
        });
    }

    // Helper function to get nested object values
    function getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    // Update navigation menu
    const navFeatures = document.querySelector('nav a[href="#features"]');
    const navPricing = document.querySelector('nav a[href="#pricing"]');
    const navResults = document.querySelector('nav a[href="#results"]');
    const navGetStarted = document.querySelector('nav .btn-primary');

    if (navFeatures) navFeatures.textContent = content.nav.features;
    if (navPricing) navPricing.textContent = content.nav.pricing;
    if (navResults) navResults.textContent = content.nav.results;
    if (navGetStarted) navGetStarted.textContent = content.nav.getStarted;

    // Update hero section
    const heroTitle = document.querySelector('#hero-section h1');
    const heroSubtitle = document.querySelector('#hero-section .hero-subtitle');
    const heroBadge = document.querySelector('#hero-section .badge span:last-child');
    if (heroTitle) heroTitle.innerHTML = content.hero.title.replace('Premium Leads', '<span class="gradient-text">Premium Leads</span>');
    if (heroSubtitle) heroSubtitle.textContent = content.hero.subtitle;
    if (heroBadge) heroBadge.textContent = content.hero.badge;

    // Update hero buttons
    const getStartedBtn = document.querySelector('#hero-section .btn-primary span:last-child');
    const strategyCallBtn = document.querySelector('#hero-section .btn-secondary');
    if (getStartedBtn) getStartedBtn.textContent = content.hero.getStarted;
    if (strategyCallBtn) strategyCallBtn.textContent = content.hero.strategyCall;

    // Update features
    const featureOne = document.querySelector('#feature-one h2');
    const featureOneDesc = document.querySelector('#feature-one p');
    const featureTwo = document.querySelector('#feature-two h2');
    const featureTwoDesc = document.querySelector('#feature-two p');
    const featureThree = document.querySelector('#feature-three h2');
    const featureThreeDesc = document.querySelector('#feature-three p');

    if (featureOne) featureOne.textContent = content.features.one.title;
    if (featureOneDesc) featureOneDesc.textContent = content.features.one.description;
    if (featureTwo) featureTwo.textContent = content.features.two.title;
    if (featureTwoDesc) featureTwoDesc.textContent = content.features.two.description;
    if (featureThree) featureThree.textContent = content.features.three.title;
    if (featureThreeDesc) featureThreeDesc.textContent = content.features.three.description;

    // Update CTA section
    const ctaTitle = document.querySelector('#cta-footer h2');
    const ctaButton = document.querySelector('#cta-footer .btn-primary span:first-child');
    if (ctaTitle) ctaTitle.textContent = content.cta.title;
    if (ctaButton) ctaButton.textContent = content.cta.button;

    // Update metrics
    const metricsLabels = document.querySelectorAll('.metrics-dashboard .metric-label');
    if (metricsLabels.length >= 4 && content.metrics) {
        metricsLabels[0].textContent = content.metrics.leadQuality;
        metricsLabels[1].textContent = content.metrics.conversionRate;
        metricsLabels[2].textContent = content.metrics.costPerLead;
        metricsLabels[3].textContent = content.metrics.responseTime;
    }

    // Update language selector
    if (currentLang) {
        currentLang.textContent = `${getFlagEmoji(lang)} ${lang.toUpperCase()}`;
    }
    document.documentElement.lang = lang;

    // Call the generic i18n updater for any remaining elements
    updateI18nElements();
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
    if (languageSelector && langDropdown && !languageSelector.contains(e.target)) {
        langDropdown.style.display = 'none';
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (navLinks) {
        if (window.innerWidth >= 768) {
            navLinks.style.display = 'flex';
        } else {
            navLinks.style.display = 'none';
        }
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

    // Handle pricing CTA buttons
    document.querySelectorAll('.pricing-cta').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'auth.html';
        });
    });

    // Handle "Get Started" buttons
    document.querySelectorAll('.btn-primary').forEach(button => {
        if (button.textContent.includes('Get Started') || button.textContent.includes('Começar') ||
            button.textContent.includes('Comenzar') || button.textContent.includes('Commencer')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'auth.html';
            });
        }
    });

    // Handle "Free Strategy Call" button
    const strategyButton = document.querySelector('.btn-secondary');
    if (strategyButton) {
        strategyButton.addEventListener('click', (e) => {
            e.preventDefault();
            // You can replace this with actual booking link
            window.open('https://calendly.com/rarity-leads', '_blank');
        });
    }

    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});