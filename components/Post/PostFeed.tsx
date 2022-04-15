import {queryPost} from '@/store/services';
import {PostReference} from '@/types/post';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text} from 'react-native';
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
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <ScrollView>
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

export default PostFeed;
