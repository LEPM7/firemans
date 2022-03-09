import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, Text, TextInput, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { EMERGENCY_STATES } from "../models/emergency_states";

import axios from "axios";
import {
  NavigationApps,
  actions,
  googleMapsTravelModes,
  mapsTravelModes,
} from "react-native-navigation-apps";

import { Button, Icon, Card } from "react-native-elements";
import Emergency from "./Emergency";
import { ScrollView } from "react-native-gesture-handler";

const TYPES = {
  TRASLADO_HOSPITAL: "Traslado hospital",
  FALLECIMIENTO: "Persona fallecida",
  ATENDIDO_EN_AMBULANCIA: "Atendido en ambulancia",
  ATENDIDO_OTROS: "Atendido por otros cuerpos de socorro",
};

function Home({ route }) {
  const routeEmergency = route?.params?.emergency;

  //TODO: create a reducer
  const [emergency, setEmergency] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validID, setValidID] = useState(false);
  const [id, setID] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [firemansType, setFiremansType] = useState("TRASLADO_HOSPITAL");
  const [firemansComment, setFiremansComment] = useState("");

  useEffect(() => {
    if (routeEmergency) {
      setEmergency(routeEmergency);
      setValidID(true);
      setID(routeEmergency.id);
    }
  }, [routeEmergency]);

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

  const updateEmergency = async (state) => {
    setIsLoading(true);
    if (state === EMERGENCY_STATES.FULFILLED) {
      emergency.fireman_type = firemansType;
      emergency.fireman_comment = firemansComment;
    }

    try {
      console.log("emergencia_mandada", emergency);
      const response = await axios.put(
        `${URL}`,
        { ...emergency, state },
        {
          "Content-Type": "application/json",
        }
      );

      if (state === EMERGENCY_STATES.ONROAD) {
        emergency.state = EMERGENCY_STATES.ONROAD;
        setEmergency(emergency);
        setIsLoading(false);
        alert("Emergencia iniciada");
      } else if (state === EMERGENCY_STATES.FULFILLED) {
        setIsLoading(false);
        setEmergency(null);
        setModalVisible(!modalVisible);
        alert("Emergencia completada satisfactoriamente");
      }
    } catch (e) {
      alert("Hubo un error, intente mas tarde");
      setIsLoading(false);
      console.error(e);
    }
  };

  const showFields = () =>
    validID && emergency && emergency.state === EMERGENCY_STATES.ONROAD;

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",
          alignSelf: "center",
          marginTop: 8,
        }}
      >
        EMERGENCIA
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <TextInput
          style={{
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
            width: "70%",
          }}
          value={id}
          placeholder="ID:"
          onChangeText={(text) => {
            setEmergency(null);
            text.replace(/[^0-9]/g, "");
            setID(text);
            text.trim() === "" ? setValidID(false) : setValidID(true);
          }}
          type="numeric"
        />
        {validID && (
          <Button
            title={<Icon color="white" name="search"></Icon>}
            onPress={() => {
              getEmergency();
            }}
          />
        )}
      </View>
      {emergency ? (
        <Button
          title={"Iniciar Emergencia"}
          buttonStyle={{
            backgroundColor: "#32B62B",
          }}
          containerStyle={{
            marginStart: 15,
            marginEnd: 15,
          }}
          disabled={emergency.state === EMERGENCY_STATES.ONROAD}
          loading={isLoading}
          onPress={() => updateEmergency(EMERGENCY_STATES.ONROAD)}
        ></Button>
      ) : null}

      <ScrollView>
        {emergency ? (
          <Emergency emergency={emergency}>
            <View
              style={{
                marginStart: "auto",
                flexDirection: "row",
                alignItems: "flex-end",
                marginTop: 10,
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  IR CON
                  <Icon name="arrow-right"></Icon>
                </Text>
              </View>

              <NavigationApps
                iconSize={40}
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
            </View>
          </Emergency>
        ) : null}
        {/* && emergency.state === EMERGENCY_STATES.ONROAD */}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.container}>
          <Card>
            <Button
              icon={{
                name: "close",
                type: "ant-design",
                size: 20,
                color: "red",
              }}
              buttonStyle={{
                backgroundColor: "white",
              }}
              containerStyle={{
                width: "20%",
                marginStart: "auto",
              }}
              onPress={() => setModalVisible(!modalVisible)}
            ></Button>
            <Card.Title>
              <Text style={{ fontSize: 20 }}>COMPLETAR EMERGENCIA</Text>
            </Card.Title>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 12,
              }}
            >
              Tipo de Solucion:
            </Text>
            <Picker
              selectedValue={firemansType}
              style={{
                fontWeight: "bold",
                fontSize: 12,
              }}
              onValueChange={(itemValue) => setFiremansType(itemValue)}
            >
              {Object.keys(TYPES).map((key) => (
                <Picker.Item label={TYPES[key]} value={key} key={key} />
              ))}
            </Picker>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 12,
              }}
            >
              Comentarios Adicionales:
            </Text>
            <TextInput
              style={{
                width: "100%",
                margin: 5,
                borderWidth: 1,
                borderRadius: 20,
                textAlign: "center",
              }}
              multiline={true}
              numberOfLines={6}
              onChangeText={(text) => setFiremansComment(text)}
            />

            <Button
              title="Completar"
              icon={{
                name: "done",
                size: 15,
                color: "white",
              }}
              iconRight
              buttonStyle={{
                borderRadius: 10,
              }}
              containerStyle={{
                margin: 15,
              }}
              disabled={!showFields()}
              loading={isLoading}
              onPress={() => updateEmergency(EMERGENCY_STATES.FULFILLED)}
            ></Button>
          </Card>
        </View>
      </Modal>

      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          marginBottom: 10,
        }}
      >
        <Button
          title={"Completar Emergencia"}
          disabled={!showFields()}
          onPress={() => setModalVisible(true)}
        ></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
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

export default Home;
