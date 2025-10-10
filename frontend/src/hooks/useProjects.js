import { useState, useEffect } from 'react';
import APIService from '../services/api';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const strapiProjects = await APIService.fetchProjects();
        const formattedProjects = strapiProjects.map(project => 
          APIService.formatProject(project)
        );
        setProjects(formattedProjects);
      } catch (err) {
        setError(err.message);
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return { projects, loading, error, refetch: loadProjects };
};

export const useProject = (id) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const loadProject = async () => {
      try {
        setLoading(true);
        const strapiProject = await APIService.fetchProject(id);
        const formattedProject = APIService.formatProject(strapiProject);
        setProject(formattedProject);
      } catch (err) {
        setError(err.message);
        console.error('Error loading project:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  return { project, loading, error };
};
