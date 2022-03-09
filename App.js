import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";

import MyTabs from "./containers/Tabs";

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <StatusBar barStyle="default" />
        <MyTabs />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
