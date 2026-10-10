import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { allProjects, featuredProjects, getProject } from '../data/projects';
import { refreshScroll } from '../motion/lenis';
import Anatomy from '../sections/Anatomy';
import Contact from '../sections/Contact';
import Opening from '../sections/Opening';
import Services from '../sections/Services';
import Statement from '../sections/Statement';
import Studio from '../sections/Studio';
import Work from '../sections/Work';
import WorkIndex from '../sections/WorkIndex';
import { img } from '../utils/media';
import useMeta from '../utils/useMeta';
import { scrollToSection } from '../utils/scroll';

// The identity dissected in "Anatomy" — real Rumh guideline pages.
const anatomyProject = getProject('rumh');
const anatomyParts = [
  {
    label: 'Concept',
    labelAr: 'الفكرة',
    media: img('work/rumh/concept', 'Rumh concept board', { position: '50% 100%' }),
  },
  { label: 'Logo', labelAr: 'الشعار', kind: 'logo' },
  { label: 'Colour', labelAr: 'الألوان', kind: 'colour' },
  {
    label: 'Pattern',
    labelAr: 'النمط',
    media: img('work/rumh/colour', 'Rumh geometric pattern in red and navy', { position: '50% 50%' }),
  },
  {
    label: 'Application',
    labelAr: 'التطبيقات',
    media: img('work/rumh/signage', 'Rumh wayfinding sign', { position: '62% 50%' }),
  },
];

export default function Home() {
  const location = useLocation();
  useMeta();

  // Arriving with a section (from another page, or a shared /#services link)
  useEffect(() => {
    const section = location.state?.section ?? location.hash.slice(1);
    if (!section) return undefined;
    const id = requestAnimationFrame(() => {
      refreshScroll();
      scrollToSection(section, { instant: true });
    });
    return () => cancelAnimationFrame(id);
  }, [location]);

  return (
    <>
      <Opening count={allProjects.length} />
      <Work projects={featuredProjects} />
      <WorkIndex projects={allProjects} />
      <Statement />
      {anatomyProject && <Anatomy project={anatomyProject} parts={anatomyParts} />}
      <Services />
      <Studio />
      <Contact />
    </>
  );
}
