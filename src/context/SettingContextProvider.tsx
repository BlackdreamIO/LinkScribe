'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { AutoSyncTimeType, DefaultExportType, KeyboardShortcutStatusType, LinkLayoutType } from '@/types/SettingTypes';
import useLocalStorage from '@/hook/useLocalStorage';

export const dynamic = 'force-dynamic';

interface ISettingGeneral {
    homeView: string;
    setHomeView: Dispatch<SetStateAction<string>>;

    showLinkCount: boolean;
    setShowLinkCount: Dispatch<SetStateAction<boolean>>;

    autoSyncTime: AutoSyncTimeType;
    setAutoSyncTime: Dispatch<SetStateAction<AutoSyncTimeType>>;

    sidebarDefaultOpen: boolean;
    setSidebarDefaultOpen: Dispatch<SetStateAction<boolean>>;

    sectionsDefaultOpen: boolean;
    setSectionsDefaultOpen: Dispatch<SetStateAction<boolean>>;

    linkLayoutDefaultSize: number;
    setLinkLayoutDefaultSize: Dispatch<SetStateAction<number>>;

    keyboardShortcutStatus: KeyboardShortcutStatusType;
    setKeyboardShortcutStatus: Dispatch<SetStateAction<KeyboardShortcutStatusType>>;

    defaultExportType: DefaultExportType;
    setDefaultExportType: Dispatch<SetStateAction<DefaultExportType>>;
}

interface ISettingAudio {
    applicationStartUpSound: boolean;
    setApplicationStartUpSound: Dispatch<SetStateAction<boolean>>;

    sectionCreateSound: boolean;
    setSectionCreateSound: Dispatch<SetStateAction<boolean>>;

    sectionDeleteSound: boolean;
    setSectionDeleteSound: Dispatch<SetStateAction<boolean>>;

    systemsNotificationSound: boolean;
    setSystemsNotificationSound: Dispatch<SetStateAction<boolean>>;

    keyboardNavigationSound: boolean;
    setKeyboardNavigationSound: Dispatch<SetStateAction<boolean>>;
}


export interface SettingContextType extends ISettingGeneral, ISettingAudio {};

interface ISettings {
    homeView : string;
    autoSyncTime : AutoSyncTimeType;
    sidebarDefaultOpen : boolean;
    sectionsDefaultOpen : boolean;
    
    keyboardShortcutStatus : KeyboardShortcutStatusType;
    defaultExportType : DefaultExportType;
    showLinkCount : boolean;
    linkLayoutDefaultSize : number;

    applicationStartUpSound: boolean;
    sectionCreateSound: boolean;
    sectionDeleteSound: boolean;
    systemsNotificationSound: boolean;
    keyboardNavigationSound: boolean;
}

type SettingContextProviderProps = {
    children : ReactNode;
}

const initialSettings : ISettings = {
    homeView : "Overview",
    autoSyncTime : "1 Day",
    defaultExportType : "Txt",
    keyboardShortcutStatus : "Full Controll",
    sectionsDefaultOpen : true,
    sidebarDefaultOpen : true,
    showLinkCount : true,
    linkLayoutDefaultSize : 3,

    applicationStartUpSound: true,
    sectionCreateSound: true,
    sectionDeleteSound: true,
    systemsNotificationSound: true,
    keyboardNavigationSound: true,
}

const SettingContext = createContext<SettingContextType | undefined>(undefined);

export const useSettingContext = () => useContext(SettingContext)!;

export const SettingContextProvider = ({children} : SettingContextProviderProps) => {

    const [_, __, getLocalStorageDataByKey, setLocalStorageDataByKey] = useLocalStorage<ISettings>("null", initialSettings);

    // General --
    const [homeView, setHomeView] = useState<string>("");
    const [showLinkCount, setShowLinkCount] = useState<boolean>(false);
    const [sidebarDefaultOpen, setSidebarDefaultOpen] = useState<boolean>(false);
    const [sectionsDefaultOpen, setSectionsDefaultOpen] = useState<boolean>(false);
    const [linkLayoutDefaultSize, setLinkLayoutDefaultSize] = useState<number>(3);
    const [autoSyncTime, setAutoSyncTime] = useState<AutoSyncTimeType>("1 Day");
    const [keyboardShortcutStatus, setKeyboardShortcutStatus] = useState<KeyboardShortcutStatusType>("Full Controll");
    const [defaultExportType, setDefaultExportType] = useState<DefaultExportType>("Txt");
   
    // Audio --
    const [applicationStartUpSound, setApplicationStartUpSound] = useState<boolean>(false);
    const [sectionCreateSound, setSectionCreateSound] = useState<boolean>(false);
    const [sectionDeleteSound, setSectionDeleteSound] = useState<boolean>(false);
    const [systemsNotificationSound, setSystemsNotificationSound] = useState<boolean>(false);
    const [keyboardNavigationSound, setKeyboardNavigationSound] = useState<boolean>(false);

    useEffect(() => {
        if(getLocalStorageDataByKey("appSettings")) {
            const exist = getLocalStorageDataByKey("appSettings");
            if(exist) {
                const settings : ISettings | any = getLocalStorageDataByKey("appSettings")!;
                if(settings) {
                    const x : ISettings = settings;

                    // General 
                    setHomeView(x.homeView);
                    setAutoSyncTime(x.autoSyncTime);
                    setShowLinkCount(x.showLinkCount);
                    setSidebarDefaultOpen(x.sidebarDefaultOpen);
                    setSectionsDefaultOpen(x.sectionsDefaultOpen);
                    setKeyboardShortcutStatus(x.keyboardShortcutStatus);
                    setDefaultExportType(x.defaultExportType);
                    setLinkLayoutDefaultSize(x.linkLayoutDefaultSize);

                    // Audio
                    setApplicationStartUpSound(x.applicationStartUpSound);
                    setSectionCreateSound(x.sectionCreateSound);
                    setSectionDeleteSound(x.sectionDeleteSound);
                    setSystemsNotificationSound(x.systemsNotificationSound);
                    setKeyboardNavigationSound(x.keyboardNavigationSound)
                }
            }
        }
    }, [])

    useEffect(() => {
        const currentTimeout = setTimeout(() => {
            const generalSettings = {
                homeView : homeView,
                autoSyncTime : autoSyncTime,
                showLinkCount : showLinkCount,
                sidebarDefaultOpen : sidebarDefaultOpen,
                sectionsDefaultOpen : sectionsDefaultOpen,
                keyboardShortcutStatus : keyboardShortcutStatus,
                defaultExportType : defaultExportType,
                linkLayoutDefaultSize : linkLayoutDefaultSize,
            }

            const audioSettings = {
                applicationStartUpSound : applicationStartUpSound,
                keyboardNavigationSound : keyboardNavigationSound,
                sectionCreateSound : sectionCreateSound,
                sectionDeleteSound : sectionDeleteSound,
                systemsNotificationSound : systemsNotificationSound
            }

            const settings : ISettings = {...generalSettings, ...audioSettings};
    
            setLocalStorageDataByKey("appSettings", settings);
        }, 200);

        return () => clearTimeout(currentTimeout);
    }, [
        homeView, 
        autoSyncTime,
        showLinkCount,
        sidebarDefaultOpen,
        sectionsDefaultOpen,
        linkLayoutDefaultSize,
        keyboardShortcutStatus,
        defaultExportType,

        applicationStartUpSound,
        keyboardNavigationSound,
        sectionCreateSound,
        sectionDeleteSound,
        setLinkLayoutDefaultSize,
        systemsNotificationSound
    ])
    
    

    const contextValue: SettingContextType = {
        homeView,
        setHomeView,
        showLinkCount,
        setShowLinkCount,
        autoSyncTime,
        setAutoSyncTime,
        sidebarDefaultOpen,
        setSidebarDefaultOpen,
        sectionsDefaultOpen,
        setSectionsDefaultOpen,
        keyboardShortcutStatus,
        setKeyboardShortcutStatus,
        defaultExportType,
        setDefaultExportType,
        linkLayoutDefaultSize,
        setLinkLayoutDefaultSize,

        applicationStartUpSound,
        sectionCreateSound,
        sectionDeleteSound,
        setApplicationStartUpSound,
        keyboardNavigationSound,
        setKeyboardNavigationSound,
        setSectionCreateSound,
        setSectionDeleteSound,
        setSystemsNotificationSound,
        systemsNotificationSound,
    };

    return (
        <SettingContext.Provider value={contextValue}>
            {children}
        </SettingContext.Provider>
    )
}