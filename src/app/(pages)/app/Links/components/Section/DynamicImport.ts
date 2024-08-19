import dynamic from 'next/dynamic';

export const DropdownMenu = dynamic(() => import('@/components/ui/dropdown-menu').then((mod) => mod.DropdownMenu), { ssr: true });
export const DropdownMenuItem = dynamic(() => import('@/components/ui/dropdown-menu').then((mod) => mod.DropdownMenuItem), { ssr: true });
export const DropdownMenuLabel = dynamic(() => import('@/components/ui/dropdown-menu').then((mod) => mod.DropdownMenuLabel), { ssr: true });
export const DropdownMenuSeparator = dynamic(() => import('@/components/ui/dropdown-menu').then((mod) => mod.DropdownMenuSeparator), { ssr: true });
export const DropdownMenuTrigger = dynamic(() => import('@/components/ui/dropdown-menu').then((mod) => mod.DropdownMenuTrigger), { ssr: true });
export const DropdownMenuContent = dynamic(() => import('@/components/ui/dropdown-menu').then((mod) => mod.DropdownMenuContent), { ssr: true });


export const ContextMenu = dynamic(() => import('@radix-ui/react-context-menu').then((mod) => mod.ContextMenu), { ssr: true });
export const ContextMenuContent = dynamic(() => import('@radix-ui/react-context-menu').then((mod) => mod.ContextMenuContent), { ssr: true });
export const ContextMenuItem = dynamic(() => import('@radix-ui/react-context-menu').then((mod) => mod.ContextMenuItem), { ssr: true });
export const ContextMenuTrigger = dynamic(() => import('@radix-ui/react-context-menu').then((mod) => mod.ContextMenuTrigger), { ssr: true });

export const SectionHeaderLinkDrawer = dynamic(() => import('./SectionHeaderLinkDrawer').then((mod) => mod.SectionHeaderLinkDrawer), { ssr: true });
export const SectionTransferer = dynamic(() => import('./SectionTransferer').then((mod) => mod.SectionTransferer), { ssr: true });