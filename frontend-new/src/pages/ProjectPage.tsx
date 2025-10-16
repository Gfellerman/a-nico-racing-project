import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

// Helper: normalize Strapi media URLs to absolute URLs for Codespaces
const withOrigin = (u?: string) => {
  if (!u) return ''
  if (u.startsWith('http')) return u
  const base = (import.meta.env.VITE_ASSETS_URL || import.meta.env.VITE_API_URL || '').replace(/\/api$/, '')
  return base ? `${base}${u}` : u
}

type MediaImage = {
  url: string
  alternativeText?: string
  caption?: string
  formats?: Record<string, { url: string }>
}

type ProjectAttributes = {
  title: string
  slug: string | null
  description: any
  specifications: string
  status: string
  category: string
  power_hp: number
  engine_type: string
  is_featured: boolean
  timeline_tasks?: any[]
  race_results?: any[]
  media_mentions?: any[]
  featured_image?: { data?: { attributes: MediaImage } }
  image_gallery?: { data?: Array<{ attributes: MediaImage }> }
  video_gallery?: { data?: Array<{ attributes: { url: string } }> }
}

type ProjectResponse = {
  data: Array<{ id: number; attributes: ProjectAttributes }>
}

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #fff;
  font-family: 'Inter', Arial, sans-serif;
`

const withOrigin = (u?: string) => 
  if (!u) return ''
  if (u.startsWith('http')) return u
  // Prefer a dedicated assets origin if you add it; else use API origin minus /api
  const origin = (import.meta.env.VITE_ASSETS_URL || import.meta.env.VITE_API_URL || '').replace(/\/api$/, '')
  return origin ? `${origin}${u}` : u
,

const Header = styled.header`
  border-bottom: 1px solid #333;
  padding: 1rem 2rem;
  display: flex; justify-content: space-between; align-items: center;
`

const Container = styled.div`
  max-width: 1200px; margin: 0 auto; padding: 2rem;
`

const Hero = styled.section`
  display: grid; grid-template-columns: 1.7fr 1fr; gap: 2rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`

const HeroImage = styled.img`
  width: 100%; height: 420px; object-fit: cover; border-radius: 12px; border: 1px solid #333;
`

const HeroCard = styled.div`
  border: 1px solid #333; border-radius: 12px; padding: 1.5rem; background: rgba(255,255,255,0.04);
`

const Title = styled.h1`
  font-size: 2rem; margin: 0 0 0.5rem 0;
  background: linear-gradient(45deg, #fff, #ccc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const SpecsGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: .5rem 1rem; margin-top: .5rem;
`

const Label = styled.span` color: #bbb; `
const Value = styled.span` color: #fff; font-weight: 600; `

const Tabs = styled.div` display: flex; gap: .75rem; margin-top: 2rem; `
const Tab = styled.button<{ $active:boolean }>`
  padding: .6rem 1rem; border-radius: 999px; cursor: pointer; border: 1px solid #444;
  background: ${({$active}) => $active ? 'rgba(255,107,53,.15)' : 'transparent'};
  color: ${({$active}) => $active ? '#ff6b35' : '#ddd'};
  &:hover { border-color: #666; }
`

const Panel = styled.div` margin-top: 1rem; border: 1px solid #333; border-radius: 12px; padding: 1rem; background: rgba(255,255,255,.03); `

const GalleryGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap: 1rem; margin-top: .5rem;
`

const ImgThumb = styled.img`
  width: 100%; height: 160px; object-fit: cover; border-radius: 8px; border: 1px solid #333;
  cursor: pointer; 
  transition: all 0.3s ease;
  &:hover { 
    border-color: #ff6b35; 
    transform: scale(1.02);
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.2);
  }
`

const BackBtn = styled.button`
  border: 1px solid #444; color: #ddd; background: transparent; padding: .5rem .9rem; border-radius: 8px; cursor: pointer;
  &:hover { color: #fff; border-color: #666; }
`

// Lightbox Modal Components
const LightboxOverlay = styled.div<{ $show: boolean }>`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.9); z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  opacity: ${({ $show }) => $show ? 1 : 0};
  visibility: ${({ $show }) => $show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`

const LightboxContent = styled.div`
  position: relative; max-width: 95vw; max-height: 95vh;
  display: flex; align-items: center; justify-content: center;
`

const LightboxImage = styled.img`
  max-width: 100%; max-height: 95vh; object-fit: contain;
  border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.8);
`

const LightboxClose = styled.button`
  position: absolute; top: -50px; right: 0;
  background: rgba(255,107,53,0.8); color: white; border: none;
  width: 40px; height: 40px; border-radius: 50%;
  cursor: pointer; font-size: 20px; font-weight: bold;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.3s ease;
  &:hover { background: #ff6b35; }
`

const NavButton = styled.button<{ $direction: 'prev' | 'next' }>`
  position: absolute; top: 50%; transform: translateY(-50%);
  ${({ $direction }) => $direction === 'prev' ? 'left: -60px;' : 'right: -60px;'}
  background: rgba(255,107,53,0.8); color: white; border: none;
  width: 50px; height: 50px; border-radius: 50%;
  cursor: pointer; font-size: 18px; font-weight: bold;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.3s ease;
  &:hover { background: #ff6b35; }
  @media (max-width: 768px) {
    ${({ $direction }) => $direction === 'prev' ? 'left: 10px;' : 'right: 10px;'}
    top: auto; bottom: 20px; transform: none;
  }
`

const ImageCounter = styled.div`
  position: absolute; bottom: -50px; left: 50%; transform: translateX(-50%);
  color: #fff; background: rgba(0,0,0,0.7); padding: 8px 16px;
  border-radius: 20px; font-size: 14px;
`

// Rich text renderer (unchanged)
function renderRich(nodes: any): JSX.Element | null {
  if (!nodes) return null
  const arr = Array.isArray(nodes) ? nodes : nodes.children || []
  return (
    <>
      {arr.map((n: any, i: number) => {
        if (n.type === 'paragraph') {
          const text = (n.children || []).map((c: any) => c.text).join('')
          return <p key={i} style={{ color: '#ddd', lineHeight: 1.6, margin: '1rem 0' }}>{text}</p>
        }
        if (n.type?.startsWith('heading')) {
          const level = Number(n.type.replace('heading', '')) || 2
          const Tag = (`h${Math.min(Math.max(level, 2), 4)}` as any)
          const text = (n.children || []).map((c: any) => c.text).join('')
          return <Tag key={i} style={{ color: '#fff', margin: '1.5rem 0 0.75rem 0' }}>{text}</Tag>
        }
        if (n.type === 'list' && n.format === 'unordered') {
          return (
            <ul key={i} style={{ paddingLeft: '1.25rem', margin: '1rem 0', color: '#ddd' }}>
              {(n.children || []).map((li: any, j: number) => {
                const text = (li.children?.[0]?.children || li.children || []).map((c: any) => c.text).join('')
                return <li key={j} style={{ lineHeight: 1.6, marginBottom: '0.5rem' }}>{text}</li>
              })}
            </ul>
          )
        }
        if (n.type === 'list' && n.format === 'ordered') {
          return (
            <ol key={i} style={{ paddingLeft: '1.25rem', margin: '1rem 0', color: '#ddd' }}>
              {(n.children || []).map((li: any, j: number) => {
                const text = (li.children?.[0]?.children || li.children || []).map((c: any) => c.text).join('')
                return <li key={j} style={{ lineHeight: 1.6, marginBottom: '0.5rem' }}>{text}</li>
              })}
            </ol>
          )
        }
        if (n.text) return <p key={i} style={{ color: '#ddd', lineHeight: 1.6, margin: '1rem 0' }}>{n.text}</p>
        return null
      })}
    </>
  )
}

export default function ProjectPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'overview'|'timeline'|'results'|'gallery'|'media'>('overview')
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<ProjectAttributes | null>(null)
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const base = import.meta.env.VITE_API_URL
        const url = slug && !slug.startsWith('id-')
          ? `${base}/projects?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
          : `${base}/projects?populate=*`
        const res = await fetch(url)
        const json: ProjectResponse = await res.json()
        const item = json.data?.[0]?.attributes || null
        setProject(item)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      
      if (e.key === 'Escape') {
        setLightboxOpen(false)
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev')
      } else if (e.key === 'ArrowRight') {
        navigateImage('next')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [lightboxOpen, currentImageIndex])

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    const gallery = project?.image_gallery?.data || []
    if (gallery.length === 0) return

    if (direction === 'prev') {
      setCurrentImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
    } else {
      setCurrentImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))
    }
  }

  if (loading) return <Page><Header><BackBtn onClick={() => navigate(-1)}>← Back</BackBtn><div>ANRP</div></Header><Container>Loading…</Container></Page>
  if (!project) return <Page><Header><BackBtn onClick={() => navigate(-1)}>← Back</BackBtn><div>ANRP</div></Header><Container>Project not found.</Container></Page>

  // Apply withOrigin to all media URLs
  const heroUrl = withOrigin(
    project.featured_image?.data?.attributes?.formats?.large?.url ||
    project.featured_image?.data?.attributes?.url
  )

  const gallery = project.image_gallery?.data || []
  const currentLightboxImage = gallery[currentImageIndex]
  const lightboxImageUrl = withOrigin(
    currentLightboxImage?.attributes?.formats?.large?.url || currentLightboxImage?.attributes?.url
  )

  return (
    <Page>
      <Header>
        <BackBtn onClick={() => navigate(-1)}>← Back</BackBtn>
        <div>ANRP</div>
      </Header>

      <Container>
        <Hero>
          {heroUrl ? <HeroImage src={heroUrl} alt={project.title} /> : <HeroCard>No featured image</HeroCard>}
          <HeroCard>
            <Title>{project.title}</Title>
            <SpecsGrid>
              <Label>Engine:</Label><Value>{project.engine_type || '—'}</Value>
              <Label>Power:</Label><Value>{project.power_hp ? `${project.power_hp} HP` : '—'}</Value>
              <Label>Category:</Label><Value>{project.category || '—'}</Value>
              <Label>Status:</Label><Value>{project.status || '—'}</Value>
            </SpecsGrid>
          </HeroCard>
        </Hero>

        <Tabs>
          <Tab $active={tab==='overview'} onClick={()=>setTab('overview')}>Overview</Tab>
          <Tab $active={tab==='timeline'} onClick={()=>setTab('timeline')}>Timeline</Tab>
          <Tab $active={tab==='results'} onClick={()=>setTab('results')}>Race Results</Tab>
          <Tab $active={tab==='gallery'} onClick={()=>setTab('gallery')}>Gallery</Tab>
          <Tab $active={tab==='media'} onClick={()=>setTab('media')}>Media</Tab>
        </Tabs>

        {tab==='overview' && (
          <Panel>
            <h3>Project Overview</h3>
            {Array.isArray(project.description) || project.description?.children
              ? renderRich(project.description)
              : <p style={{ color: '#ddd', lineHeight: 1.6 }}>
                  {project.description || project.specifications || '—'}
                </p>}
          </Panel>
        )}

        {tab==='timeline' && (
          <Panel>
            <h3>Build Timeline</h3>
            {(project.timeline_tasks && project.timeline_tasks.length>0) ? (
              <ul style={{ paddingLeft: '1.25rem', margin: '1rem 0' }}>
                {project.timeline_tasks.map((t:any,idx:number)=>(
                  <li key={idx} style={{ color: '#ddd', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                    {t.status==='completed' ? '✅' : t.status==='in_progress' ? '🔄' : '📋'} {t.task} {t.date ? `(${t.date})` : ''}
                  </li>
                ))}
              </ul>
            ) : <p style={{ color: '#ddd' }}>No timeline entries yet.</p>}
          </Panel>
        )}

        {tab==='results' && (
          <Panel>
            <h3>Race Results</h3>
            {(project.race_results && project.race_results.length>0) ? (
              <ul style={{ paddingLeft: '1.25rem', margin: '1rem 0' }}>
                {project.race_results.map((r:any,idx:number)=>(
                  <li key={idx} style={{ color: '#ddd', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                    {r.event}: {r.result || '—'} {r.date ? `(${r.date})` : ''} {r.notes ? `— ${r.notes}`:''}
                  </li>
                ))}
              </ul>
            ) : <p style={{ color: '#ddd' }}>No results recorded yet.</p>}
          </Panel>
        )}

        {tab==='gallery' && (
          <Panel>
            <h3>Image Gallery</h3>
            {gallery.length>0 ? (
              <GalleryGrid>
                {gallery.map((img:any,idx:number)=>{
                  const a = img.attributes
                  const thumb = withOrigin(a?.formats?.medium?.url || a?.url)
                  return (
                    <ImgThumb 
                      key={idx} 
                      src={thumb} 
                      alt={a?.alternativeText || project.title}
                      onClick={() => openLightbox(idx)}
                    />
                  )
                })}
              </GalleryGrid>
            ) : <p style={{ color: '#ddd' }}>No images yet.</p>}
          </Panel>
        )}

        {tab==='media' && (
          <Panel>
            <h3>In the Media</h3>
            {(project.media_mentions && project.media_mentions.length>0) ? (
              <ul style={{ paddingLeft: '1.25rem', margin: '1rem 0' }}>
                {project.media_mentions.map((m:any,idx:number)=>(
                  <li key={idx} style={{ color: '#ddd', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                    <a href={m.url} target="_blank" rel="noreferrer" style={{ color: '#ff6b35' }}>
                      {m.title || m.url}
                    </a>
                  </li>
                ))}
              </ul>
            ) : <p style={{ color: '#ddd' }}>No media items yet.</p>}
          </Panel>
        )}
      </Container>

      {/* Lightbox Modal */}
      <LightboxOverlay $show={lightboxOpen} onClick={() => setLightboxOpen(false)}>
        <LightboxContent onClick={(e) => e.stopPropagation()}>
          <LightboxClose onClick={() => setLightboxOpen(false)}>×</LightboxClose>
          
          {gallery.length > 1 && (
            <>
              <NavButton $direction="prev" onClick={() => navigateImage('prev')}>‹</NavButton>
              <NavButton $direction="next" onClick={() => navigateImage('next')}>›</NavButton>
            </>
          )}
          
          {lightboxImageUrl && (
            <LightboxImage 
              src={lightboxImageUrl} 
              alt={currentLightboxImage?.attributes?.alternativeText || project.title}
            />
          )}
          
          {gallery.length > 1 && (
            <ImageCounter>
              {currentImageIndex + 1} / {gallery.length}
            </ImageCounter>
          )}
        </LightboxContent>
      </LightboxOverlay>
    </Page>
  )
}
