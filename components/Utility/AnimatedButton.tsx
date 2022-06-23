import React, {ReactElement} from 'react';
import {useEffect} from 'react';
import {StyleProp, ViewStyle, Text, TextStyle} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';

type AnimatedButtonType = {
    onPress?: () => void;
    disabled?: boolean;
    style: ViewStyle;
    pressedColor?: string;
    disabledColor?: string;
    textStyle: StyleProp<ViewStyle> | StyleProp<TextStyle>;
    scale?: number;
    children: string | ReactElement;
};

const AnimatedButton: React.FC<AnimatedButtonType> = ({
    onPress,
    disabled,
    style,
    textStyle,
    pressedColor,
    disabledColor,
    scale = 0.98,
    children,
}) => {
    const sScaleX = useSharedValue(1);
    const sScaleY = useSharedValue(1);
    const initBackgroundColor = style.backgroundColor;
    const sBackgroundColor = useSharedValue(style.backgroundColor);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scaleX: withTiming(sScaleX.value, {
                        duration: 50,
                    }),
                },
                {
                    scaleY: withTiming(sScaleY.value, {
                        duration: 50,
                    }),
                },
            ],
            backgroundColor: sBackgroundColor.value,
        };
    });

    useEffect(() => {
        if (disabled && disabledColor) {
            sBackgroundColor.value = disabledColor;
        } else if (!disabled) {
            sBackgroundColor.value = initBackgroundColor;
        }
    }, [disabled, disabledColor, initBackgroundColor, sBackgroundColor]);

    const tapGesture = Gesture.Tap()
        .onTouchesDown(() => {
            if (!disabled) {
                sScaleX.value = scale;
                sScaleY.value = scale;

                if (pressedColor) {
                    sBackgroundColor.value = pressedColor;
                }

                if (onPress) {
                    runOnJS(onPress)();
                }
            }
        })
        .onFinalize(() => {
            if (!disabled) {
                sScaleX.value = 1;
                sScaleY.value = 1;
                sBackgroundColor.value = initBackgroundColor;
            }
        });

    return (
        <GestureDetector gesture={tapGesture}>
            <Animated.View style={[style, animatedStyle]}>
                {typeof children === 'string' ? (
                    <Text style={textStyle}>{children}</Text>
                ) : (
                    children
                )}
            </Animated.View>
        </GestureDetector>
    );
};

export default AnimatedButton;
