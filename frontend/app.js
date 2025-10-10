// Replace the entire app.js content with this:
const STRAPI_API = 'https://organic-space-garbanzo-r4xwr7q449gv35474-1337.app.github.dev/api';

// Load projects from Strapi on page load
document.addEventListener('DOMContentLoaded', function() {
    setupNav();
    setupProjectDetails();
    setupMobileMenu();
    setupHero();
    loadProjectsFromStrapi(); // Add this line
});

// New function to load projects from Strapi
async function loadProjectsFromStrapi() {
    try {
        const response = await fetch(`${STRAPI_API}/projects?populate=*`);
        const data = await response.json();
        renderProjects(data.data);
    } catch (error) {
        console.error('Error loading projects:', error);
        // Keep existing hardcoded projects as fallback
    }
}

// Function to render projects dynamically
function renderProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid || projects.length === 0) return;

    // Clear existing projects
    projectsGrid.innerHTML = '';

    // Render each project from Strapi
    projects.forEach(project => {
        const { attributes } = project;
        const projectCard = createProjectCard(project.id, attributes);
        projectsGrid.appendChild(projectCard);
    });
}

// Create project card HTML
function createProjectCard(id, attributes) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-project', `project-${id}`);
    
    card.innerHTML = `
        <div class="project-header">
            <h3 class="project-title">${attributes.title}</h3>
            <span class="project-status status-progress">In Progress</span>
        </div>
        <div class="project-specs">
            <div class="spec">
                <span class="spec-label">Specifications:</span>
                <span class="spec-value">${attributes.specifications}</span>
            </div>
        </div>
        <p class="project-description">${attributes.description || 'Project description coming soon...'}</p>
        <button class="btn btn--secondary project-btn" data-project="project-${id}">View Details</button>
    `;
    
    return card;
}
