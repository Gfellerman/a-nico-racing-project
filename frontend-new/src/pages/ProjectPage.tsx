import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

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
`

const BackBtn = styled.button`
  border: 1px solid #444; color: #ddd; background: transparent; padding: .5rem .9rem; border-radius: 8px; cursor: pointer;
  &:hover { color: #fff; border-color: #666; }
`

export default function ProjectPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'overview'|'timeline'|'results'|'gallery'|'media'>('overview')
  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<ProjectAttributes | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const base = import.meta.env.VITE_API_URL
        // Prefer slug, fallback to first project if no slug
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

  if (loading) return <Page><Header><BackBtn onClick={() => navigate(-1)}>← Back</BackBtn><div>ANRP</div></Header><Container>Loading…</Container></Page>
  if (!project) return <Page><Header><BackBtn onClick={() => navigate(-1)}>← Back</BackBtn><div>ANRP</div></Header><Container>Project not found.</Container></Page>

  const heroUrl =
    project.featured_image?.data?.attributes?.formats?.large?.url ||
    project.featured_image?.data?.attributes?.url || ''

  const gallery = project.image_gallery?.data || []

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
            <p>{typeof project.description === 'string' ? project.description : project.specifications}</p>
          </Panel>
        )}

        {tab==='timeline' && (
          <Panel>
            <h3>Build Timeline</h3>
            {(project.timeline_tasks && project.timeline_tasks.length>0) ? (
              <ul>
                {project.timeline_tasks.map((t:any,idx:number)=>(
                  <li key={idx}>
                    {t.status==='completed' ? '✅' : t.status==='in_progress' ? '🔄' : '📋'} {t.task} {t.date ? `(${t.date})` : ''}
                  </li>
                ))}
              </ul>
            ) : <p>No timeline entries yet.</p>}
          </Panel>
        )}

        {tab==='results' && (
          <Panel>
            <h3>Race Results</h3>
            {(project.race_results && project.race_results.length>0) ? (
              <ul>
                {project.race_results.map((r:any,idx:number)=>(
                  <li key={idx}>
                    {r.event}: {r.result || '—'} {r.date ? `(${r.date})` : ''} {r.notes ? `— ${r.notes}`:''}
                  </li>
                ))}
              </ul>
            ) : <p>No results recorded yet.</p>}
          </Panel>
        )}

        {tab==='gallery' && (
          <Panel>
            <h3>Image Gallery</h3>
            {gallery.length>0 ? (
              <GalleryGrid>
                {gallery.map((img:any,idx:number)=>{
                  const a = img.attributes
                  const thumb = a?.formats?.medium?.url || a?.url
                  return <ImgThumb key={idx} src={thumb} alt={a?.alternativeText || project.title} />
                })}
              </GalleryGrid>
            ) : <p>No images yet.</p>}
          </Panel>
        )}

        {tab==='media' && (
          <Panel>
            <h3>In the Media</h3>
            {(project.media_mentions && project.media_mentions.length>0) ? (
              <ul>
                {project.media_mentions.map((m:any,idx:number)=>(
                  <li key={idx}>
                    <a href={m.url} target="_blank" rel="noreferrer">{m.title || m.url}</a>
                  </li>
                ))}
              </ul>
            ) : <p>No media items yet.</p>}
          </Panel>
        )}
      </Container>
    </Page>
  )
}
