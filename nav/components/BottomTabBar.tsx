import React, {useState} from 'react';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {Pressable, View, SafeAreaView, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import {useAppSelector} from '@/store/hooks';
import WorkoutNew from '@/components/Workout/WorkoutPopover';
import Icon from 'react-native-vector-icons/FontAwesome5';

const BottomTabBar: React.FC<BottomTabBarProps> = ({
    state,
    descriptors,
    navigation,
}) => {
    const workoutCommenced = useAppSelector(
        storeState => storeState.activeWorkout.workoutCommenced,
    );

    const [popoverExpanded, setPopoverExpanded] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            {workoutCommenced ? (
                <WorkoutNew
                    popoverExpanded={popoverExpanded}
                    setPopoverExpanded={setPopoverExpanded}
                />
            ) : null}
            <View style={styles.navContainer}>
                {state.routes.map((route, index) => {
                    const {options} = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                            ? options.title
                            : route.name;

                    const isFocused = state.index === index;
                    let icon: JSX.Element;

                    switch (route.name) {
                        case 'Post':
                            icon = (
                                <Icon
                                    name="home"
                                    size={24}
                                    color={isFocused ? '#f3fcf0' : '#97A5B6'}
                                />
                            );
                            break;
                        case 'Exercise':
                            icon = (
                                <Icon
                                    name="dumbbell"
                                    size={24}
                                    color={isFocused ? '#f3fcf0' : '#97A5B6'}
                                />
                            );
                            break;
                        case 'Workout':
                            icon = (
                                <Icon
                                    name="dumbbell"
                                    size={24}
                                    color={isFocused ? '#f3fcf0' : '#97A5B6'}
                                />
                            );
                            break;
                        default:
                            icon = <View />;
                            break;
                    }

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            setPopoverExpanded(false);
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
                        <View style={styles.iconContainer}>
                            <Pressable
                                onPress={onPress}
                                onLongPress={onLongPress}
                                key={route.key}
                                style={styles.pressable}>
                                <View style={styles.icon}>{icon}</View>
                                <Text style={styles.label}>{label}</Text>
                            </Pressable>
                        </View>
                    );
                })}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A1F25',
        // shadowColor: '#f3fcf0',
        // shadowOffset: {
        //     height: -1,
        //     width: 0,
        // },
        // shadowOpacity: 0.1,
        // elevation: 4,
    },
    navContainer: {
        flexDirection: 'row',
        paddingTop: 12,
        borderTopColor: 'rgba(243, 252, 240, 0.4)',
        borderTopWidth: 1,
    },
    iconContainer: {flex: 1},
    label: {
        textAlign: 'left',
        color: 'white',
    },
    pressable: {alignItems: 'center'},
    icon: {paddingBottom: 5},
});

export default BottomTabBar;
