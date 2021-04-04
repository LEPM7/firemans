import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableHighlight} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { EMERGENCY_STATES } from './models/emergency_states';
import axios from 'axios';
import { NavigationApps, actions, googleMapsTravelModes, mapsTravelModes } from "react-native-navigation-apps";


export default function App() {

  const [emergency, setEmergency] = useState(null);
  const [onRoad, setOnRoad] = useState(false);
  const [validID, setValidID] = useState(false);
  const [id, setID] = useState(null);
  const URL = 'https://br6cad6dd4.execute-api.us-east-1.amazonaws.com/dev/emergency';

  const getEmergency = async () => {
    setEmergency(null);
    try {
      const response = await axios.get(`${URL}/${id}`);
      const data = response.data;
      if (data.errorMessage) {
        Alert.alert('El ID de la Emergencia es incorrecto');
        return;
      }
      const emergency = data;
      emergency.state = EMERGENCY_STATES.ONROAD;
      console.log(emergency);
      setEmergency(emergency);
    } catch (e) {
      console.error(e);
    }
  }

  const fulfillEmergency = async () => {}

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>EMERGENCIA</Text>
      <Text style={styles.Text}>ID:</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={text => {
          text.replace(/[^0-9]/g, '');
          setID(text);
          text.trim() === '' ? setValidID(false) : setValidID(true);
        }}
        keyboardType='numeric'
      />
      {validID ?
        <TouchableHighlight
          style={{ ...styles.openButton, backgroundColor: "#009F03", marginTop: 25 }}
          onPress={() => {
            getEmergency();
          }}
        ><Text>Obtener Emergencia</Text></TouchableHighlight> : null}

      {emergency && emergency.state === EMERGENCY_STATES.ONROAD ?
        <View>
          <NavigationApps
            iconSize={50}
            row
            address='some default address to navigate' // address to navigate by for all apps 
            waze={{ address: '', lat: emergency.latitude, lon: emergency.longitude, action: actions.navigateByLatAndLon }} // specific settings for waze
            googleMaps={{ lat: emergency.latitude, lon: emergency.longitude, action: actions.navigateByLatAndLon, travelMode: googleMapsTravelModes.driving }}
          />
          <TouchableHighlight
            style={{ ...styles.openButton, backgroundColor: "#009F03", marginTop: 25 }}
            onPress={() => fulfillEmergency()}
          ><Text>Emergencia Completada</Text></TouchableHighlight>
        </View> : null}
    
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputID: {
    fontSize: 10
  },
  title: {
    fontSize: 25
  },
  openButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 5,
    width: '55%',
  },
  Text: {
    textAlign: "center"
  },
  textInput: {
    width: '70%',
    margin: 5,
    borderWidth: 1,
    borderRadius: 20,
    textAlign: 'center'
  }
});
