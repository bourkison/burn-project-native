import {PostStackParamList} from '@/nav/PostNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const PostView = ({
    route,
}: NativeStackScreenProps<PostStackParamList, 'PostView'>) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {route.params.post?.content || 'Test'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A1F25',
        height: '100%',
    },
    text: {
        color: '#f3fcf0',
    },
});

export default PostView;
