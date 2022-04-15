import React, {useEffect, useState} from 'react';
import {Post, PostReference} from '@/types/post';
import {StyleSheet, Text, View} from 'react-native';
import {getPost} from '@/store/services';
import PostSkeleton from './PostSkeleton';
import CommentSection from '../Comment/CommentSection';

type PostComponentProps = {
    postReference: PostReference;
};

const PostComponent: React.FC<PostComponentProps> = ({postReference}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [post, setPost] = useState<Post>();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true);
            const data = await getPost({postId: postReference._id, init: {}});

            if (data) {
                setPost(data);
                setIsLiked(data.isLiked);
                setLikeCount(data.likeCount);
                setCommentCount(data.commentCount);
            }

            setIsLoading(false);
        };

        fetchPost();
    }, [postReference._id]);

    const likeHandler = () => {
        if (post) {
            if (!isLiked) {
                setLikeCount(likeCount + 1);
            } else {
                setLikeCount(likeCount - 1);
            }

            setIsLiked(!isLiked);
        }
    };

    return (
        <View>
            {isLoading ? (
                <PostSkeleton />
            ) : (
                <View style={styles.card}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>
                            {post?.createdBy.username}
                        </Text>
                    </View>

                    <View style={styles.contentContainer}>
                        <Text style={styles.content}>{post?.content}</Text>
                    </View>

                    <View style={styles.commentBarContainer}>
                        <CommentSection
                            docId={post?._id || ''}
                            coll="post"
                            likeCount={likeCount}
                            commentCount={commentCount}
                            followableComponent={true}
                            isLiked={isLiked}
                            isFollowed={true}
                            isFollowable={true}
                            onLike={likeHandler}
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
        height: 50,
    },
    card: {
        width: '100%',
        backgroundColor: '#343E4B',
        shadowColor: 'rgba(243, 252, 240, 0.3)',
        shadowOffset: {
            width: 3,
            height: 4,
        },
        shadowOpacity: 0.24,
        shadowRadius: 3,
    },
    headerContainer: {
        paddingBottom: 20,
        paddingHorizontal: 25,
        paddingTop: 25,
        borderBottomColor: 'rgba(243, 252, 240, 0.3)',
        borderBottomWidth: 1,
    },
    header: {
        color: '#f3fcf0',
        fontSize: 14,
        fontWeight: 'bold',
    },
    contentContainer: {
        paddingTop: 20,
        paddingHorizontal: 25,
        paddingBottom: 25,
        borderBottomColor: 'rgba(243, 252, 240, 0.3)',
        borderBottomWidth: 1,
    },
    content: {
        color: '#f3fcf0',
        fontSize: 14,
        fontWeight: 'normal',
    },
    commentBarContainer: {},
});

export default PostComponent;
