import React, {ReactElement, useState} from 'react';
import {RecordedExercise} from '@/types/workout';
import SortableExercise from './SortableExercise';
import {
    runOnJS,
    runOnUI,
    SharedValue,
    withSpring,
} from 'react-native-reanimated';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import {ExerciseRecorderProps} from './ExerciseRecorder';

type ExerciseListProps = {
    exercises: RecordedExercise[];
    children: ReactElement<ExerciseRecorderProps>[];
};

export type Offset = {
    order: SharedValue<number>;
    width: number;
    height: SharedValue<number>;
    x: SharedValue<number>;
    y: SharedValue<number>;
    originalX: SharedValue<number>; // Seems to always be 0.
    originalY: SharedValue<number>;
    uid: string;
    ready: boolean;
};

const ExerciseList: React.FC<ExerciseListProps> = ({children, exercises}) => {
    const [allElementsReady, setAllElementsReady] = useState(false);
    const [offsets, setOffsets] = useState<Offset[]>([]);
    const [height, setHeight] = useState(1);

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
                runOnUI(initCalculateLayout)();
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
        'worklet';

        let tempArr = offsets!;

        tempArr.forEach(offset => {
            offset.y.value = offset.originalY.value;
            offset.x.value = offset.originalX.value;
        });

        runOnJS(setOffsets)(tempArr);

        const calcHeight = tempArr.reduce((acc, o) => acc + o.height.value, 0);
        runOnJS(setHeight)(calcHeight);
    };

    // Called on reorder or height change.
    const recalculateLayout = (order?: number, spring = true) => {
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

                y += tempArr[j].height.value;
            }

            console.log('Y:', offset.order.value, y);
            offset.originalY.value = y;
            offset.y.value = spring ? withSpring(y) : y;
            offset.x.value = spring
                ? withSpring(offset.originalX.value)
                : offset.originalX.value;
        }

        runOnJS(setOffsets)(tempArr);
    };

    // Called when the container view changes.
    const updateHeight = (i: number, h: number) => {
        'worklet';

        let tempArr = offsets!;

        console.log('HEIGHT UPDATED FROM:', tempArr[i].height.value, 'TO:', h);
        tempArr[i].height.value = h;

        runOnJS(setOffsets)(tempArr);

        recalculateLayout(undefined, false);

        const calcHeight = tempArr.reduce((acc, o) => acc + o.height.value, 0);
        runOnJS(setHeight)(calcHeight);
    };

    return (
        <View>
            <View style={allElementsReady ? {height: height} : {}}>
                {children.map((child, index) => {
                    return (
                        <SortableExercise
                            key={exercises[index].uid || index}
                            index={index}
                            uid={exercises[index].uid || index.toString()}
                            onMount={onChildMount}
                            onReady={onChildReady}
                            onUnmount={onChildUnmount}
                            onHeightChange={updateHeight}
                            changeOrder={changeOrder}
                            recalculateLayout={recalculateLayout}
                            allElementsReady={allElementsReady}
                            offsets={offsets}>
                            {child}
                        </SortableExercise>
                    );
                })}
            </View>
            <View>
                {offsets.map(o => {
                    return (
                        <Text style={styles.debugText}>
                            {JSON.stringify(o)}
                        </Text>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    debugText: {
        marginTop: 10,
        color: 'white',
    },
});

export default ExerciseList;
