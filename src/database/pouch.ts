import PouchDB from 'pouchdb';
import PouchDBLocalStorageAdapter from 'pouchdb-adapter-localstorage';

PouchDB.plugin(PouchDBLocalStorageAdapter);

const db = new PouchDB('link-scribe');
export default db;