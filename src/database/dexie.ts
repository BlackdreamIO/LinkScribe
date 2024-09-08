import Dexie from 'dexie';
import { LinkScheme } from '@/scheme/Link';
import { SectionScheme } from '@/scheme/Section';
import { MainLayout } from '@/interface/MainLayout';
import { AppTheme } from '@/interface/AppTheme';

// Define your database
class LinkScribeDexie extends Dexie {
    sections: Dexie.Table<SectionScheme, string>;
    links: Dexie.Table<LinkScheme, string>;
    appLayout : Dexie.Table<MainLayout, string>;
    appTheme : Dexie.Table<AppTheme, string>;

    constructor() {
        super('LinkScribeDexie');
        this.version(1).stores({
            sections: 'id, section_ref, title, created_at',
            links: 'id, section_ref, title, url, created_at',
            appLayout : '',
            appTheme : ''
        })

        this.sections = this.table('sections');
        this.links = this.table('links');
        this.appLayout = this.table("appLayout");
        this.appTheme = this.table("appTheme");

        
        this.sections.hook("creating", function (table, data) {
            console.log("creating", table, data);
        })
    }
}

// Initialize the database
export const DexieDB = new LinkScribeDexie();
