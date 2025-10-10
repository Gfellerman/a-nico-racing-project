// API Configuration for ANRP Strapi CMS
const API_BASE_URL = process.env.REACT_APP_STRAPI_URL || 'https://organic-space-garbanzo-r4xwr7q449gv35474-1337.app.github.dev/api';

class APIService {
  async fetchProjects() {
    try {
      const response = await fetch(`${API_BASE_URL}/projects?populate=*`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  async fetchProject(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}?populate=*`);
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  }

  formatProject(strapiProject) {
    const { attributes } = strapiProject;
    return {
      id: strapiProject.id,
      title: attributes.title,
      specifications: attributes.specifications,
      description: attributes.description,
      is_featured: attributes.is_featured,
      images: attributes.featured_image ? [attributes.featured_image] : [],
      status: attributes.status || 'In Progress'
    };
  }
}

export default new APIService();
