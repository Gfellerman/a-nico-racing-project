import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

// Types
interface Project {
  id: number
  title: string
  specifications: string
  status: string
  category: string
  power_hp: number
  engine_type: string
  is_featured: boolean
  description: string
  timeline_tasks?: any
  race_results?: any
  featured_image?: any
}

// Styled Components (same as before, full definitions!)
const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #ffffff;
  font-family: 'Inter', Arial, sans-serif;
`
const Header = styled.header`
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid #333;
  padding: 1rem 0;
`
const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
`
const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`
const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  background: linear-gradient(45deg, #ffffff, #cccccc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`
const ContactPhone = styled.div`
  color: #ff6b35;
  font-weight: 600;
  font-size: 1rem;
`
const HeroSection = styled.section`
  padding: 4rem 0;
  text-align: center;
  background: 
    radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0);
  background-size: 20px 20px;
`
const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
`
const HeroTitle = styled.h1`
  font-size: 3rem;
  color: #ffffff;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  letter-spacing: 2px;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`
const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  color: #ff6b35;
  margin-bottom: 1rem;
`
const HeroDescription = styled.p`
  font-size: 1.2rem;
  color: #cccccc;
  margin-bottom: 2rem;
`
const ProjectsSection = styled.section`
  padding: 4rem 0;
`
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`
const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #ffffff;
  text-align: center;
  margin-bottom: 3rem;
`
const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`
const ProjectCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(255, 107, 53, 0.2);
  }
`
const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`
const ProjectTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`
const ProjectStatus = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => 
    props.status === 'In Progress' ? 'rgba(52, 168, 83, 0.2)' : 'rgba(255, 193, 7, 0.2)'};
  color: ${props => 
    props.status === 'In Progress' ? '#34a853' : '#ffc107'};
`
const ProjectSpecs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1rem;
`
const Spec = styled.div`
  display: flex;
  justify-content: space-between;
`
const SpecLabel = styled.span`
  color: #cccccc;
  font-weight: 500;
`
const SpecValue = styled.span`
  color: #ffffff;
  font-weight: 600;
`
const ProjectDescription = styled.p`
  color: #cccccc;
  line-height: 1.5;
  margin-bottom: 1.5rem;
`
const Button = styled.button`
  background: rgba(255, 107, 53, 0.1);
  color: #ff6b35;
  border: 2px solid #ff6b35;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: #ff6b35;
    color: #ffffff;
    transform: translateY(-2px);
  }
`
const LoadingMessage = styled.div`
  text-align: center;
  padding: 4rem 0;
  font-size: 1.2rem;
  color: #cccccc;
`
const ErrorMessage = styled.div`
  text-align: center;
  padding: 4rem 0;
  font-size: 1.2rem;
  color: #ff6b35;
`

function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch data with populate parameter to get timeline_tasks and race_results
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects?populate=*`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('API Response:', data) // Debug log

      // Normalize Strapi v4 "data[].attributes" structure
      const normalizedProjects = (data.data || []).map((item: any) => ({
        id: item.id,
        title: item.attributes.title,
        specifications: item.attributes.specifications,
        status: item.attributes.status,
        category: item.attributes.category,
        power_hp: item.attributes.power_hp,
        engine_type: item.attributes.engine_type,
        is_featured: item.attributes.is_featured,
        description: item.attributes.description,
        timeline_tasks: item.attributes.timeline_tasks,
        race_results: item.attributes.race_results,
        featured_image: item.attributes.featured_image
      }))
      setProjects(normalizedProjects)
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError('Failed to load projects. Please check if Strapi is running and your Codespace .env is correct.')
    } finally {
      setLoading(false)
    }
  }

  const handleProjectClick = (project: Project) => {
    console.log('ANRP Project clicked:', project)
    
    // Create detailed info popup
    let details = `🏎️ ${project.title}\n\n`
    details += `📊 SPECIFICATIONS:\n`
    details += `• Engine: ${project.engine_type || 'N/A'}\n`
    details += `• Power: ${project.power_hp || 'N/A'} HP\n`
    details += `• Category: ${project.category || 'N/A'}\n`
    details += `• Status: ${project.status || 'N/A'}\n\n`
    
    if (project.description) {
      details += `📝 DESCRIPTION:\n${project.description}\n\n`
    }
    
    // Parse and display timeline tasks
    if (project.timeline_tasks) {
      try {
        const tasks = typeof project.timeline_tasks === 'string' 
          ? JSON.parse(project.timeline_tasks) 
          : project.timeline_tasks
        
        if (Array.isArray(tasks) && tasks.length > 0) {
          details += `⏱️ TIMELINE:\n`
          tasks.forEach(task => {
            const icon = task.status === 'completed' ? '✅' : 
                        task.status === 'in_progress' ? '🔄' : '📋'
            details += `${icon} ${task.task}${task.date ? ` (${task.date})` : ''}\n`
          })
          details += '\n'
        }
      } catch (e) {
        console.log('Error parsing timeline_tasks:', e)
      }
    }
    
    // Parse and display race results
    if (project.race_results) {
      try {
        const results = typeof project.race_results === 'string'
          ? JSON.parse(project.race_results)
          : project.race_results
        
        if (Array.isArray(results) && results.length > 0) {
          details += `🏆 RACE RESULTS:\n`
          results.forEach(result => {
            details += `${result.event}: ${result.result || 'N/A'} (${result.date || 'N/A'})\n`
            if (result.notes) {
              details += `   Notes: ${result.notes}\n`
            }
          })
        }
      } catch (e) {
        console.log('Error parsing race_results:', e)
      }
    }
    
    alert(details)
  }

  return (
    <AppContainer>
      <Header>
        <Nav>
          <Logo>
            <LogoText>ANRP</LogoText>
          </Logo>
          <ContactPhone>+244 923 574 312</ContactPhone>
        </Nav>
      </Header>

      <HeroSection>
        <HeroContent>
          <HeroTitle>A NICO RACING PROJECT</HeroTitle>
          <HeroSubtitle>Professional Race Car Preparation & Motorsport Engineering</HeroSubtitle>
          <HeroDescription>From 70HP Karts to 650HP Supercars - Complete Motorsport Solutions</HeroDescription>
        </HeroContent>
      </HeroSection>

      <ProjectsSection>
        <Container>
          <SectionTitle>Current Projects</SectionTitle>
          {loading && <LoadingMessage>Loading projects...</LoadingMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {!loading && !error && (
            <ProjectsGrid>
              {projects.map((project) => (
                <ProjectCard key={project.id}>
                  <ProjectHeader>
                    <ProjectTitle>{project.title}</ProjectTitle>
                    <ProjectStatus status={project.status}>{project.status}</ProjectStatus>
                  </ProjectHeader>
                  <ProjectSpecs>
                    <Spec>
                      <SpecLabel>Engine:</SpecLabel>
                      <SpecValue>{project.engine_type || '—'}</SpecValue>
                    </Spec>
                    <Spec>
                      <SpecLabel>Power:</SpecLabel>
                      <SpecValue>{project.power_hp ? `${project.power_hp} HP` : '—'}</SpecValue>
                    </Spec>
                    <Spec>
                      <SpecLabel>Category:</SpecLabel>
                      <SpecValue>{project.category || '—'}</SpecValue>
                    </Spec>
                  </ProjectSpecs>
                  <ProjectDescription>{project.specifications || project.description || '—'}</ProjectDescription>
                  <Button onClick={() => handleProjectClick(project)}>
                    View Details
                  </Button>
                </ProjectCard>
              ))}
            </ProjectsGrid>
          )}
        </Container>
      </ProjectsSection>
    </AppContainer>
  )
}

export default App