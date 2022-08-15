import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Create from "../screens/Create";
import Profile from "../screens/Profile";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import PostView from "../screens/PostView";
import CreatePost1 from "../screens/CreatePost/CreatePost1";
import CreatePost2 from "../screens/CreatePost/CreatePost2";
import CreatePost3 from "../screens/CreatePost/CreatePost3";
import CreatePost4 from "../screens/CreatePost/CreatePost4";
import CreatePost5 from "../screens/CreatePost/CreatePost5";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Signup from "../screens/Signup";
import Login from "../screens/Login";
import Authenticated from "../screens/Authenticated";
import EditUserPhoto from "../screens/EditUserPhoto";

const HomeStack = createNativeStackNavigator();
const CreateStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const AuthenticateTabs = createMaterialTopTabNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerTitleStyle: {
          fontFamily: "Nunito-Bold",
          color: "darkorchid",
        },
      })}
    >
      <HomeStack.Screen
        options={{ headerTitle: "Exams++" }}
        name="HomeFeed"
        component={Home}
      />
      <HomeStack.Screen name="PostView" component={PostView} />
    </HomeStack.Navigator>
  );
}

function CreateStackScreen() {
  return (
    <CreateStack.Navigator
      initialRouteName="CreateName"
      screenOptions={({ route }) => ({
        headerTitleStyle: { fontFamily: "Nunito-Bold", color: "darkorchid" },
      })}
    >
      <CreateStack.Screen name="CreateName" component={Create} />
      <CreateStack.Screen name="CreatePost1" component={CreatePost1} />
      <CreateStack.Screen name="CreatePost2" component={CreatePost2} />
      <CreateStack.Screen name="CreatePost3" component={CreatePost3} />
      <CreateStack.Screen name="CreatePost4" component={CreatePost4} />
      <CreateStack.Screen name="CreatePost5" component={CreatePost5} />
    </CreateStack.Navigator>
  );
}

function AuthenticateTabScreen() {
  return (
    <AuthenticateTabs.Navigator
      initialRouteName="Login"
      tabBarPosition="top"
      backBehavior="none"
      screenOptions={{
        tabBarLabelStyle: {
          fontFamily: "Nunito-Regular",
        },
        tabBarIndicatorStyle: { backgroundColor: "darkorchid" },
        tabBarActiveTintColor: "darkorchid",
        tabBarInactiveTintColor: "grey",
        tabBarStyle: {
          // paddingTop: 30,
        },
      }}
    >
      <AuthenticateTabs.Screen name="Login" component={Login} />
      <AuthenticateTabs.Screen name="Signup" component={Signup} />
    </AuthenticateTabs.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator
      backBehavior="none"
      initialRouteName="GetProfile"
      screenOptions={({ route }) => ({
        headerShown: false,
        title: "My Profile",
      })}
    >
      <ProfileStack.Screen name="GetProfile" component={Profile} />
      <ProfileStack.Screen
        name="Authenticate"
        component={AuthenticateTabScreen}
      />

      <ProfileStack.Screen name="Authenticated" component={Authenticated} />
      <ProfileStack.Screen name="EditUserPhoto" component={EditUserPhoto} />
    </ProfileStack.Navigator>
  );
}

const Tab = createMaterialBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        backBehavior="none"
        shifting={true}
        activeColor="darkorchid"
        barStyle={{ backgroundColor: "#FFFFFF" }}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let colored = focused ? "darkorchid" : "#4d5156";

            if (route.name === "Home") {
              return (
                <Ionicons
                  name={focused ? "ios-home-sharp" : "ios-home-outline"}
                  size={24}
                  color={colored}
                />
              );
            } else if (route.name === "Create") {
              return (
                <MaterialIcons
                  name={focused ? "add-circle" : "add-circle-outline"}
                  size={25}
                  color={colored}
                />
              );
            } else if (route.name === "Profile") {
              return (
                <FontAwesome5
                  name={focused ? "user-alt" : "user"}
                  size={21}
                  color={colored}
                />
              );
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Create" component={CreateStackScreen} />
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
