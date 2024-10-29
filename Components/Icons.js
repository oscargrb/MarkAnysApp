import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

export const BackIcon = (props) => (
  <Ionicons name="arrow-back" size={24} color="white" {...props} />
);

export const SearchIcons = (props) => (
  <FontAwesome name="search" size={24} color="black" {...props} />
);

export const CloseIcon = (props) => (
  <AntDesign name="close" size={24} color="black" {...props} />
);

export const LeftIcon = (props) => (
  <AntDesign name="leftsquareo" size={24} color="black" {...props} />
);

export const RightIcon = (props) => (
  <AntDesign name="rightsquareo" size={24} color="black" {...props} />
);

export const Upload = (props) => (
  <Feather name="paperclip" size={24} color="black" {...props} />
);
