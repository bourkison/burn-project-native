import {queryPost} from '@/store/services';
import {PostReference} from '@/types/post';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, StyleSheet, View} from 'react-native';
import AnimatedButton from '../Utility/AnimatedButton';
import PostComponent from '@/components/Post/PostComponent';
import {useAppDispatch} from '@/store/hooks';
import {logout} from '@/store/slices/user';

const PostFeed = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState<PostReference[]>([]);

    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            console.log('Fetching...');

            try {
                setPosts(
                    await queryPost({
                        init: {queryStringParameters: {loadAmount: 5}},
                    }),
                );
                setIsLoading(false);
            } catch (err) {
                // TODO: Better error handling.
                console.error(err);
            }
        };

        fetchPosts();
    }, []);

    const logoutButton = () => {
        dispatch(logout());
    };

    return (
        <ScrollView style={styles.container}>
            {isLoading ? (
                <Text>Loading</Text>
            ) : (
                posts.map(post => (
                    <PostComponent postReference={post} key={post._id} />
                ))
            )}

            <View>
                <AnimatedButton
                    pressedColor="#D5576C"
                    style={styles.logoutButton}
                    textStyle={styles.logoutButtonText}
                    onPress={logoutButton}>
                    Logout
                </AnimatedButton>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    logoutButton: {
        width: '90%',
        backgroundColor: '#ce3b54',
        borderRadius: 5,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
        marginBottom: 5,
    },
    logoutButtonText: {
        color: '#f3fcf0',
        fontSize: 14,
        paddingVertical: 8,
        alignSelf: 'center',
    },
});

export default PostFeed;
