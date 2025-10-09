// ANRP Website Gallery Logic
document.addEventListener('DOMContentLoaded', function() {
    setupNav();
    setupProjectDetails();
    setupMobileMenu();
    setupHero();
});

function setupNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.onclick = function(e) {
            e.preventDefault();
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const tgt = link.getAttribute('href').replace('#', '');
            document.getElementById(tgt).classList.add('active');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            window.scrollTo(0, 0);
        }
    });
    document.querySelector('.brand-text').onclick = function() {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('home').classList.add('active');
        navLinks.forEach(l => l.classList.remove('active'));
        navLinks[0].classList.add('active');
        window.scrollTo(0, 0);
    }
}

function setupHero() {
    let btn = document.querySelector('.hero-cta');
    if (btn) btn.onclick = () => {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('projects').classList.add('active');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('.nav-link[href="#projects"]').classList.add('active');
        window.scrollTo(0,0);
    }
}

function setupMobileMenu() {
    // (add hamburger/side nav support here if you wish)
}

function setupProjectDetails() {
    // Open modal
    document.querySelectorAll('.project-btn').forEach(btn => {
        btn.onclick = function(e) {
            const projectId = btn.getAttribute('data-project');
            openGallery(projectId);
        }
    });
}

window.openGallery = function(projectId) {
    const modal = document.getElementById(`${projectId}-details`);
    if (modal) { modal.classList.add('active'); }
    document.body.style.overflow = 'hidden';
};

window.closeGallery = function(projectId) {
    const modal = document.getElementById(`${projectId}-details`);
    if (modal) { modal.classList.remove('active'); }
    document.body.style.overflow = 'auto';
};
