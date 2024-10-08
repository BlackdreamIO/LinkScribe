'use client';

import { useState, useEffect, memo, useRef } from 'react';
import { SectionScheme } from '@/scheme/Section';

import { useSettingContext } from '@/context/SettingContextProvider';
import { useSectionContext } from '@/context/SectionContextProvider';
import { useSectionContainerContext } from '@/context/SectionContainerContext';
import { useThemeContext } from '@/context/ThemeContextProvider';
import { useSectionController } from '@/context/SectionControllerProviders';

import { Box } from '@chakra-ui/react';

import { ConditionalRender } from '@/components/ui/conditionalRender';

import { SectionHeader } from './SectionHeader';
import { LinksLayout } from '../Link/LinksLayout';
import ErrorManager from '../../../components/ErrorHandler/ErrorManager';

// Deep comparison function to avoid unnecessary re-renders
const areSectionsEqual = (prevProps: { section: SectionScheme }, nextProps: { section: SectionScheme }) => {
  return JSON.stringify(prevProps.section) === JSON.stringify(nextProps.section);
};

const NonMemSection = ({ section }: { section: SectionScheme }) => {
    const [minimize, setMinimize] = useState(section.minimized || false);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);

    const { UpdateSection } = useSectionController();
    const { setCurrentSection, currentSection, setOriginalSection } = useSectionContext();
    const { sectionHighlighted, minimizeAllSections } = useSectionContainerContext();
    const { showLinkCount } = useSettingContext();
    const { sectionGlassmorphismEnabled } = useThemeContext();

    const skippedInitialRender = useRef(false);
    const wasInitialRender = useRef(false);

    useEffect(() => {
        if(section) {
            setCurrentSection(section);
            setOriginalSection(section);
        }
    }, [section]);
    
    useEffect(() => {
        if(skippedInitialRender.current) {
            console.log(minimizeAllSections);
            setMinimize(minimizeAllSections);
            UpdateSection({
                currentSection : section,
                updatedSection : {...section, minimized : true}
            })
            return;
        }
        const currentTimeout = setTimeout(() => {
            wasInitialRender.current = true;
            skippedInitialRender.current = true;
        }, 200);
        return () => clearTimeout(currentTimeout);
    }, [minimizeAllSections])
    

    return (
        <Box
            onContextMenu={(e) => e.preventDefault()}
            className={`w-full ${sectionGlassmorphismEnabled ? "dark:bg-black/30 backdrop-filter backdrop-blur-xl z-0" : "dark:bg-theme-bgFourth"} bg-white border-[2px] rounded-2xl flex flex-col justify-center space-y-4 transition-all duration-300
                ${contextMenuOpen && !sectionHighlighted ? 'border-indigo-300' : sectionHighlighted ? 'dark:border-white border-black ' : sectionGlassmorphismEnabled ? "" : 'dark:border-neutral-900 '}
                ${sectionHighlighted ? 'pointer-events-none' : 'pointer-events-auto'} dark:shadow-none shadow-sm shadow-black`}
            >
            <ErrorManager>
                <SectionHeader
                    section={section}
                    showLinkCount={showLinkCount}
                    isMinimzied={minimize}
                    onContextMenu={(v) => setContextMenuOpen(v)}
                    onMinimize={() => setMinimize(!minimize)}
                />
            </ErrorManager>
    
            <ConditionalRender render={!minimize}>
                <ErrorManager>
                    <LinksLayout
                        id={section.id}
                        links={currentSection.title !== "" ? currentSection.links : section.links} /* Switch To Current Section For Filter */ 
                        layout={section.links_layout} 
                    />
                </ErrorManager>
            </ConditionalRender>
        </Box>
    )
}

export const Section = memo(NonMemSection, areSectionsEqual);