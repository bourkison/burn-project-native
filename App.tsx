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
import {
    SafeAreaView,
    // StatusBar,
    StyleSheet,
    useColorScheme,
} from 'react-native';
import {Provider} from 'react-redux';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Login from './src/screens/Login';

import store from './src/store';

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <Provider store={store}>
            <SafeAreaView
                style={{
                    ...styles.container,
                    backgroundColor: backgroundStyle.backgroundColor,
                }}>
                <Login />
            </SafeAreaView>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default App;
