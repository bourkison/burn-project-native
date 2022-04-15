import React, {useEffect, useState} from 'react';
import {Post, PostReference} from '@/types/post';
import {StyleSheet, Text, View} from 'react-native';
import {getPost} from '@/store/services';
import PostSkeleton from './PostSkeleton';

type PostComponentProps = {
    postReference: PostReference;
};

const PostComponent: React.FC<PostComponentProps> = ({postReference}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [post, setPost] = useState<Post>();

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true);
            setPost(await getPost({postId: postReference._id, init: {}}));
            setIsLoading(false);
        };

        fetchPost();
    }, [postReference._id]);

    return (
        <View>
            <Text>{post?.content}</Text>
            <PostSkeleton />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
        height: 50,
    },
});

export default PostComponent;
