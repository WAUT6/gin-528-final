import Icons from "@/constants/Icons";
import Images from "@/constants/Images";
import { router, useNavigation, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import supabase from "../supabaseClient";
import { Json } from "@/database.types";
import LargeButton from "@/components/LargeButton";
import MapView, { Marker } from "react-native-maps";

const EventScreen = () => {
  const [eventId, setEventId] = useState("");
  const [publicUrl, setPublicUrl] = useState<string | null>();
  const [organizer, setOrganizer] = useState<{
    created_at: string;
    email: string;
    id: number;
    metadata: Json;
    uuid: string;
  }>();
  const [event, setEvent] = useState<{
    category_id: number | null;
    created_at: string;
    event_date: number;
    event_description: string | null;
    event_name: string;
    host_id: string;
    id: number;
    image_url: string | null;
    location: string;
    max_capacity: number;
    ticket_price: number;
    latitude: number;
    longitude: number;
  }>();
  useNavigation().setOptions({ headerShown: false });
  let path = usePathname();

  const [userId, setUserId] = useState<string>();

  const fetchUserId = async () => {
    const response = await supabase.auth.getSession();
    if (response.error) {
      console.warn(response.error);
      return;
    }
    setUserId(response.data.session?.user.id);
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  const purchaseTicket = async () => {
    if (!event) {
      return;
    }
    const { data, error } = await supabase.from("reservations").insert({
      user_id: userId,
      event_id: event.id,
    });
    if (error) {
      console.warn(error);
      return;
    }
    router.dismiss();
    Alert.alert("Success", "Ticket purchased successfully.");
  };

  useEffect(() => {
    let pathArray = path.split("/");
    let id = pathArray[pathArray.length - 1];
    setEventId(id);
  }, []);

  const fetchPublicUrl = async () => {
    if (!event) {
      return;
    }
    const response = supabase.storage
      .from("event_images")
      .getPublicUrl(event.image_url!);

    setPublicUrl(response.data.publicUrl);
  };

  useEffect(() => {
    fetchPublicUrl();
  }, [event]);

  useEffect(() => {
    if (eventId === "") {
      return;
    }
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();
      if (error) {
        console.log(error);
        return;
      }
      setEvent(data);
    };
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (!event) {
      return;
    }
    const fetchOrganizer = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("uuid", event.host_id)
        .single();
      if (error) {
        console.log(error);
        return;
      }
      setOrganizer(data);
    };
    fetchOrganizer();
  }, [event]);
  return (
    <View className="bg-white h-full">
      <View className="h-[244px]">
        <Image
          source={{
            uri: publicUrl !== null ? publicUrl : Images.defaultEventBg,
          }}
          className="w-full h-[244px]"
        ></Image>
        <View className="absolute flex-row items-center justify-start left-6 top-12">
          <TouchableOpacity onPress={() => router.dismiss()}>
            <Image source={Icons.backIcon}></Image>
          </TouchableOpacity>
          <Text className="font-psemibold text-white text-xl ml-4">
            Event Details
          </Text>
        </View>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {event && (
          <View className="mt-12 px-6">
            <Text className="text-black text-3xl font-pregular">
              {event.event_name}
            </Text>
            <View className="flex-row items-center justify-start mt-4">
              <View
                className="h-[48px] w-[48px] rounded-xl flex justify-center items-center"
                style={{
                  backgroundColor: "rgba(86, 105, 255, 0.2)",
                }}
              >
                <Image source={Icons.dateBlueIcon}></Image>
              </View>
              <View>
                <Text className="text-black text-lg font-pbold ml-3">
                  {new Date(event.event_date).toDateString()}
                </Text>
                <Text className="text-black text-lg font-pregular ml-3">
                  {new Date(event.event_date).toLocaleTimeString()}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center justify-start mt-4">
              <View
                className="h-[48px] w-[48px] rounded-xl flex justify-center items-center"
                style={{
                  backgroundColor: "rgba(86, 105, 255, 0.2)",
                }}
              >
                <Image source={Icons.locationBlueIcon}></Image>
              </View>
              <View>
                <Text className="text-black text-lg font-pbold ml-3">
                  {event.location.split(",")[0]}
                </Text>
                <Text className="text-black text-lg font-pregular ml-3">
                  {event.location.split(",").slice(1).join(",").trim()}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center justify-start mt-4">
              <View
                className="h-[48px] w-[48px] rounded-xl flex justify-center items-center"
                style={{
                  backgroundColor: "rgba(86, 105, 255, 0.2)",
                }}
              >
                <Image source={Icons.profileIcon}></Image>
              </View>
              <View>
                <Text className="text-black text-lg font-pbold ml-3">
                  {!organizer && "Loading..."}
                  {organizer &&
                    (organizer.metadata as { username: string }).username}
                </Text>
                <Text className="text-black text-lg font-pregular ml-3">
                  Organizer
                </Text>
              </View>
            </View>
            <View className="border-primary border-4 rounded-lg mt-5">
              <MapView
                style={{
                  width: "100%",
                  height: 200,
                }}
                initialRegion={
                  event && {
                    latitude: event.latitude,
                    longitude: event.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }
                }
              >
                {event && (
                  <Marker
                    coordinate={{
                      latitude: event.latitude,
                      longitude: event.longitude,
                    }}
                  ></Marker>
                )}
              </MapView>
            </View>
            <View className="mt-5">
              <Text className="text-black text-lg font-psemibold">
                About Event
              </Text>
              <Text className="text-black text-lg font-pregular mt-2 mb-28">
                {event.event_description}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
      <View
        className="absolute items-center justify-center bottom-0 w-full"
        style={{
          backgroundColor:
            "linear-gradient(0deg, rgba(255,255,255,0.90) 0%, rgba(255,255,255,1) 100%)",
        }}
      >
        <LargeButton
          title={`Buy Ticket \$${event?.ticket_price || 0}`}
          onPress={purchaseTicket}
          isLoading={event === undefined}
          containerStyles="mb-6"
          textStyles="font-psemibold"
        ></LargeButton>
      </View>
      <StatusBar translucent></StatusBar>
    </View>
  );
};
export default EventScreen;
