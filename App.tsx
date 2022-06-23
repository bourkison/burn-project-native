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
import {FETCH_USER} from '@/store/slices/user';
import {useEffect} from 'react';
import {StyleSheet} from 'react-native';

const App = () => {
    useEffect(() => {
        async function initFetch() {
            store.dispatch(FETCH_USER());
        }

        try {
            initFetch();
        } catch {
            console.log('No logged in user. Proceeding.');
        }
    }, []);

    return (
        <Provider store={store}>
            <GestureHandlerRootView style={styles.flex}>
                <NavigationContainer>
                    <Navigator />
                    <FlashMessage position="bottom" />
                </NavigationContainer>
            </GestureHandlerRootView>
        </Provider>
    );
};

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
});

export default App;
