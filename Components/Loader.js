import { Image, Text, View } from "react-native";
import loader from "../assets/loaderMarkAnys.gif";

export const Loader = () => {
  return (
    <View className="bg-white flex-1 justify-center items-center">
      <Image source={loader} className="w-32 h-32" />
      <Text className="font-bold">Cargando...</Text>
    </View>
  );
};
