import supabase from "@/app/supabaseClient";
import Images from "@/constants/Images";
import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
const EventCard = ({
  title,
  date,
  location,
  image,
  onPressed,
}: {
  title: string;
  date: string;
  location: string;
  image?: string | null;
  onPressed: () => void;
}) => {
  const [publicUrl, setPublicUrl] = useState<string | null>();
  const getPublicUrl = async () => {
    if (!image) {
      return;
    }
    const response = supabase.storage.from("event_images").getPublicUrl(image);
    console.log(response);
    if (!response.data) {
      return;
    }
    setPublicUrl(response.data.publicUrl);
  };

  useEffect(() => {
    getPublicUrl();
  }, [image]);

  return (
    <View className="shadow-gray-700 rounded-xl shadow-sm h-full bg-white mr-4">
      <TouchableOpacity
        onPress={onPressed}
        className="w-[240px] h-[255px] rounded-xl px-[9px] pt-[9px]"
      >
        <View>
          <Image
            source={{
              uri: publicUrl !== null ? publicUrl : Images.defaultEventBg,
            }}
            className="w-full h-[150px] rounded-2xl"
          ></Image>
          <View className=" bg-[rgba(255,255,255,0.7)] w-[45px] h-[45px] absolute top-2 left-2 rounded-lg items-center justify-center">
            <Text className="font-pbold text-xl text-[#F0635A]">
              {date.split(" ")[0]}
            </Text>
            <Text className="font-psemibold text-[#F0635A] text-sm">
              {date.split(" ")[1].substring(0, 3)}
            </Text>
          </View>
        </View>
        <View>
          <Text className="font-psemibold text-lg text-black mt-2">
            {title}
          </Text>
          <Text className="font-pregular text-sm text-gray-400 mt-1">
            {location}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default EventCard;
