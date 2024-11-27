import { StatusBar } from "expo-status-bar";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Images from "@/constants/Images";
import InputField from "@/components/InputField";
import { InputType } from "@/constants/InputTypes";
import Icons from "@/constants/Icons";
import { useEffect, useState } from "react";
import LargeButton from "@/components/LargeButton";
import { Link, router } from "expo-router";

import supabase from "../supabaseClient";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (signedIn) {
      router.push("/(tabs)/home");
    }
  }, [signedIn]);

  const submit = async () => {
    if (!form.email || !form.password) {
      setSubmitting(false);
      return;
    }
    try {
      setSubmitting(true);
      let token = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (token.error) {
        setSubmitting(false);
        return;
      }

      let response = await supabase.auth.setSession({
        access_token: token.data.session.access_token,
        refresh_token: token.data.session.refresh_token,
      });

      if (response.error) {
        setSubmitting(false);
        return;
      }

      setSubmitting(false);
      setSignedIn(true);
    } catch (error) {
      setSubmitting(false);
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="flex items-center justify-start h-full">
      <View className="flex items-center justify-around mt-16">
        <Image source={Images.logoSmall}></Image>
        <Text className="font-psemibold text-4xl mt-6">EventHub</Text>
      </View>
      <View className="flex items-start justify-around mt-16 w-full px-7">
        <InputField
          placeHolder="email@example.com"
          type={InputType.Email}
          onChange={(e) => {
            setForm({ ...form, email: e });
          }}
          value={form.email}
          prefixIcon={Icons.emailIcon}
          otherStyles="mb-5"
        ></InputField>
        <InputField
          placeHolder="*********"
          type={InputType.Password}
          onChange={(e) => {
            setForm({ ...form, password: e });
          }}
          value={form.password}
          prefixIcon={Icons.passwordIcon}
        ></InputField>
      </View>
      <LargeButton
        title="Sign In"
        onPress={submit}
        containerStyles="mt-10"
        isLoading={submitting}
      ></LargeButton>
      <Text className=" font-pregular mt-2">
        Don't have an account?{" "}
        <Link href={"/sign-up"} className="font-pbold text-primary">
          Sign Up
        </Link>
      </Text>
      <StatusBar style="dark"></StatusBar>
    </SafeAreaView>
  );
};
export default SignIn;
