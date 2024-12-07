import supabase from "@/app/supabaseClient";
import Icons from "@/constants/Icons";
import Images from "@/constants/Images";
import { View, Text, Image, TouchableOpacity } from "react-native";
const ProfileEventCard = ({
  id,
  title,
  date,
  location,
  image,
  onEditPressed,
  onDeletePressed,
  isReservation = false,
}: {
  id: string;
  title: string;
  date: string;
  location: string;
  image: any;
  isReservation?: boolean;
  onEditPressed: () => void;
  onDeletePressed: () => void;
}) => {
  return (
    <View className="flex-row mb-3">
      <View
        className={`w-[85%] p-2 h-[110px] bg-white rounded-xl shadow-black shadow-xl flex-row overflow-hidden ${
          isReservation ? "w-[100%]" : ""
        }`}
      >
        <View className="h-full">
          <Image
            source={{
              uri: supabase.storage.from("event_images").getPublicUrl(image)
                .data.publicUrl,
            }}
            style={{ width: 90, height: "100%", borderRadius: 10 }}
          ></Image>
        </View>
        <View className="ml-4 justify-start h-full w-full">
          <Text className="font-pregular text-primary text-sm">
            {`${new Date(date).toLocaleDateString([], {
              weekday: "short",
              month: "short",
              day: "numeric",
            })} - ${new Date(date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`}
          </Text>
          <Text className="font-psemibold text-black text-base">{title}</Text>
          <View className="flex-row items-center">
            <Image source={Icons.locationSmallIcon} className="mr-1"></Image>
            <Text className="font-pregular text-gray-400 text-xs">
              {location}
            </Text>
          </View>
        </View>
      </View>
      {!isReservation && (
        <View className="ml-2 w-[15%] h-[110px] p-2 rounded-xl justify-around">
          <TouchableOpacity
            onPress={onEditPressed}
            className="w-full h-[40%] bg-white rounded-lg shadow-black shadow-2xl items-center justify-center"
          >
            <Image source={Icons.editIcon}></Image>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDeletePressed}
            className="w-full h-[40%] bg-white rounded-lg shadow-black shadow-2xl items-center justify-center"
          >
            <Image
              source={Icons.deleteIcon}
              style={{ width: 40, height: 30 }}
              resizeMode="contain"
            ></Image>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
export default ProfileEventCard;
