import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { TextInput, View, Text, Button, Image } from "react-native";

import Screen from "../Components/Screen";

import loginImage from "../assets/login.gif";
import { router } from "expo-router";
import { Loader } from "../Components/Loader";
import { Notify } from "../Components/Notify";

export default function Index() {
  const [hourIcon, setHourIcon] = useState("");
  const [loader, setLoader] = useState(false);
  const [notify, setNotify] = useState(false);
  const [notifyText, setNotifyText] = useState("");
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  useEffect(() => {
    let date = new Date(Date.now());
    let hour = date.getHours();

    if (hour < 12) setHourIcon("🌞 Buenos Días!");
    else if (hour < 19) setHourIcon("🌄 Buenas Tardes!");
    else setHourIcon("🌚 Buenas Noches!");
  }, []);

  const login = async () => {
    setLoader(true);

    if (user.length > 0 && pwd.length > 0) {
      const loginthis = await fetch("http://192.168.1.114:8080/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({
          username: user,
          pwd: pwd,
        }),
      });

      const result = await loginthis.json();

      if (result.ok) {
        await SecureStore.setItemAsync(
          "tkn",
          loginthis.headers.map["set-cookie"],
        );
        router.navigate("/historico");
      } else {
        setNotify(true);
        setNotifyText("Credenciales Incorrectas");
      }
    } else {
      setNotify(true);
      setNotifyText("Debe completar los campos requeridos");
    }

    setLoader(false);
  };

  return !loader ? (
    <Screen>
      {notify ? (
        <Notify
          info={notifyText}
          pressEvent={() => {
            setNotify(false);
          }}
        />
      ) : (
        <></>
      )}
      <View className="flex-1 gap-5">
        <Text className="text-white text-lg">{hourIcon}</Text>
        <Text className="text-white text-lg">
          Bienvenido a Nuestra Plataforma
        </Text>
        <View>
          <Text className="text-white">Usuario *</Text>
          <TextInput
            className="text-black h-10 border-white bg-white rounded-md pl-2"
            placeholder="Ingresa Usuario..."
            placeholderTextColor={"black"}
            value={user}
            onChangeText={(text) => {
              setUser(text.trim().toLocaleLowerCase());
            }}
            maxLength={20}
          />
        </View>

        <View>
          <Text className="text-white">Contraseña *</Text>
          <TextInput
            className="text-black h-10 border-white bg-white rounded-md pl-2"
            placeholder="Ingresa Contraseña..."
            placeholderTextColor={"black"}
            maxLength={30}
            value={pwd}
            secureTextEntry
            onChangeText={(text) => {
              setPwd(text.trim());
            }}
          />
        </View>

        <View>
          <Button title="Enviar" onPress={() => login()} />
        </View>

        <View className="flex-1 justify-center items-center">
          <Image
            source={loginImage}
            style={{ width: 150, height: 150 }}
            resizeMode="cover"
          />
        </View>
      </View>
    </Screen>
  ) : (
    <Loader />
  );
}
