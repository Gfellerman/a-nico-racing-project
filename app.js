// A Nico Racing Project - Website JavaScript
class ANRPWebsite {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupProjectFilters();
        console.log('ANRP Website loaded successfully');
    }

    setupEventListeners() {
        // Logo banner click
        const logoBanner = document.querySelector('.logo-banner');
        if (logoBanner) {
            logoBanner.addEventListener('click', () => {
                this.navigateToPage('home');
            });
        }

        // Brand text click
        const brandText = document.querySelector('.brand-text');
        if (brandText) {
            brandText.addEventListener('click', () => {
                this.navigateToPage('home');
            });
        }

        // Hero CTA button
        const heroCTA = document.querySelector('.hero-cta');
        if (heroCTA) {
            heroCTA.addEventListener('click', () => {
                this.navigateToPage('projects');
            });
        }

        // Project buttons
        const projectButtons = document.querySelectorAll('.project-btn');
        projectButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const projectId = e.target.getAttribute('data-project');
                this.showProjectDetails(projectId);
            });
        });

        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(e);
            });
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('href').substring(1);
                this.navigateToPage(targetPage);
            });
        });
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }

    setupProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                const filter = e.target.getAttribute('data-filter');
                this.filterProjects(filter);
            });
        });
    }

    navigateToPage(pageId) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }

        // Update navigation
        this.updateActiveNavLink(pageId);

        // Scroll to top
        window.scrollTo(0, 0);
    }

    updateActiveNavLink(pageId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${pageId}`) {
                link.classList.add('active');
            }
        });
    }

    showProjectDetails(projectId) {
    // Hide all project details
    document.querySelectorAll('.project-details').forEach(elem => {
        elem.style.display = 'none';
    });
    // Show the chosen project
    const detailsElem = document.getElementById(`${projectId}-details`);
    if (detailsElem) {
        detailsElem.style.display = 'block';
        detailsElem.scrollIntoView({ behavior: 'smooth' });
    }
}

    getProjectInfo(projectId) {
        const projects = {
            'bmw-e46-m3-gtr': {
                title: 'BMW E46 M3 GTR',
                status: 'In Progress - Engine Preparation',
                description: 'S62 V8 engine conversion, 479 HP target. Currently in engine preparation phase.'
            },
            'nissan-terrano': {
                title: 'Nissan Terrano',
                status: 'Planning Phase',
                description: 'VG30E V6 rally preparation, 150 HP, 1650 kg. Planning off-road modifications.'
            },
            'kart-cross': {
                title: 'Kart Cross',
                status: 'Planning Phase', 
                description: 'Ducati 700cc engine swap with suspension strengthening for off-road racing.'
            },
            'porsche-911-997': {
                title: 'Porsche 911 (997) Turbo',
                status: 'Planning - Complete Rebuild',
                description: 'Complete chassis-up rebuild targeting 650 HP with full mechanical restoration.'
            }
        };
        
        return projects[projectId] || { title: 'Unknown Project', status: 'Unknown', description: 'No information available' };
    }

    filterProjects(filter) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
            } else {
                // Simple filter logic - you can enhance this
                const projectTitle = card.querySelector('.project-title').textContent.toLowerCase();
                let showCard = false;
                
                switch(filter) {
                    case 'track':
                        showCard = projectTitle.includes('bmw') || projectTitle.includes('m3');
                        break;
                    case 'offroad':
                        showCard = projectTitle.includes('terrano');
                        break;
                    case 'kart':
                        showCard = projectTitle.includes('kart');
                        break;
                    case 'supercar':
                        showCard = projectTitle.includes('porsche');
                        break;
                }
                
                card.style.display = showCard ? 'block' : 'none';
            }
        });
    }

    handleContactForm(e) {
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            projectType: formData.get('project-type'),
            message: formData.get('message')
        };

        // For now, just show an alert
        // Later you can integrate with a backend service
        alert(`Thank you ${data.name}! We'll contact you soon about your ${data.projectType || 'motorsport'} project.`);
        
        // Reset form
        e.target.reset();
    }
}

// Initialize website when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ANRPWebsite();
});
