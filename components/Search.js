import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { Button } from "react-native-elements";
import Emergency from "./Emergency";

const URL =
  "https://br6cad6dd4.execute-api.us-east-1.amazonaws.com/dev/emergency";

function Search({ navigation }) {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const scrollRef = useRef(undefined);

  const getNewEmergencies = () => {
    fetch(URL + "/status/NEW").then(async (response) => {
      const emergenciesResponse = await response.json();
      setEmergencies(emergenciesResponse);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getNewEmergencies();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title="SINCRONIZAR"
        loading={loading}
        loadingProps={{
          size: "small",
          color: "white",
        }}
        buttonStyle={{
          borderWidth: 0,
        }}
        containerStyle={{
          marginStart: 15,
          marginBottom: 3,
          marginEnd: 15,
          marginTop: 10,
        }}
        onPress={() => {
          setIsLoading(true);
          scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
          getNewEmergencies();
        }}
      />
      <ScrollView ref={scrollRef}>
        {emergencies.map((emergency) => (
          <Emergency emergency={emergency} key={emergency.id}>
            <Button
              title={
                <CustomTitle
                  longitude={emergency.longitude ?? 0}
                  latitude={emergency.latitude ?? 0}
                />
              }
              // titleStyle={{ fontWeight: "bold", fontSize: 18 }}
              buttonStyle={{
                borderWidth: 0,
                borderColor: "transparent",
                borderRadius: 20,
              }}
              containerStyle={{
                width: 200,
                marginStart: "auto",
                marginTop: 15,
              }}
              icon={{
                name: "arrow-right",
                type: "font-awesome",
                size: 15,
                color: "white",
              }}
              iconRight
              iconContainerStyle={{ marginLeft: 10, marginRight: -10 }}
              onPress={() => {
                navigation.navigate("Emergencia", { emergency });
              }}
            />
          </Emergency>
        ))}
      </ScrollView>
    </View>
  );
}

const CustomTitle = ({ latitude, longitude }) => {
  return (
    <View style={{ flexDirection: "column" }}>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 15,
          color: "white",
          alignSelf: "flex-end",
        }}
      >
        IR
      </Text>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 10,
          color: "white",
          alignSelf: "flex-end",
        }}
      >
        ({latitude},{longitude})
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
  },
});

export default Search;
