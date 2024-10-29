import { Stack, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import Screen from "../Components/Screen";
import * as SecureStore from "expo-secure-store";
import { PhotoVisor } from "../Components/PhotoVisor";

export default function Details() {
  const { id } = useLocalSearchParams();
  const [info, setInfo] = useState(null);
  const [photoVisor, setPhotoVisor] = useState(null);

  useEffect(() => {
    findInfo();
  }, [id]);

  const findInfo = async () => {
    try {
      let tkn = await SecureStore.getItemAsync("tkn");
      const data = await fetch(
        "http://192.168.1.114:8080/shelf/get_evidence/" + id,
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

      const result = await data.json();

      console.log(result.evidence);

      setInfo(result.evidence);
    } catch (e) {}
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
          headerTitle: "Detalles Evidencia ",
        }}
      />

      {!info ? (
        <ActivityIndicator />
      ) : (
        <View className="flex gap-3">
          <View>
            <Text className="text-white ml-1">ID</Text>
            <Text className="text-white border-2 h-9 p-2 border-white rounded-md">
              {id}
            </Text>
          </View>
          <View>
            <Text className="text-white ml-1">Punto de Venta</Text>
            <Text className="text-white border-2 h-9 p-2 border-white rounded-md">
              {info.Point_Sale.Name}
            </Text>
          </View>
          <View>
            <Text className="text-white ml-1">Fecha/Hora</Text>
            <Text className="text-white border-2 h-9 p-2 border-white rounded-md">
              {info.createdAt}
            </Text>
          </View>
          <View>
            <Text className="text-white ml-1">Usuario</Text>
            <Text className="text-white border-2 h-9 p-2 border-white rounded-md">
              {info.User.Username}
            </Text>
          </View>
          <View>
            <Text className="text-white ml-1">Geolocation</Text>
            <Text className="text-white border-2 h-9 p-2 border-white rounded-md">
              {info.Geolocation}
            </Text>
          </View>
          <ScrollView horizontal>
            {info.Shelf_Evidence_Media.map((i) => (
              <Pressable onPress={() => setPhotoVisor(i.Photo)}>
                <Image
                  source={{ uri: i.Photo }}
                  className="w-40 h-80"
                  resizeMode="contain"
                />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
      {photoVisor ? (
        <PhotoVisor photo={photoVisor} disableVisor={setPhotoVisor} />
      ) : (
        <></>
      )}
    </Screen>
  );
}

const textStyle = "text-white text-lg text-center";
