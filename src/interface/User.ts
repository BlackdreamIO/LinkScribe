import { AutoSyncTimeType, DefaultExportType, KeyboardShortcutStatusType } from "@/types/SettingTypes";

export interface IAppSettings {
    theme: "dark",
    homeview: "Search",
    showLinkCont: false,
    syncInterval: AutoSyncTimeType,
    defaultExport: DefaultExportType,
    keyboardShortcut: KeyboardShortcutStatusType,
    sidebarDefaultOpen: false,
    defaultSectionCollapse: false
}
export interface IDatabaseUser {
    id: string;
    user_email: string;
    subcription: string;
    created_at: Date;
    settings : IAppSettings
}