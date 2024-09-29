import { Stack } from "expo-router";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";
import Screen from "../Components/Screen";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import Dropdown from "../Components/Dropdown";

export default function Upload_Shelf() {
  const [psales, setPsales] = useState([]);

  useEffect(() => {
    findPointSales();
  }, []);

  const findPointSales = async () => {
    let tkn = await SecureStore.getItemAsync("tkn");
    const letsFind = await fetch(
      "http://192.168.1.114:8080/PointSale/find/d3075db5-dafb-4627-8a6d-633b002f2e4a",
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: tkn,
        },
        credentials: "include",
        mode: "cors",
        method: "GET",
      },
    );

    console.log(letsFind);

    const result = await letsFind.json();

    console.log(result.results);
    const data = result.results.map((i) => {
      return { value: i.ID, label: i.Name };
    });
    setPsales(data);
  };

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerLeft: () => {},
          headerRight: () => {},
          headerBackVisible: false,
          headerStyle: { backgroundColor: "#f59e0b" },
          headerTintColor: "#333",
          headerTitle: "Cargar Evidencia",
        }}
      />
      <View>
        <View>
          <Text className="text-white">Punto de Venta *</Text>
          <Dropdown options={psales} onSelect={() => console.log("hola")} />
        </View>
      </View>
    </Screen>
  );
}
