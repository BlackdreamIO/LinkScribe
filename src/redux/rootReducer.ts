import { persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import sectionSlice from "./features/section/sectionSlice";

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    //blacklist: ['sectionSlice']
};

const combinedReducers = combineReducers({
    sectionSlice : sectionSlice
});

export const persistedReducer = persistReducer(persistConfig, combinedReducers);
