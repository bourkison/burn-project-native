import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ExerciseHome from '@/screens/Exercise/ExerciseHome';

const Stack = createNativeStackNavigator();

export type ExerciseStackParamList = {
    ExerciseHome: undefined;
};

const ExerciseNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="ExerciseHome">
            <Stack.Screen
                name="ExerciseHome"
                component={ExerciseHome}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
};

export default ExerciseNavigator;
