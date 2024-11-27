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

const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  useEffect(() => {
    if (signedUp) {
      router.push("/(tabs)/home");
    }
  }, [signedUp]);

  const submit = async () => {
    if (!form.email || !form.password || !form.username) {
      setSubmitting(false);
      return;
    }
    try {
      setSubmitting(true);
      let token = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { username: form.username },
        },
      });

      if (token.error) {
        setSubmitting(false);
        return;
      }

      setSubmitting(false);
      setSignedUp(true);
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
          placeHolder="John Doe"
          type={InputType.Default}
          onChange={(e) => {
            setForm({ ...form, username: e });
          }}
          value={form.username}
          prefixIcon={Icons.profileIcon}
          otherStyles="mb-5"
        ></InputField>
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
        title="Sign Up"
        onPress={submit}
        containerStyles="mt-10"
        isLoading={submitting}
      ></LargeButton>
      <Text className=" font-pregular mt-2">
        Already have an account?{" "}
        <Link href={"/sign-in"} className="font-pbold text-primary">
          Sign In
        </Link>
      </Text>
      <StatusBar style="dark"></StatusBar>
    </SafeAreaView>
  );
};
export default SignUp;
