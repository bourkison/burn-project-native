import {PostStackParamList} from '@/nav/PostNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {View, Text} from 'react-native';

const PostView = ({
    route,
}: NativeStackScreenProps<PostStackParamList, 'PostView'>) => {
    return (
        <View>
            <Text>{route.params.post?.content || 'Test'}</Text>
        </View>
    );
};

export default PostView;
