import { router, Stack } from "expo-router";
import "react-native-get-random-values";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import Screen from "../Components/Screen";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import Dropdown from "../Components/Dropdown";
import * as DocumentPicker from "expo-document-picker";
import * as Location from "expo-location";
import { Upload } from "../Components/Icons";
import { PhotoVisor } from "../Components/PhotoVisor";
import { v4 as uuidv4 } from "uuid";
import { Loader } from "../Components/Loader";

export default function Upload_Shelf() {
  const [psales, setPsales] = useState([]);
  const [products, setProducts] = useState([]);
  const [photoVisor, setPhotoVisor] = useState(null);
  const [photoBefore, setPhotoBefore] = useState([]);
  const [photoAfter, setPhotoAfter] = useState([]);
  const [location, setLocation] = useState("");
  const [psale, setPsale] = useState(null);
  const [product, setProduct] = useState(null);
  const [initialCount, setInitialCount] = useState(0);
  const [finalCount, setFinalCount] = useState(0);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    findPointSales();
    findLocation();
    findProducts();
  }, []);

  const findLocation = async () => {
    await Location.requestForegroundPermissionsAsync().then((result) => {
      if (result.granted) {
        Location.getCurrentPositionAsync().then((loc) => {
          setLocation(JSON.stringify(loc));
        });
      }
    });
  };

  const findProducts = async () => {
    let tkn = await SecureStore.getItemAsync("tkn");

    const letsFind = await fetch("http://192.168.1.114:8080/product/find/", {
      headers: {
        "Content-Type": "application/json",
        Cookie: tkn,
      },
      credentials: "include",
      mode: "cors",
      method: "GET",
    });
    const result = await letsFind.json();

    const data = result.results.map((i) => {
      return { value: i.ID, label: i.Name };
    });
    setProducts(data);
  };

  const findPointSales = async () => {
    let tkn = await SecureStore.getItemAsync("tkn");
    const letsFind = await fetch("http://192.168.1.114:8080/PointSale/find/", {
      headers: {
        "Content-Type": "application/json",
        Cookie: tkn,
      },
      credentials: "include",
      mode: "cors",
      method: "GET",
    });

    const result = await letsFind.json();

    const data = result.results.map((i) => {
      return { value: i.ID, label: i.Name };
    });
    setPsales(data);
  };

  const sendForm = async () => {
    setLoader(true);
    let data = new FormData();

    data.append("point_sale_id", psale.value);
    data.append("geolocation", location);
    data.append("product", product.value);
    data.append("Existencia", initialCount);
    data.append("Reposicion", finalCount);
    data.append("photos", photoBefore);
    data.append("photos", photoAfter);

    let tkn = await SecureStore.getItemAsync("tkn");

    const send = await fetch("http://192.168.1.114:8080/shelf/new_evidence", {
      headers: {
        "Content-Type": "multipart/form-data",
        Cookie: tkn,
      },
      credentials: "include",
      mode: "cors",
      method: "POST",
      body: data,
    });

    send.json().then((result) => {});

    setLoader(true);

    router.navigate(`/historico`);
  };

  return !loader ? (
    <Screen>
      <Stack.Screen
        options={{
          headerLeft: () => {},
          headerRight: () => {},
          headerBackVisible: false,
          headerStyle: { backgroundColor: "#f59e0b" },
          headerTintColor: "#fff",
          headerTitle: "Cargar Evidencia",
        }}
      />
      <View className="flex-1 gap-5">
        <View>
          <Text className="text-white">Punto de Venta *</Text>
          <Dropdown
            options={psales}
            onSelect={(val) => {
              setPsale(val);
            }}
            placeholder={"Ingrese Punto de Venta..."}
          />
        </View>
        <View>
          <Text className="text-white">Producto *</Text>
          <Dropdown
            options={products}
            onSelect={(val) => {
              console.log(val);
              setProduct(val);
            }}
            placeholder={"Ingrese Producto..."}
          />
        </View>
        <View>
          <Text className="text-white">Cantidad del Producto al Llegar *</Text>
          <TextInput
            className="text-black h-10 border-white bg-white rounded-md pl-2"
            placeholder="Ingresa Existencia"
            placeholderTextColor={"black"}
            inputMode="numeric"
            maxLength={3}
            value={initialCount}
            onChangeText={(text) => {
              setInitialCount(text);
            }}
          />
        </View>
        <View>
          <Text className="text-white">Cantidad del Producto al Reponer *</Text>
          <TextInput
            className="text-black h-10 border-white bg-white rounded-md pl-2"
            placeholder="Ingresa Reposición"
            placeholderTextColor={"black"}
            inputMode="numeric"
            maxLength={3}
            value={finalCount}
            onChangeText={(text) => {
              setFinalCount(text);
            }}
          />
        </View>

        {/* FOTO ANTES */}

        <View className="flex-1">
          <Text className="text-white">Foto Antes *</Text>
          <Pressable
            onPress={() =>
              DocumentPicker.getDocumentAsync({
                multiple: false,
                type: ["image/*"],
              }).then((result) => {
                if (result.assets.length > 1) {
                  alert("cant select more 1 photo");
                } else {
                  console.log(result);
                  setPhotoBefore(
                    result.assets.map((photo) => {
                      return {
                        uri: photo.uri,
                        name: photo.name,
                        type: photo.mimeType,
                      };
                    })[0],
                  );
                }
              })
            }
          >
            <Upload className="text-white m-2" />
          </Pressable>

          {photoBefore ? (
            <View className="flex-1 items-center justify-center">
              <Pressable
                onPress={() => {
                  setPhotoVisor(photoBefore.uri);
                }}
                key={uuidv4()}
              >
                <Image
                  id={photoBefore.uri}
                  className="w-96 flex-1"
                  source={{ uri: photoBefore.uri }}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          ) : (
            <></>
          )}

          {/* FOTO DESPUES */}

          <Text className="text-white">Foto Despues *</Text>
          <Pressable
            onPress={() =>
              DocumentPicker.getDocumentAsync({
                multiple: false,
                type: ["image/*"],
              }).then((result) => {
                if (result.assets.length > 1) {
                  alert("cant select more 1 photo");
                } else {
                  setPhotoAfter(
                    result.assets.map((photo) => {
                      return {
                        uri: photo.uri,
                        name: photo.name,
                        type: photo.mimeType,
                      };
                    })[0],
                  );
                }
              })
            }
          >
            <Upload className="text-white m-2" />
          </Pressable>

          {photoAfter ? (
            <View className="flex-1 items-center justify-center">
              <Pressable
                onPress={() => {
                  setPhotoVisor(photoAfter.uri);
                }}
                key={uuidv4()}
              >
                <Image
                  id={photoAfter.uri}
                  className="w-96 flex-1"
                  source={{ uri: photoAfter.uri }}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          ) : (
            <></>
          )}
          <Pressable
            onPress={() => sendForm()}
            className="bg-blue-500 h-14 flex justify-center items-center rounded-md"
          >
            <Text className="text-white text-lg">Enviar</Text>
          </Pressable>
        </View>
      </View>
      {photoVisor ? (
        <PhotoVisor photo={photoVisor} disableVisor={setPhotoVisor} />
      ) : (
        <></>
      )}
    </Screen>
  ) : (
    <Loader />
  );
}
