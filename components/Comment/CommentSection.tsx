import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import AnimatedButton from '@/components/Utility/AnimatedButton';
import {createLike, deleteLike} from '@/store/services';

type CommentSectionProps = {
    docId: string;
    coll: 'post' | 'exercise' | 'template';
    likeCount: number;
    commentCount: number;
    followCount?: number;
    followableComponent: boolean;
    isLiked: boolean;
    isFollowed: boolean;
    isFollowable: boolean;
    onLike?: Function;
    onComment?: Function;
};

const CommentSection: React.FC<CommentSectionProps> = ({
    likeCount,
    commentCount,
    onLike,
    docId,
    coll,
    isLiked,
    onComment,
}) => {
    const [isLiking, setIsLiking] = useState(false);

    const likeHandler = async () => {
        if (!isLiking) {
            setIsLiking(true);

            if (onLike) {
                onLike();
            }

            const init = {
                queryStringParameters: {
                    docId: docId,
                    coll: coll,
                },
            };

            if (!isLiked) {
                try {
                    await createLike({init});
                    console.log('Like created');
                } catch (err) {
                    // TODO: Better error handling.
                    console.error(err);
                } finally {
                    setIsLiking(false);
                }
            } else {
                try {
                    await deleteLike({init});
                    console.log('Like deleted');
                } catch (err) {
                    // TODO: Better error handling.
                    console.error(err);
                } finally {
                    setIsLiking(false);
                }
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.leftCont}>
                <AnimatedButton
                    onPress={likeHandler}
                    content={
                        <Icon
                            name={isLiked ? 'heart' : 'heart-o'}
                            color={isLiked ? '#ce3b54' : '#f3fcf0'}
                            size={20}
                            style={styles.icon}
                        />
                    }
                    style={{}}
                    textStyle={{}}
                />
                <AnimatedButton
                    onPress={() => {
                        onComment ? onComment() : null;
                    }}
                    content={
                        <Icon
                            name={'comment-o'}
                            color="#f3fcf0"
                            size={20}
                            style={styles.icon}
                        />
                    }
                    style={{}}
                    textStyle={{}}
                />
            </View>
            <View style={styles.rightCont}>
                <Text style={styles.counters}>{commentCount} comments</Text>
                <Text style={styles.counters}>{likeCount} likes</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
    },
    leftCont: {
        flexDirection: 'row',
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 12,
        paddingBottom: 10,
        // backgroundColor: 'red',
    },
    icon: {
        marginRight: 5,
    },
    rightCont: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    counters: {
        color: '#f3fcf0',
        marginLeft: 5,
    },
});

export default CommentSection;
