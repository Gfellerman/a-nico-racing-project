import React from 'react';
import styled from 'styled-components';
import './App.css';

// Mock data for projects (we'll connect to Strapi later)
const mockProjects = [
  {
    id: 1,
    title: 'BMW E46 M3 GTR',
    specifications: 'S62 V8 4.9L ENGINE WITH 480HP',
    description: 'Complete race preparation featuring S62 V8 engine conversion for maximum track performance',
    status: 'In Progress',
    category: 'Track Racing'
  },
  {
    id: 2,
    title: 'NISSAN TERRANO',
    specifications: 'VG30E ENGINE, 3.0L 150 HP',
    description: 'Off-road racing preparation with VG30E V6 engine optimization for competitive rally racing',
    status: 'Planning',
    category: 'Off-Road Rally'
  }
];

// Styled Components with ANRP Theme
const AppContainer = styled.div`
  background: #1a1a1a;
  color: #ffffff;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
`;

const Header = styled.header`
  background: #282828;
  padding: 1rem 2rem;
  border-bottom: 2px solid #FF4500;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ANRPLogo = styled.div`
  background: #FF4500;
  color: #000;
  padding: 0.5rem 1rem;
  font-weight: bold;
  font-size: 1.5rem;
  border-radius: 4px;
`;

const LogoText = styled.div`
  h1 {
    margin: 0;
    font-size: 1.8rem;
    color: #C0C0C0;
  }
  p {
    margin: 0;
    color: #888;
    font-size: 0.9rem;
  }
`;

const Contact = styled.div`
  color: #FF4500;
  font-weight: bold;
  margin-left: auto;
`;

const Hero = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #C0C0C0;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: #888;
  margin-bottom: 2rem;
`;

const ProjectsSection = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #C0C0C0;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
`;

const ProjectCard = styled.div`
  background: #2a2a2a;
  border-radius: 8px;
  padding: 2rem;
  border: 1px solid #444;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: #FF4500;
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  color: #C0C0C0;
  margin: 0;
`;

const ProjectStatus = styled.span<{ status: string }>`
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  background: ${props => props.status === 'In Progress' ? '#FF4500' : '#1E3A8A'};
  color: white;
`;

const ProjectSpecs = styled.div`
  color: #FF4500;
  font-weight: bold;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const ProjectDescription = styled.p`
  color: #aaa;
  line-height: 1.6;
`;

const ViewButton = styled.button`
  background: #FF4500;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.3s ease;
  
  &:hover {
    background: #e63d00;
  }
`;

function App() {
  return (
    <AppContainer>
      <Header>
        <Logo>
          <ANRPLogo>ANRP</ANRPLogo>
          <LogoText>
            <h1>A NICO RACING PROJECT</h1>
            <p>Professional Race Car Preparation & Motorsport Engineering</p>
          </LogoText>
          <Contact>Tel: +244 923 574 312</Contact>
        </Logo>
      </Header>

      <Hero>
        <HeroTitle>A NICO RACING PROJECT</HeroTitle>
        <HeroSubtitle>From 70HP Karts to 650HP Supercars - Complete Motorsport Solutions</HeroSubtitle>
      </Hero>

      <ProjectsSection>
        <SectionTitle>Current Projects</SectionTitle>
        <ProjectsGrid>
          {mockProjects.map((project) => (
            <ProjectCard key={project.id}>
              <ProjectHeader>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectStatus status={project.status}>{project.status}</ProjectStatus>
              </ProjectHeader>
              <ProjectSpecs>{project.specifications}</ProjectSpecs>
              <ProjectDescription>{project.description}</ProjectDescription>
              <ViewButton>View Details</ViewButton>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      </ProjectsSection>
    </AppContainer>
  );
}

export default App;
