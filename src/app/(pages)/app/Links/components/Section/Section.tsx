'use client';

import { useState, useEffect, memo } from 'react';
import { SectionScheme } from '@/scheme/Section';

import { useSettingContext } from '@/context/SettingContextProvider';
import { useSectionContext } from '@/context/SectionContextProvider';
import { useSectionContainerContext } from '@/context/SectionContainerContext';

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

    const { setCurrentSection, currentSection, setOriginalSection } = useSectionContext();
    const { sectionHighlighted } = useSectionContainerContext();
    const { showLinkCount } = useSettingContext();

    useEffect(() => {
        if(section) {
            setCurrentSection(section);
            setOriginalSection(section);
        }
    }, [section]); // eslint-disable-line react-hooks/exhaustive-deps
    

    return (
        <Box
            onContextMenu={(e) => e.preventDefault()}
            id="section"
            className={`w-full dark:bg-theme-bgFourth bg-white border-[2px] rounded-2xl flex flex-col justify-center space-y-4 transition-all duration-300
                ${contextMenuOpen && !sectionHighlighted ? 'border-indigo-300' : sectionHighlighted ? 'dark:border-white border-black ' : 'dark:border-neutral-900 '}
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