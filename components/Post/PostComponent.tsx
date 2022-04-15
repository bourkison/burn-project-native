import React, {useEffect, useState} from 'react';
import {Post, PostReference} from '@/types/post';
import {StyleSheet, Text, View} from 'react-native';
import {getPost} from '@/store/services';

type PostComponentProps = {
    postReference: PostReference;
};

const PostComponent: React.FC<PostComponentProps> = ({postReference}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [post, setPost] = useState<Post | undefined>();

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
            {!isLoading && post ? (
                <Text>{post.content}</Text>
            ) : (
                <Text>Loading</Text>
            )}
        </View>
    );
};

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'red',
//         height: 50,
//     },
// });

export default PostComponent;
