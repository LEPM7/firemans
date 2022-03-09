import React from "react";

//Utilities
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

//Components
import Home from "../components/Home";
import Search from "../components/Search";

const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: false,
      }}
    >
      <Tab.Screen name="Emergencia" component={Home} />
      <Tab.Screen name="Buscar" component={Search} />
    </Tab.Navigator>
  );
}
