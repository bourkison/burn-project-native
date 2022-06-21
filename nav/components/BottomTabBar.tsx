import React, {useEffect, useState} from 'react';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {View} from 'react-native';
import {Text} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useAppSelector} from '@/store/hooks';
import {prettifyTime} from '@/store/services';

const BottomTabBar: React.FC<BottomTabBarProps> = ({
    state,
    descriptors,
    navigation,
}) => {
    const workoutCommenced = useAppSelector(
        storeState => storeState.activeWorkout.workoutCommenced,
    );
    const workoutStartTime = useAppSelector(
        storeState => storeState.activeWorkout.startTime,
    );
    const [timeString, setTimeString] = useState('');

    useEffect(() => {
        if (workoutCommenced && workoutStartTime) {
            setInterval(() => {
                setTimeString(prettifyTime(workoutStartTime));
            }, 1000);
        }
    }, [workoutCommenced, workoutStartTime]);

    return (
        <View style={{flexDirection: 'row', height: 100}}>
            {state.routes.map((route, index) => {
                const {options} = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        // The `merge: true` option makes sure that the params inside the tab screen are preserved
                        navigation.navigate({
                            name: route.name,
                            params: {merge: true},
                        });
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityState={isFocused ? {selected: true} : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{flex: 1}}
                        key={index}>
                        <Text style={{color: isFocused ? '#673ab7' : '#222'}}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
            {workoutCommenced ? <Text>{timeString}</Text> : null}
        </View>
    );
};

export default BottomTabBar;
