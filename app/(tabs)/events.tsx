import { useEffect, useRef, useState } from "react";
import { View, Text, SafeAreaView, Image, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as MapLocation from "expo-location";
import { StatusBar } from "expo-status-bar";
import supabase from "../supabaseClient";
import getCategoryIcon from "@/utils/getCategoryIcon";
import MapEventCard from "@/components/MapEventCard";
import Icons from "@/constants/Icons";
import { debounce } from "lodash";

const Events = () => {
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }>();
  const [myLocation, setMyLocation] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }>();
  const [nearbyEvents, setNearbyEvents] = useState<
    {
      id: number;
      created_at: string;
      event_name: string;
      event_date: number;
      location: string;
      max_capacity: number;
      ticket_price: number;
      image_url: string;
      host_id: string;
      category_id: number;
      event_description: string;
      latitude: number;
      longitude: number;
      category_name: string;
    }[]
  >([]);
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

  const mapRef = useRef<MapView>(null);

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
    setNearbyEvents(data);
  };

  const debouncedFetchNearbyEvents = useRef(
    debounce((location) => {
      fetchNearbyEvents(location);
    }, 1000)
  ).current;

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (!myLocation) {
      return;
    }
    debouncedFetchNearbyEvents(myLocation);
  }, [myLocation]);

  return (
    <SafeAreaView className="w-full h-full bg-white">
      <MapView
        ref={mapRef}
        initialRegion={myLocation}
        showsUserLocation={true}
        style={{
          width: "100%",
          height: "100%",
        }}
        region={region || myLocation}
      >
        {nearbyEvents.map((event) => {
          console.log(event.latitude, event.longitude);
          return (
            <Marker
              key={event.id}
              coordinate={{
                latitude: event.latitude,
                longitude: event.longitude,
              }}
              title={event.event_name}
              description={event.location}
              image={getCategoryIcon(event.category_name)}
              onPress={(event) => {
                const { latitude, longitude } = event.nativeEvent.coordinate;
                mapRef.current?.animateToRegion({
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                });
                setRegion({
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                });
              }}
            ></Marker>
          );
        })}
      </MapView>
      <ScrollView
        className="absolute bottom-0 h-[120px] w-full px-2"
        horizontal
        centerContent
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {nearbyEvents.map((event) => (
          <MapEventCard
            key={event.id}
            id={event.id.toString()}
            title={event.event_name}
            date={new Date(event.event_date).toString()}
            location={event.location}
            image={event.image_url}
            onPressed={() => {
              mapRef.current?.animateToRegion({
                latitude: event.latitude,
                longitude: event.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              });
            }}
          ></MapEventCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
export default Events;
