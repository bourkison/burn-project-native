import React, {useEffect, useState} from 'react';
import {Exercise, ExerciseReference} from '@/types/exercise';
import {useWindowDimensions, View, StyleSheet} from 'react-native';
import {getExercise} from '@/store/services';
import {Storage} from 'aws-amplify';
// @ts-ignore
import {SliderBox} from 'react-native-image-slider-box';
import RenderHtml from 'react-native-render-html';
import CommentSection from '../Comment/CommentSection';
import PostSkeleton from '@/components/Post/PostSkeleton';

type ExerciseComponentProps = {
    exerciseReference: ExerciseReference;
};

const ExerciseComponent: React.FC<ExerciseComponentProps> = ({
    exerciseReference,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [exercise, setExercise] = useState<Exercise>();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const {width} = useWindowDimensions();
    const sliderHeight = width / 0.9;

    useEffect(() => {
        const fetchExercise = async () => {
            setIsLoading(true);
            console.log('Fetching exercise:', exerciseReference.exerciseId);
            const data = await getExercise({
                exerciseId: exerciseReference.exerciseId,
                init: {queryStringParameters: {counters: true}},
            });
            console.log('Exercise:', exerciseReference.exerciseId, 'fetched.');

            if (data) {
                setExercise(data);
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

        fetchExercise();
    }, [exerciseReference.exerciseId]);

    return (
        <View>
            {isLoading ? (
                <PostSkeleton />
            ) : (
                <View style={styles.card}>
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
                            source={{html: exercise?.description || ''}}
                            baseStyle={styles.content}
                        />
                    </View>

                    <View style={styles.commentBarContainer}>
                        <CommentSection
                            docId={exercise?._id || ''}
                            coll="exercise"
                            likeCount={likeCount}
                            commentCount={commentCount}
                            followableComponent={true}
                            isLiked={isLiked}
                            isFollowed={true}
                            isFollowable={true}
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
        flex: 1,
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

export default ExerciseComponent;
