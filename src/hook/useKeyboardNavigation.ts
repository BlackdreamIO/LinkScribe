import { useEffect } from 'react';

interface UseKeyboardNavigationProps {
  role: string;
  direction?: "horizontal" | "vertical" | "both";
  mouseInterruptFocus? : boolean;
  parentRef: React.RefObject<HTMLElement>;
  enable? : boolean;
}

export const useKeyboardNavigation = ({ role, parentRef, direction = "both", enable = true }: UseKeyboardNavigationProps) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            
            if(!enable) return;

            const parentElement = parentRef.current;
            if (!parentElement) return;

            const tabElements = Array.from(parentElement.querySelectorAll(`[role="${role}"]`)) as HTMLElement[];
            const currentIndex = tabElements.findIndex(tab => tab === document.activeElement);

            switch (event.key)
            {
                case 'ArrowRight':
                    if (direction === 'horizontal' || direction === 'both') {
                        const nextIndexRight = (currentIndex + 1) % tabElements.length;
                        tabElements[nextIndexRight]?.focus();
                    }
                    break;

                case 'ArrowLeft':
                    if (direction === 'horizontal' || direction === 'both') {
                        const nextIndexLeft = (currentIndex - 1 + tabElements.length) % tabElements.length;
                        tabElements[nextIndexLeft]?.focus();
                    }
                    break;

                case 'ArrowDown':
                    if (direction === 'vertical' || direction === 'both') {
                        const nextIndexDown = (currentIndex + 1) % tabElements.length;
                        tabElements[nextIndexDown]?.focus();
                    }
                    break;

                case 'ArrowUp':
                    if (direction === 'vertical' || direction === 'both') {
                        const nextIndexUp = (currentIndex - 1 + tabElements.length) % tabElements.length;
                        tabElements[nextIndexUp]?.focus();
                    }
                    break;

                case 'Escape':
                    (document.activeElement as HTMLElement)?.blur();
                    break;
                
                default:
                    break;
            }
        }

        const parentElement = parentRef.current;
        
        if (parentElement) {
            parentElement.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (parentElement) {
                parentElement.removeEventListener('keydown', handleKeyDown);
            }
        }
    }, [role, parentRef, direction])
}
