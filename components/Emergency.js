import React, { Children } from "react";
import { Card, Button, Text, Icon } from "react-native-elements";
import { StyleSheet, View, Linking } from "react-native";
import moment from "moment";

const TYPES = {
  ACCIDENTE_DE_MOTO: "Accidente de Moto",
  ACCIDENTE_DE_CARRO: "Accidente de Carro",
  ACCIDENTE_LABORAL: "Accidente Laboral",
  HERIDA_PUNZO_CORTANTE: "Herida punzo cortante",
  MATERNIDAD: "Maternidad",
  DOLOR_ABDOMINAL: "Dolor Abdominal",
  HERIDA_BALA: "Herida de Bala",
  INCENDIO: "Incendio",
  OTROS: "Otros",
};

function Emergency({ emergency, children }) {
  const {
    name,
    contactPhone,
    latitude,
    longitude,
    date,
    id,
    type,
    other,
    comments,
  } = emergency;

  return (
    <Card>
      <Card.FeaturedTitle>
        <Text style={styles.nameText}>
          {id} - {name}
        </Text>
      </Card.FeaturedTitle>
      <Card.FeaturedSubtitle>
        <Text style={{ ...styles.telText, fontWeight: "bold" }}>TEL: </Text>
        <Text
          style={{
            ...styles.telText,
            textDecorationLine: "underline",
            fontStyle: "italic",
          }}
          onPress={() => Linking.openURL(`tel:${contactPhone}`)}
        >
          <Icon name="phone-in-talk" iconStyle={{ fontSize: 15 }} />
          {contactPhone}
        </Text>
        <Text>{"  -  "}</Text>
        <Icon name="calendar-today" iconStyle={{ fontSize: 15 }} />
        <Text>{moment(new Date(date)).format("DD/MM/YYYY h:mm A")}</Text>
      </Card.FeaturedSubtitle>
      <Card.Divider />
      <Text style={styles.propertyName}>Tipo: </Text>
      <Text>{TYPES[type]}</Text>
      {type === "OTROS" ? (
        <View>
          <Text style={styles.propertyName}>Otro: </Text>
          <Text>{other}</Text>
        </View>
      ) : null}
      {comments !== "" ? (
        <View>
          <Text style={styles.propertyName}>Comentarios Adicionales: </Text>
          <Text>{comments}</Text>
        </View>
      ) : null}
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  nameText: {
    fontWeight: "bold",
    marginEnd: 1,
    fontSize: 18,
  },
  telText: {
    marginEnd: 1,
    fontSize: 12,
  },
  propertyName: {
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default Emergency;
