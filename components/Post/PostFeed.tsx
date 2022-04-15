import {queryPost} from '@/store/services';
import {PostReference} from '@/types/post';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, StyleSheet} from 'react-native';
import PostComponent from '@/components/Post/PostComponent';

const PostFeed = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState<PostReference[]>([]);

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
                console.error(err);
            }
        };

        fetchPosts();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {isLoading ? (
                <Text>Loading</Text>
            ) : (
                posts.map(post => (
                    <PostComponent postReference={post} key={post._id} />
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
});

export default PostFeed;
