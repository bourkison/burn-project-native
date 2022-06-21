import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WorkoutHome from '@/screens/Workout/WorkoutHome';

const Stack = createNativeStackNavigator();

export type WorkoutStackParamList = {
    WorkoutHome: undefined;
};

const WorkoutNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="WorkoutHome">
            <Stack.Screen
                name="WorkoutHome"
                component={WorkoutHome}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
};

export default WorkoutNavigator;
