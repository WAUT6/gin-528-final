import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { Stack } from "expo-router";
import { View, Text, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./home";
import Icons from "@/constants/Icons";
import Profile from "./profile";
import Events from "./events";

const Tab = createBottomTabNavigator();

const TabsLayout = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: 60,
          padding: 10,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View className="items-center justify-start h-full w-[80px]">
                <Image source={Icons.homeIcon}></Image>
                <Text
                  className={`font-psemibold text-xs ${
                    focused ? "text-primary" : ""
                  }`}
                >
                  Home
                </Text>
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Events"
        component={Events}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View className="items-center justify-start h-full w-[80px]">
                <Image source={Icons.eventsIcon}></Image>
                <Text
                  className={`font-psemibold text-xs ${
                    focused ? "text-primary" : ""
                  }`}
                >
                  Events
                </Text>
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View className="items-center justify-start h-full w-[80px]">
                <Image source={Icons.profileIcon}></Image>
                <Text
                  className={`font-psemibold text-xs ${
                    focused ? "text-primary" : ""
                  }`}
                >
                  Profile
                </Text>
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};
export default TabsLayout;
