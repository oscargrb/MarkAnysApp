import {
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BackIcon } from "./Icons";

export const PhotoVisor = (props) => {
  return (
    <Modal visible={true} transparent={true} animationType="slide">
      <TouchableOpacity style={styles.overlay}>
        {props.photo ? (
          <Image
            source={{ uri: props.photo }}
            className="w-10/12 h-5/6"
            resizeMode="cover"
          />
        ) : (
          <></>
        )}
        <View>
          <BackIcon
            onPress={() => props.disableVisor(false)}
            className="text-2xl"
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  overlay: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modal: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
