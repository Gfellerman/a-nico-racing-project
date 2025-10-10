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
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  return { projects, loading, error };
};
