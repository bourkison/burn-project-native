import React, {ReactElement, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import {Offset} from './ExerciseList';

type SortableExerciseProps = {
    children: ReactElement;
    index: number;
    uid: string;
    onReady: (offset: Offset) => void;
    onMount: (offset: Offset) => void;
    onUnmount: (uid: string) => void;
    changeOrder: (from: number, to: number) => void;
    recalculateLayout: (index?: number) => void;
    allElementsReady: boolean;
    offsets: Offset[];
};

const SortableExercise: React.FC<SortableExerciseProps> = ({
    children,
    index,
    uid,
    onReady,
    onMount,
    onUnmount,
    changeOrder,
    recalculateLayout,
    allElementsReady,
    offsets,
}) => {
    const order = useSharedValue(-1);
    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);

    const buildOffsetObject = (
        width: number,
        height: number,
        x: number,
        y: number,
        ready: boolean,
    ): Offset => {
        return {
            order: order,
            width: width,
            height: height,
            x: offsetX,
            y: offsetY,
            originalX: x,
            originalY: y,
            uid: uid,
            ready: ready,
        };
    };

    const ctx = useSharedValue({
        x: 0,
        y: 0,
    });

    const rStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: [
                {translateX: offsetX.value},
                {translateY: offsetY.value},
            ],
        };
    });

    useEffect(() => {
        onMount(buildOffsetObject(0, 0, 0, 0, false));

        return () => {
            onUnmount(uid);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            ctx.value = {
                x: offsetX.value,
                y: offsetY.value,
            };

            console.log('PAN START', ctx);
        })
        .onUpdate(e => {
            offsetX.value = e.translationX + ctx.value.x;
            offsetY.value = e.translationY + ctx.value.y;

            for (let i = 0; i < offsets.length; i++) {
                const currentOffset = offsets[index];
                if (i === index) {
                    continue;
                }

                // If we are higher than the previous orders y value.
                if (
                    offsets[i].order.value < currentOffset.order.value &&
                    offsets[index].y.value <= offsets[i].originalY
                ) {
                    changeOrder(
                        currentOffset.order.value,
                        offsets[i].order.value,
                    );
                    recalculateLayout(currentOffset.order.value);
                } else if (
                    offsets[i].order.value > currentOffset.order.value &&
                    offsets[index].y.value >= offsets[i].originalY
                ) {
                    changeOrder(
                        currentOffset.order.value,
                        offsets[i].order.value,
                    );
                    recalculateLayout(currentOffset.order.value);
                }
            }

            // onDrag(offsets[index], translationX.value, translationY.value);
        })
        .onFinalize(() => {
            recalculateLayout();
        });

    if (!allElementsReady) {
        return (
            <View
                key={index}
                style={styles.sortable}
                onLayout={e => {
                    order.value = index;
                    offsetX.value = e.nativeEvent.layout.x;
                    offsetY.value = e.nativeEvent.layout.y;

                    onReady(
                        buildOffsetObject(
                            e.nativeEvent.layout.width,
                            e.nativeEvent.layout.height,
                            e.nativeEvent.layout.x,
                            e.nativeEvent.layout.y,
                            true,
                        ),
                    );
                }}>
                {children}
            </View>
        );
    }

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={rStyle}>{children}</Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    sortable: {
        paddingBottom: 10,
    },
});

export default SortableExercise;
