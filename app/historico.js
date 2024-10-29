/* eslint-disable no-undef */
import { Stack, useFocusEffect } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Screen from "../Components/Screen";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export default function Historic() {
  const [data, setData] = useState([]);

  useFocusEffect(() => {
    getData();
  });

  const getData = async () => {
    try {
      let tkn = await SecureStore.getItemAsync("tkn");

      const lookup = await fetch(
        "http://192.168.1.114:8080/shelf/user_evidences/",
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

      if (lookup.status === 200) {
        const result = await lookup.json();
        console.log(result.evidence);
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
          headerTintColor: "#fff",
          headerTitle: "Histórico de Cargas",
        }}
      />
      <View className="flex-1">
        <View className="p-1 flex flex-row justify-between gap-3 items-center">
          <View className="flex flex-row gap-2">
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
          {/* <View>
            <SearchIcons color="white" />
          </View> */}
        </View>
        <View className="flex-1">
          {data.length > 0 ? (
            <FlatList
              data={data}
              keyExtractor={(item) => item.ID}
              renderItem={(item) => (
                <View className="rounded-lg overflow-hidden shadow-lg bg-white m-5">
                  <View className="p-4">
                    <Text className="text-xl font-bold mb-2">
                      Punto de Venta: {item.item.Point_Sale.Name}
                    </Text>
                    <Text className="text-gray-700 text-base mb-4">
                      Producto:{" "}
                      {item.item.Product ? item.item.Product.Name : ""}
                    </Text>
                    <Text className="text-gray-700 text-base mb-4">
                      {new Intl.DateTimeFormat("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }).format(new Date(item.item.createdAt))}
                    </Text>
                    <TouchableOpacity
                      onPress={() => router.navigate(`/${item.item.ID}`)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      <Text className="text-center text-white">Detalles</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          ) : (
            <ActivityIndicator />
          )}
        </View>
        <View className="flex h-10 justify-end">
          <Pressable
            onPress={() => router.navigate("/upload_shelf")}
            className="bg-blue-500 h-14 flex justify-center items-center rounded-md"
          >
            <Text className="text-white text-lg">Cargar Nuevo</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
