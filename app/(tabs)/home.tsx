import CategoryCard from "@/components/CategoryCard";
import EventCard from "@/components/EventCard";
import SearchBar from "@/components/SearchBar";
import Icons from "@/constants/Icons";
import Images from "@/constants/Images";
import * as MapLocation from "expo-location";

import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import supabase from "../supabaseClient";
const Home = () => {
  const [myLocation, setMyLocation] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }>();
  const [categories, setCategories] = useState<
    { category_name: string; created_at: string; id: number }[]
  >([]);
  const [upcomingEvents, setUpcomingEvents] = useState<
    {
      category_id: number | null;
      created_at: string;
      event_date: number;
      event_description: string | null;
      event_name: string;
      host_id: string;
      id: number;
      image_url: string | null;
      latitude: number;
      location: string;
      longitude: number;
      max_capacity: number;
      ticket_price: number;
    }[]
  >([]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [eventsNearYou, seteventsNearYou] = useState<
    {
      category_id: number | null;
      created_at: string;
      event_date: number;
      event_description: string | null;
      event_name: string;
      host_id: string;
      id: number;
      image_url: string | null;
      latitude: number;
      location: string;
      longitude: number;
      max_capacity: number;
      ticket_price: number;
    }[]
  >();

  const getLocation = async () => {
    const permissionResult =
      await MapLocation.requestForegroundPermissionsAsync();
    if (permissionResult.status !== "granted") {
      console.warn("Permission to access location was denied");
      return;
    }
    const location = await MapLocation.getCurrentPositionAsync({
      accuracy: MapLocation.LocationAccuracy.High,
    });
    const { latitude, longitude } = location.coords;
    setMyLocation({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const fetchNearbyEvents = async ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    const { data, error } = await supabase.rpc("get_events_within_radius", {
      input_latitude: latitude,
      input_longitude: longitude,
    });
    if (error) {
      console.log(error);
      return;
    }
    seteventsNearYou(data);
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (!myLocation) {
      return;
    }
    fetchNearbyEvents(myLocation);
  }, [myLocation]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) {
        console.log("error", error);
        return;
      }
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const fetchUpcomingEvents = async () => {
    const currentDate = new Date();
    const tenDaysLater = new Date();
    tenDaysLater.setDate(currentDate.getDate() + 10);
    console.log(tenDaysLater.valueOf());
    console.log(currentDate.valueOf());
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", currentDate.valueOf())
      .lte("event_date", tenDaysLater.valueOf());
    if (error) {
      console.log("error", error);
      return;
    }
    console.log(`data ${data}`);
    setUpcomingEvents(data);
  };

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  useEffect(() => {
    console.log(upcomingEvents);
  }, [upcomingEvents]);

  useEffect(() => {
    console.log(categories);
  }, [categories]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchUpcomingEvents();
    console.log("refreshed");
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView className="w-full h-full bg-white">
      <View className="bg-white h-[200px]">
        <View className="w-full bg-primaryDark h-[180px] rounded-br-[33px] rounded-bl-[33px] px-6 pt-2">
          <View className="flex-row justify-center items-center">
            <View className="flex items-center justify-center w-full">
              <Text className="text-sm font-plight text-white">
                Current Location
              </Text>
              <Text className="text-md font-pbold text-white">
                New York, USA
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(profile)")}
              className="absolute -right-2 w-10 h-10 rounded-full bg-[rgba(255,255,255,0.3)] justify-center items-center"
            >
              <Image source={Icons.profileIcon} className="w-8 h-8"></Image>
            </TouchableOpacity>
          </View>
          <View className="mt-6">
            <SearchBar></SearchBar>
          </View>
          <ScrollView
            className="absolute -bottom-4 left-0 w-[100vw] px-6 flex-row"
            horizontal
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            {categories.map((category, index) => {
              let icon = Icons.sportsIcon;
              let color = "#F0635A";
              if (category.category_name === "Sports") {
                icon = Icons.sportsIcon;
                color = "#F0635A";
              } else if (category.category_name === "Music") {
                icon = Icons.musicIcon;
                color = "#F59762";
              } else if (category.category_name === "Food") {
                icon = Icons.foodIcon;
                color = "#29D697";
              } else if (category.category_name === "Work") {
                icon = Icons.workIcon;
                color = "#46CDFB";
              }

              return (
                <CategoryCard
                  key={index}
                  title={category.category_name}
                  color={color}
                  onPressed={() => {}}
                  icon={icon}
                ></CategoryCard>
              );
            })}
          </ScrollView>
        </View>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => onRefresh()}
          ></RefreshControl>
        }
      >
        <View className="px-6 mt-[20px]">
          <Text className="text-2xl font-psemibold">Upcoming Events</Text>
          <ScrollView
            horizontal
            className="p-2 w-[100vw] flex-row"
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            {upcomingEvents.map((event, index) => (
              <EventCard
                key={index}
                image={event.image_url}
                location={event.location}
                date={new Date(event.event_date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                })}
                onPressed={() => {
                  router.push({
                    pathname: "/(event)/[id]",
                    params: { id: event.id.toString() },
                  });
                }}
                title={event.event_name}
              ></EventCard>
            ))}
          </ScrollView>
        </View>
        <View className="px-6 mt-[40px]">
          <Text className="text-2xl font-psemibold">Events Near You</Text>
          <ScrollView
            horizontal
            className="p-2 w-[100vw] flex-row"
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            {eventsNearYou?.map((event, index) => (
              <EventCard
                key={index}
                image={event.image_url}
                location={event.location}
                date={new Date(event.event_date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                })}
                onPressed={() => {
                  router.push({
                    pathname: "/(event)/[id]",
                    params: { id: event.id.toString() },
                  });
                }}
                title={event.event_name}
              ></EventCard>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#4A43EC"></StatusBar>
    </SafeAreaView>
  );
};
export default Home;
