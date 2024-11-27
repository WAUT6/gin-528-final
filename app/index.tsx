import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../constants/Images";

const HomePage = () => {
  return (
    <SafeAreaView className="flex items-center justify-center h-[100vh] bg-white">
      <Image source={images.logo}></Image>
    </SafeAreaView>
  );
};
export default HomePage;
