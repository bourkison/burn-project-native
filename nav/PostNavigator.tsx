import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PostHome from '@/screens/Post/PostHome';
import PostView from '@/screens/Post/PostView';
import {Post} from '@/types/post';

export type PostStackParamList = {
    PostHome: undefined;
    PostView: {
        post?: Post;
    };
};

const Stack = createNativeStackNavigator<PostStackParamList>();

const PostNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="PostHome">
            <Stack.Screen
                name="PostHome"
                component={PostHome}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="PostView"
                component={PostView}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
};

export default PostNavigator;
