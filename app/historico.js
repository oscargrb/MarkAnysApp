import { Stack } from "expo-router";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import Screen from "../Components/Screen";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export default function Historic() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      let tkn = await SecureStore.getItemAsync("tkn");

      console.log(tkn);

      const lookup = await fetch(
        "http://192.168.1.114:8080/shelf/client_evidence/d3075db5-dafb-4627-8a6d-633b002f2e4a",
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

      console.log(lookup);

      if (lookup.status === 200) {
        const result = await lookup.json();

        console.log(result);

        setData(result.evidence);
      }
    } catch (e) {
      console.log(e);
    }
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
          headerTitle: "Histórico de Cargas",
        }}
      />
      <View>
        <View className="p-2 flex flex-row justify-start gap-3">
          <View className="overflow-hidden">
            <Text className="text-white opacity-60 w-auto text-xs">
              Punto de Venta |
            </Text>
          </View>
          <View className="overflow-hidden">
            <Text className="text-white opacity-60 w-auto text-xs">
              Fecha/Hora |
            </Text>
          </View>
        </View>
        <View className="max-h-fit">
          {data.length > 0 ? (
            <FlatList
              data={data}
              keyExtractor={(item) => item.ID}
              renderItem={(item) => (
                <View className="flex flex-row border-white border-2 m-1 p-2 rounded-lg">
                  <View className="flex-col">
                    <Text className="text-white">
                      {item.item.Point_Sale.Name}
                    </Text>
                    <Text className="text-white w-auto">
                      {item.item.createdAt}
                    </Text>
                  </View>
                  <View className="overflow-hidden justify-center items-end flex-1">
                    <Text className="text-white w-auto">{"-->"}</Text>
                  </View>
                </View>
              )}
            />
          ) : (
            <ActivityIndicator />
          )}
        </View>
      </View>
      <View className="flex-1 flex justify-end">
        <Button
          title="Cargar"
          onPress={() => router.navigate("/upload_shelf")}
        />
      </View>
    </Screen>
  );
}
