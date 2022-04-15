import React, {useEffect, useState} from 'react';
import {Post, PostReference} from '@/types/post';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {getPost} from '@/store/services';
import PostSkeleton from './PostSkeleton';
import CommentSection from '../Comment/CommentSection';
// @ts-ignore
import {SliderBox} from 'react-native-image-slider-box';
import {Storage} from 'aws-amplify';
import RenderHtml from 'react-native-render-html';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainTabParamList} from '@/nav/Navigator';

type PostComponentProps = {
    postReference: PostReference;
};

const PostComponent: React.FC<PostComponentProps> = ({postReference}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [post, setPost] = useState<Post>();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const {width} = useWindowDimensions();
    const sliderHeight = width / 0.9;

    const navigation =
        useNavigation<NativeStackNavigationProp<MainTabParamList>>();

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true);
            const data = await getPost({postId: postReference._id, init: {}});

            if (data) {
                setPost(data);
                setIsLiked(data.isLiked);
                setLikeCount(data.likeCount);
                setCommentCount(data.commentCount);

                if (
                    data.filePaths.length &&
                    data.filePaths[0].fileType === 'image'
                ) {
                    const urlPromises: Promise<string>[] = [];
                    const temp: string[] = [];

                    data.filePaths.forEach(file => {
                        urlPromises.push(Storage.get(file.key));
                    });

                    const urls = await Promise.all(urlPromises);
                    urls.forEach(url => {
                        temp.push(url);
                    });
                    setImageUrls(temp);
                }
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

    const commentHandler = () => {
        navigation.navigate('Post', {screen: 'PostView', params: {post: post}});
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

                    {imageUrls && imageUrls.length ? (
                        <View>
                            <SliderBox
                                images={imageUrls}
                                sliderBoxHeight={sliderHeight}
                            />
                        </View>
                    ) : (
                        <View />
                    )}

                    <View style={styles.contentContainer}>
                        <RenderHtml
                            contentWidth={width}
                            source={{html: post?.content || ''}}
                            baseStyle={styles.content}
                        />
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
                            onComment={commentHandler}
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: '#272f38',
        shadowColor: 'rgba(243, 252, 240, 0.3)',
        shadowOffset: {
            width: 3,
            height: 4,
        },
        shadowOpacity: 0.24,
        shadowRadius: 3,
        marginBottom: 20,
    },
    skeleton: {
        marginBottom: 10,
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
