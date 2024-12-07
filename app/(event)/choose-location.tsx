import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, SafeAreaView, Image, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as MapLocation from "expo-location";
import { router, useNavigation } from "expo-router";
import * as MapComplete from "react-native-google-places-autocomplete";
import LargeButton from "@/components/LargeButton";
import { useGlobalState } from "../GlobalState";

const ChooseLocation = () => {
  const apiKey = process.env.EXPO_PUBLIC_MAPS_API_KEY;
  useNavigation().setOptions({ headerShown: false });
  const { setLatitude, setLongitude } = useGlobalState();
  const [myLocation, setMyLocation] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }>();

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    if (!selectedLocation) {
      return;
    }
    mapRef.current?.animateToRegion(
      {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  }, [selectedLocation]);

  const getLocation = async () => {
    const permissionResult =
      await MapLocation.requestForegroundPermissionsAsync();
    if (permissionResult.status !== "granted") {
      console.warn("Permission to access location was denied");
      return;
    }
    const location = await MapLocation.getCurrentPositionAsync({});
    let latitude = 33.6844;
    let longitude = 73.0479;
    if (!location) {
      const lastLocation = await MapLocation.getLastKnownPositionAsync();

      if (lastLocation) {
        latitude = lastLocation.coords.latitude;

        longitude = lastLocation.coords.longitude;
      }
    } else {
      latitude = location.coords.latitude;
      longitude = location.coords.longitude;
    }

    setMyLocation({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <SafeAreaView className="w-full h-full bg-white">
      <MapView
        onPress={(press) => {
          console.log(press.nativeEvent.coordinate);
          setSelectedLocation({
            latitude: press.nativeEvent.coordinate.latitude,
            longitude: press.nativeEvent.coordinate.longitude,
          });
        }}
        ref={mapRef}
        initialRegion={myLocation}
        showsUserLocation={true}
        style={{
          width: "100%",
          height: "100%",
        }}
        region={myLocation}
      >
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
          ></Marker>
        )}
      </MapView>
      <View className="h-[100px] w-full absolute top-10 px-6">
        <MapComplete.GooglePlacesAutocomplete
          placeholder="Choose Location"
          query={{
            key: apiKey,
            language: "en",
          }}
          fetchDetails={true}
          onPress={(_, details) => {
            if (!details) {
              return;
            }
            setSelectedLocation({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            });
          }}
        ></MapComplete.GooglePlacesAutocomplete>
      </View>
      <View className="absolute w-full px-6 bottom-6">
        <LargeButton
          containerStyles="w-full"
          title="Confirm Location"
          onPress={() => {
            if (!selectedLocation) {
              return;
            }
            setLatitude(selectedLocation.latitude);
            setLongitude(selectedLocation.longitude);
            router.dismiss();
          }}
        ></LargeButton>
      </View>
    </SafeAreaView>
  );
};
export default ChooseLocation;
