import ProfileEventCard from "@/components/ProfileEventCard";
import Icons from "@/constants/Icons";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import supabase from "../supabaseClient";
import { Json } from "@/database.types";
const Profile = () => {
  useNavigation().setOptions({ headerShown: false });
  const [myReservations, setMyReservations] = useState<
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

  const fetchMyReservations = async () => {
    if (!userId) return;
    const response = await supabase
      .from("reservations")
      .select("*")
      .eq("user_id", userId);
    if (response.error) {
      console.warn(response.error);
      return;
    }
    const eventIds = response.data.map((reservation) => reservation.event_id);
    const events = await supabase.from("events").select("*").in("id", eventIds);
    if (events.error) {
      console.warn(events.error);
      return;
    }
    setMyReservations(events.data);
  };

  const [myEvents, setMyEvents] = useState<
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

  const [userId, setUserId] = useState<string>();
  const [user, setUser] = useState<{
    created_at: string;
    email: string;
    id: number;
    metadata: Json;
    uuid: string;
  }>();

  useEffect(() => {
    if (!userId) return;
    fetchMyReservations();
  }, [userId]);

  const fetchUser = async () => {
    if (!userId) return;
    const response = await supabase
      .from("users")
      .select("*")
      .eq("uuid", userId)
      .single();
    if (response.error) {
      console.warn(response.error);
      return;
    }
    setUser(response.data);
  };

  useEffect(() => {
    if (!userId) return;
    fetchUser();
  }, [userId]);

  const fetchUserId = async () => {
    const user = await supabase.auth.getSession();
    if (user.error) {
      console.warn(user.error);
      return;
    }
    setUserId(user.data.session?.user.id);
  };

  const fetchMyEvents = async () => {
    const response = await supabase
      .from("events")
      .select("*")
      .eq("host_id", userId!);
    if (response.error) {
      console.warn(response.error);
      return;
    }
    setMyEvents(response.data);
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) fetchMyEvents();
  }, [userId]);

  const handleDelete = (eventId: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this event?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // Perform the delete action here
            console.log("Deleting event with id: ", eventId);
            await supabase.from("events").delete().eq("id", eventId);
            setMyEvents((prev) =>
              prev?.filter((event) => event.id !== eventId)
            );
            router.reload();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView className="bg-white">
      <View className="h-full w-full px-6 pt-6">
        <View className="flex-row w-full justify-start items-center">
          <TouchableOpacity onPress={() => router.dismiss()}>
            <Image source={Icons.backBlackIcon}></Image>
          </TouchableOpacity>
          <Text className="font-psemibold ml-3 text-xl">Profile</Text>
        </View>
        <View className="mt-8 w-full justify-center items-center">
          <View className="h-24 w-24 rounded-full bg-red-500 shadow-black shadow-xl"></View>
          <Text className="mt-4 text-xl font-psemibold">
            {!user && "Loading..."}
            {user && (user.metadata as { username: string }).username}
          </Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mt-4">
            <Text className=" font-pbold text-xl">Your Events</Text>
            {myEvents?.map((event) => (
              <ProfileEventCard
                key={event.id}
                image={event.image_url}
                id={event.id.toString()}
                title={event.event_name}
                date={new Date(event.event_date).toISOString()}
                location={event.location}
                onEditPressed={() => {
                  router.push({
                    pathname: "/(event)/(edit)/[id]",
                    params: { id: event.id.toString() },
                  });
                }}
                onDeletePressed={async () => {
                  handleDelete(event.id);
                }}
              ></ProfileEventCard>
            ))}
          </View>
          <View className="mt-4">
            <Text className=" font-pbold text-xl">Your Reservations</Text>
            {myReservations?.map((event) => (
              <ProfileEventCard
                key={event.id}
                isReservation={true}
                image={event.image_url}
                id={event.id.toString()}
                title={event.event_name}
                date={new Date(event.event_date).toISOString()}
                location={event.location}
                onEditPressed={() => {
                  router.push({
                    pathname: "/(event)/(edit)/[id]",
                    params: { id: event.id.toString() },
                  });
                }}
                onDeletePressed={async () => {
                  handleDelete(event.id);
                }}
              ></ProfileEventCard>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default Profile;
