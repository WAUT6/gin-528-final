import supabase from "@/app/supabaseClient";
import Icons from "@/constants/Icons";
import Images from "@/constants/Images";
import { View, Text, Image, TouchableOpacity } from "react-native";
const MapEventCard = ({
  id,
  title,
  date,
  location,
  image,
  onPressed,
}: {
  id: string;
  title: string;
  date: string;
  location: string;
  image: any;
  onPressed: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPressed} className="mr-3">
      <View className="w-[90vw] h-[110px] bg-white rounded-2xl shadow-black shadow-lg flex-row justify-start items-center px-2 py-2">
        <Image
          source={{
            uri: supabase.storage.from("event_images").getPublicUrl(image).data
              .publicUrl,
          }}
          style={{ width: 80, height: "100%", borderRadius: 10 }}
        ></Image>
        <View className="ml-4 justify-start h-full w-full">
          <Text className="font-pregular text-primary text-sm">{date}</Text>
          <Text className="font-psemibold text-black text-base">{title}</Text>
          <View className="flex-row items-center">
            <Image source={Icons.locationSmallIcon} className="mr-1"></Image>
            <Text className="font-pregular text-gray-400 text-xs">
              {location}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default MapEventCard;
