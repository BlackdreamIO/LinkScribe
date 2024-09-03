"use client"

import { useEffect, useRef, useState } from 'react';
import { ISkill, SKILLS } from '@/lib/Skills';

import Xarrow from "react-xarrows";

import { Box, Flex, HStack, Text } from '@chakra-ui/react'
import Image from 'next/image'

export const Skills = () => {

    const stacksRef = useRef<HTMLDivElement>(null);

    const [isReady, setIsReady] = useState(false);
    const [renderArrows, setRenderArrows] = useState(false);

    const XArrows = [...new Set(SKILLS.map(skill => skill.category))];
    const XArrowsColors = ["cyan", "lime", "red", "gray"]

    useEffect(() => {
        // Delay rendering of arrows
        const timer = setTimeout(() => {
            setIsReady(true);
            setRenderArrows(true);
        }, 100); // Adjust the timeout if necessary

        return () => clearTimeout(timer);
    }, []);

    const SkillCategory = ({ category, skills, id }: { id : string, category: string, skills: ISkill[] }) => (
        <Box className='space-y-4'>
            <Text className='text-neutral-300 font-semibold text-xl capitalize'>{category}</Text>
            <Box id={id} 
                className='w-96 p-2 rounded-xl gap-4 flex flex-row flex-wrap items-center justify-center bg-neutral-950/30 backdrop-filter backdrop-blur-lg border border-neutral-800'
            >

                {skills.filter(skill => skill.category === category).map((skill, index) => (
                    <Box key={index} className='flex flex-col items-center justify-center'>
                        <Image
                            src={skill.src}
                            alt={skill.title}
                            width={64}
                            height={64}
                            className='border-2 border-neutral-900 rounded-xl bg-neutral-900 p-2 max-sm:w-12'
                        />
                        <Text className='text-neutral-400 text-center'>{skill.title}</Text>
                    </Box>
                ))}
            </Box>
        </Box>
    );

    return (
        <Box className='w-full px-4 flex flex-col items-center justify-center py-4 min-h-screen h-screen max-h-auto bg-black bg-dot-white/[0.1] space-y-16 relative'>
            
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            
            <Text ref={stacksRef} id="tech-stack" className='text-white text-3xl text-center px-4 py-2 bg-neutral-900 rounded-xl'>Tech Stack</Text>

            <HStack className='flex flex-row flex-wrap items-center justify-center gap-4 z-30'>
                <SkillCategory id='language' category="language" skills={SKILLS} />
                <SkillCategory id='tools' category="tools" skills={SKILLS} />
                <SkillCategory id='frontend' category="frontend" skills={SKILLS} />
                <SkillCategory id='backend' category="backend" skills={SKILLS} />
                <SkillCategory id='database' category="database" skills={SKILLS} />
                <SkillCategory id='deployment' category="deployment" skills={SKILLS} />
            </HStack>

            {renderArrows && isReady && XArrows.map((end, index) => (
                <Xarrow
                    key={index}
                    start="tech-stack"
                    end={end}
                    showHead={true}
                    color={"rgb(40,40,40)"}
                    strokeWidth={2}
                    curveness={0.5}
                    path='smooth'
                    zIndex={0}
                    endAnchor={'top'}
                    headShape={"arrow1"}
                    showTail
                    tailShape={"circle"}
                />
            ))}
        </Box>
    )
}
