import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  TouchableHighlight,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import { EMERGENCY_STATES } from "./models/emergency_states";
import axios from "axios";
import {
  NavigationApps,
  actions,
  googleMapsTravelModes,
  mapsTravelModes,
} from "react-native-navigation-apps";
import {
  Flex,
  NativeBaseProvider,
  Heading,
  IconButton,
  Icon,
  Input,
  Button,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";

export default function App() {
  const [emergency, setEmergency] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validID, setValidID] = useState(false);
  const [id, setID] = useState(null);
  const URL =
    "https://br6cad6dd4.execute-api.us-east-1.amazonaws.com/dev/emergency";

  const getEmergency = async () => {
    setEmergency(null);
    try {
      const response = await axios.get(`${URL}/${id}`);
      const data = response.data;
      if (data.errorMessage) {
        Alert.alert("El ID de la Emergencia es incorrecto");
        return;
      }
      const emergency = data;
      emergency.state = EMERGENCY_STATES.ONROAD;
      console.log(emergency);
      setEmergency(emergency);
    } catch (e) {
      console.error(e);
    }
  };

  const fulfillEmergency = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(`${URL}`, {...emergency, state: EMERGENCY_STATES.FULFILLED }, { 
        'Content-Type': 'application/json'
      });
      setIsLoading(false);
      setEmergency(null);
      alert('Emergencia completada satisfactoriamente');
    } catch(e){
      alert('Hubo un error, intente mas tarde');
      setIsLoading(false);
      console.error(e);
    }
  };

  const showFields = () =>
    validID && emergency && emergency.state === EMERGENCY_STATES.ONROAD;

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <StatusBar style="default" />
        <Heading size="2xl">EMERGENCIA</Heading>
        <Flex
          flexDirection="row"
          alignItems="center"
          width="100%"
          justifyContent="center"
        >
          <Input
            size="sm"
            marginRight={2}
            w="60%"
            placeholder="ID:"
            onChangeText={(text) => {
              text.replace(/[^0-9]/g, "");
              setID(text);
              text.trim() === "" ? setValidID(false) : setValidID(true);
            }}
            type="numeric"
          />
          {validID && (
            <IconButton
              variant="solid"
              icon={
                <Icon
                  size="sm"
                  as={<AntDesign name="search1" />}
                  color="white"
                />
              }
              onPress={() => {
                getEmergency();
              }}
            />
          )}
        </Flex>
        {showFields() && (
          <Flex flexDirection="row" alignItems="center" marginTop={4} marginBottom={2}>
            <NavigationApps
              iconSize={50}
              row
              address="some default address to navigate" // address to navigate by for all apps
              waze={{
                address: "",
                lat: emergency.latitude,
                lon: emergency.longitude,
                action: actions.navigateByLatAndLon,
              }} // specific settings for waze
              googleMaps={{
                lat: emergency.latitude,
                lon: emergency.longitude,
                action: actions.navigateByLatAndLon,
                travelMode: googleMapsTravelModes.driving,
              }}
            />
          </Flex>
        )}
        {showFields() && (
          <Button isLoading={isLoading} onPress={() => fulfillEmergency()}>
            Completar Emergencia
          </Button>
        )}
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputID: {
    fontSize: 10,
  },
  title: {
    fontSize: 25,
  },
  openButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 5,
    width: "55%",
  },
  Text: {
    textAlign: "center",
  },
  textInput: {
    width: "70%",
    margin: 5,
    borderWidth: 1,
    borderRadius: 20,
    textAlign: "center",
  },
});
