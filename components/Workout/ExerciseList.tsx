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
        if (offsets.filter(o => o.uid === offset.uid).length === 0) {
            setOffsets([...offsets, offset]);
            setAllElementsReady(false);
        }
    };

    const onChildReady = (offset: Offset, index: number) => {
        let items = offsets;
        items[index] = offset;
        setOffsets(items);

        if (items.filter(i => !i.ready).length === 0) {
            setAllElementsReady(true);
            runOnUI(calculateHeight)();
        }
    };

    const onChildUnmount = (uid: string) => {
        const index = offsets.findIndex(o => o.uid === uid);
        console.log('UNMOUNT:', index);
        // TODO: Remove from offsets array. Update all other order variables to account for one less.
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
    const calculateHeight = () => {
        'worklet';

        const calcHeight = offsets.reduce((acc, o) => acc + o.height.value, 0);
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
        tempArr[i].height.value = h;

        runOnJS(setOffsets)(tempArr);

        recalculateLayout(undefined, false);
        calculateHeight();
    };

    return (
        <View>
            <View
                style={
                    allElementsReady
                        ? {...styles.container, height: height}
                        : {}
                }>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {overflow: 'hidden'},
});

export default ExerciseList;
