'use client';
import { persistor, store } from '@/redux/store';
import { Provider } from 'react-redux';
import { FC, ReactNode } from 'react';
import { PersistGate } from 'redux-persist/integration/react';

interface IProps {
    children: ReactNode;
}

const ReduxProviders: FC<IProps> = ({ children }) => {
    return (
        <>
            <Provider store={store}>
                <PersistGate persistor={persistor}>{children}</PersistGate>
            </Provider>
        </>
    );
};

export default ReduxProviders;