import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

import supabase from "./supabaseClient";

import "../global.css";
import { GlobalStateProvider } from "./GlobalState";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [userLoaded, setUserLoaded] = useState(false);
  const [loaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
  });

  useEffect(() => {
    const checkUser = async () => {
      let session = await supabase.auth.getSession();
      if (session.error || session === null) {
        setUserLoaded(false);
        return;
      }

      if (session.data.session === null) {
        setUserLoaded(false);
        return;
      }

      setUserLoaded(true);
    };

    checkUser();
  }, []);

  useEffect(() => {
    SplashScreen.hideAsync();
    setTimeout(() => {
      if (userLoaded) {
        router.push("/(tabs)/home");
      } else {
        router.push("/(auth)/sign-in");
      }
    }, 4000);
  }, [userLoaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GlobalStateProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GlobalStateProvider>
  );
}
