import Icons from "@/constants/Icons";
import { View, Text, Image, TextInput } from "react-native";
const SearchBar = () => {
  return (
    <View className="flex-row items-center">
      <Image source={Icons.searchIcon}></Image>
      <View className="w-[2px] rounded-xl h-1/2 ml-3 mr-1 bg-[rgba(255,255,255,0.3)]"></View>
      <TextInput
        placeholder="Search..."
        className=" font-plight text-xl text-white mt-2 w-full"
        placeholderTextColor={"rgba(255, 255, 255, 0.3)"}
      ></TextInput>
    </View>
  );
};
export default SearchBar;
