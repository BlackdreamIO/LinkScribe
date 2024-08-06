import Dexie from 'dexie';
import { LinkScheme } from '@/scheme/Link';
import { SectionScheme } from '@/scheme/Section';

// Define your database
class LinkScribeDexie extends Dexie {
    sections: Dexie.Table<SectionScheme, string>;
    links: Dexie.Table<LinkScheme, string>;

    constructor() {
        super('LinkScribeDexie');
        this.version(1).stores({
            sections: 'id, section_ref, title, created_at',
            links: 'id, section_ref, title, url, created_at'
        })

        this.sections = this.table('sections');
        this.links = this.table('links');
    }
}

// Initialize the database
export const DexieDB = new LinkScribeDexie();
