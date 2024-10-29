import { Text, View } from "react-native";
import { CloseIcon } from "./Icons";

export const Notify = ({ info, pressEvent }) => {
  return (
    <View className="bg-red-500 p-2 mb-2 flex flex-row items-center justify-between">
      <Text className="text-white">{info}</Text>
      <CloseIcon color="white" onPress={pressEvent} />
    </View>
  );
};
