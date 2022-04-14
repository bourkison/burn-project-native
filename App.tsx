/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import FlashMessage from 'react-native-flash-message';

import Navigator from '@/nav/Navigator';

import store from '@/store';
import {fetchUser} from '@/store/slices/user';
import {useEffect} from 'react';

const App = () => {
    useEffect(() => {
        async function initFetch() {
            store.dispatch(fetchUser());
        }

        try {
            initFetch();
        } catch {
            console.log('No logged in user. Proceeding.');
        }
    }, []);

    return (
        <Provider store={store}>
            <GestureHandlerRootView style={{flex: 1}}>
                <NavigationContainer>
                    <Navigator />
                    <FlashMessage position="bottom" />
                </NavigationContainer>
            </GestureHandlerRootView>
        </Provider>
    );
};

export default App;
