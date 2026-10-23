import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { allProjects, featuredProjects, getProject } from '../projects';
import { home } from '../data/siteConfig';
import useMeta from '../hooks/useMeta';
import { refreshScroll } from '../motion/lenis';
import Anatomy from '../sections/Anatomy/Anatomy';
import Contact from '../sections/Contact/Contact';
import Opening from '../sections/Hero/Opening';
import SelectedWork from '../sections/SelectedWork/SelectedWork';
import WorkIndex from '../sections/SelectedWork/WorkIndex';
import Services from '../sections/Services/Services';
import Statement from '../sections/Statement/Statement';
import Studio from '../sections/Studio/Studio';
import { scrollToSection } from '../utils/scroll';

// The identity dissected in "Anatomy" (its parts live in that project's data module).
const anatomyProject = getProject(home.anatomyProject);

export default function HomePage() {
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
      <SelectedWork projects={featuredProjects} />
      <WorkIndex projects={allProjects} />
      <Statement />
      {anatomyProject?.anatomy && <Anatomy project={anatomyProject} parts={anatomyProject.anatomy} />}
      <Services />
      <Studio />
      <Contact />
    </>
  );
}
