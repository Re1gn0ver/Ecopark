import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import NavigationTab from './components/NavigationTab';

const tabIcon = [
  {
    onIcon: require('../../shared/img/on-tab1.png'),
    offIcon: require('../../shared/img/off-tab1.png'),
  },
  {
    onIcon: require('../../shared/img/on-tab2.png'),
    offIcon: require('../../shared/img/off-tab2.png'),
  },
  {
    onIcon: require('../../shared/img/on-tab3.png'),
    offIcon: require('../../shared/img/off-tab3.png'),
  },
];

function TabBar({ state, descriptors, navigation }) {
  return (
    <View style={[{ flexDirection: 'column', height: '100%', width: '100%' }]}>
      <View style={[{ flex: 1 }]}>
        {state.routes.map((route, i) => {
          return (
            <View
              key={route.key}
              style={[
                StyleSheet.absoluteFill,
                { display: i === state.index ? 'flex' : 'flex' },
              ]}
            >
              {descriptors[route.key].render()}
            </View>
          );
        })}
      </View>
      <View
        key="navigation-bar"
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'center',
          alignItems: 'center',
          //   backgroundColor: 'rgba(127,191,39,0.18)',
          backgroundColor: '#FFFFFF',
          paddingHorizontal: 20,
          paddingVertical: 20,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
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
              navigation.navigate({ name: route.name, merge: true });
            }
          };
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
          return (
            <NavigationTab
              key={route.key}
              info={{
                title: label,
                onIcon: tabIcon[index].onIcon,
                offIcon: tabIcon[index].offIcon,
              }}
              isFocused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

export default TabBar;
