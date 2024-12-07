import { SectionScheme } from '@/scheme/Section';
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
const Section = dynamic(() => import('../Section/Section').then((mod) => mod.Section))

export const LazyLoadSection = ({ section } : { section : SectionScheme }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true);
        }
      },
      { threshold: 0.6 }  // Trigger when 50% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div ref={sectionRef} className='w-full'>
      {isLoaded ? (
        <Section section={section} />
      ) : (
        <div className="loading-placeholder">Loading...</div>
      )}
    </div>
  );
};
