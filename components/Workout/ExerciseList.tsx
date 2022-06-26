import React, {ReactElement, useState} from 'react';
import {RecordedExercise} from '@/types/workout';
import SortableExercise from './SortableExercise';
import Animated, {
    runOnJS,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import {View} from 'react-native';

type ExerciseListProps = {
    exercises: RecordedExercise[];
    children: ReactElement[];
};

export type Offset = {
    order: SharedValue<number>;
    width: number;
    height: number;
    x: SharedValue<number>;
    y: SharedValue<number>;
    originalX: number;
    originalY: number;
    uid: string;
    ready: boolean;
};

const ExerciseList: React.FC<ExerciseListProps> = ({children, exercises}) => {
    const [allElementsReady, setAllElementsReady] = useState(false);
    const [offsets, setOffsets] = useState<Offset[]>([]);

    const sHeight = useSharedValue(1);

    const rStyle = useAnimatedStyle(() => {
        return {
            flex: 1,
            height: sHeight.value,
            flexShrink: 0,
            flexGrow: 0,
            overflow: 'hidden',
            backgroundColor: 'blue',
            width: '100%',
        };
    });

    const onChildMount = (offset: Offset) => {
        setOffsets([...offsets, offset]);
        setAllElementsReady(false);
    };

    const onChildReady = (offset: Offset) => {
        const index = offsets.findIndex(o => o.uid === offset.uid);

        console.log('ON CHILD READY.', offsets.length);

        if (index > -1) {
            let items = offsets;
            items[index] = offset;
            setOffsets(items);

            console.log('INDEX FOUND:', offset);

            if (items.filter(i => !i.ready).length === 0) {
                setAllElementsReady(true);
                initCalculateLayout();
                // console.log('ALL ELEMENTS READY:', height);
            }
        } else {
            console.error('Error finding index.');
        }
    };

    const onChildUnmount = (uid: string) => {
        const index = offsets.findIndex(o => o.uid === uid);
        console.log('INDEX:', index);
    };

    const changeOrder = (from: number, to: number) => {
        'worklet';

        const fromIndex = offsets.findIndex(x => x.order.value === from);
        const toIndex = offsets.findIndex(x => x.order.value === to);

        if (fromIndex > -1 && toIndex > -1) {
            let tempArr = offsets;

            tempArr[fromIndex].order.value = to;
            tempArr[toIndex].order.value = from;

            runOnJS(setOffsets)(tempArr);
        }
    };

    // Called when all children are ready.
    const initCalculateLayout = () => {
        let tempArr = offsets;
        tempArr.forEach(offset => {
            offset.y.value = offset.originalY;
            offset.x.value = offset.originalX;
        });
        setOffsets(tempArr);

        const height = offsets.reduce((acc, o) => acc + o.height, 0);
        sHeight.value = height;
    };

    // Called on reorder.
    const recalculateLayout = (order?: number) => {
        'worklet';

        let tempArr = offsets!;

        for (let i = 0; i < tempArr.length; i++) {
            const offset = tempArr[i];

            if (order && tempArr[i].order.value === order) {
                continue;
            }

            let y = 0;

            for (let j = 0; j < tempArr.length; j++) {
                if (tempArr[j].order.value >= offset.order.value) {
                    continue;
                }

                y += tempArr[j].height;
            }

            console.log('Y:', offset.order.value, y);
            offset.originalY = y;
            offset.y.value = withSpring(y);
            offset.x.value = withSpring(offset.originalX);
        }

        runOnJS(setOffsets)(tempArr);
    };

    return (
        <View>
            <Animated.View style={allElementsReady ? rStyle : {}}>
                {children.map((child, index) => {
                    return (
                        <SortableExercise
                            key={exercises[index].uid || index}
                            index={index}
                            uid={exercises[index].uid || index.toString()}
                            onMount={onChildMount}
                            onReady={onChildReady}
                            onUnmount={onChildUnmount}
                            changeOrder={changeOrder}
                            recalculateLayout={recalculateLayout}
                            allElementsReady={allElementsReady}
                            offsets={offsets}>
                            {child}
                        </SortableExercise>
                    );
                })}
            </Animated.View>
        </View>
    );
};

export default ExerciseList;
