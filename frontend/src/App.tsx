import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
// ANRP WEBSITE - Force reload



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

// Styled Components
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
      const response = await fetch('http://localhost:1337/api/projects')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setProjects(data.data || [])
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError('Failed to load projects. Please check if Strapi is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleProjectClick = (project: Project) => {
    console.log('Project clicked:', project)
    // TODO: Navigate to project detail page
  }

return (
  <div style={{
    backgroundColor: '#1a1a1a', 
    color: '#ff6b35', 
    minHeight: '100vh', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    flexDirection: 'column',
    fontSize: '2rem'
  }}>
    <h1>🏁 ANRP RACING PROJECT 🏁</h1>
    <h2>Testing - If you see this, React is loading our code!</h2>
    <p>BMW E46 M3 GTR Project Status: WORKING!</p>
  </div>
)


export default App
