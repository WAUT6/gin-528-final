import InputField from "@/components/InputField";
import Icons from "@/constants/Icons";
import { InputType } from "@/constants/InputTypes";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import supabase from "../supabaseClient";
import LargeButton from "@/components/LargeButton";
import { useGlobalState } from "../GlobalState";
import { User } from "@supabase/supabase-js";
const CreateEvent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>();
  const fetchCurrentUser = async () => {
    const user = await supabase.auth.getSession();
    if (user.error) {
      console.warn(user.error);
      return;
    }
    setCurrentUser(user.data.session?.user);
  };
  useEffect(() => {
    fetchCurrentUser();
  }, []);
  useNavigation().setOptions({ headerShown: false });
  const { latitude, longitude } = useGlobalState();
  const [date, setDate] = useState(new Date().valueOf());

  const onChange = (event: any, selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    console.log(selectedDate);
    const currentDate = selectedDate;
    setDate(currentDate.valueOf());
    setForm({ ...form, date: currentDate.valueOf() });
  };
  useEffect(() => {
    if (latitude && longitude)
      setForm({
        ...form,
        latitude: latitude,
        longitude,
      });
  }, [latitude, longitude]);
  const [categories, setCategories] = useState<
    {
      category_name: string;
      created_at: string;
      id: number;
    }[]
  >();
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const [pickedImage, setPickedImage] =
    useState<ImagePicker.ImagePickerAsset>();
  const [form, setForm] = useState<{
    title: string;
    description: string;
    location: string;
    capacity: number;
    price: number;
    date: number;
    category: number;
    image?: ImagePicker.ImagePickerAsset;
    latitude: number;
    longitude: number;
  }>({
    title: "",
    description: "",
    location: "",
    capacity: 0,
    price: 0,
    date: new Date().valueOf(),
    category: 0,
    image: undefined,
    latitude: 0,
    longitude: 0,
  });

  const pickImage = async () => {
    const status = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!status.granted) {
      console.warn("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 1,
      base64: true,
    });
    if (result.canceled) {
      return;
    }
    setPickedImage(result.assets[0]);
  };

  useEffect(() => {
    if (pickedImage) {
      setForm({ ...form, image: pickedImage });
    }
  }, [pickedImage]);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      console.log("error", error);
      return;
    }
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory != 0 && selectedCategory) {
      setForm({ ...form, category: selectedCategory });
    }
  }, [selectedCategory]);

  return (
    <SafeAreaView className="bg-primaryDark w-full h-full">
      <ScrollView
        className="px-6 mt-14"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <InputField
          placeHolder="Event Title"
          prefixIcon={Icons.emailIcon}
          type={InputType.Default}
          value={form.title}
          onChange={(text) => {
            setForm({ ...form, title: text });
          }}
        ></InputField>
        <InputField
          placeHolder="Event Description"
          prefixIcon={Icons.emailIcon}
          type={InputType.Default}
          value={form.description}
          onChange={(text) => {
            setForm({ ...form, description: text });
          }}
          otherStyles="mt-6"
        ></InputField>
        <InputField
          placeHolder="Event Location"
          prefixIcon={Icons.emailIcon}
          type={InputType.Default}
          value={form.location}
          onChange={(text) => {
            setForm({ ...form, location: text });
          }}
          otherStyles="mt-6"
        ></InputField>
        <InputField
          placeHolder="Event Capacity"
          prefixIcon={Icons.emailIcon}
          type={InputType.Number}
          value={form.capacity}
          onChange={(text) => {
            setForm({ ...form, capacity: parseInt(text) });
          }}
          otherStyles="mt-6"
        ></InputField>
        <InputField
          placeHolder="Ticket Price"
          prefixIcon={Icons.emailIcon}
          type={InputType.Number}
          value={form.price}
          onChange={(text) => {
            setForm({ ...form, price: parseInt(text) });
          }}
          otherStyles="mt-6"
        ></InputField>
        <View className="mt-6">
          <Picker
            onValueChange={(value: number) => {
              setSelectedCategory(value);
            }}
            className=" rounded-xl"
            style={{ backgroundColor: "white", borderRadius: 16 }}
          >
            {categories?.map((category, index) => {
              return (
                <Picker.Item
                  key={index}
                  label={category.category_name}
                  value={category.id}
                ></Picker.Item>
              );
            })}
          </Picker>
        </View>
        <LargeButton
          title="Pick Image"
          onPress={() => {
            pickImage();
          }}
          containerStyles="mt-6 w-full"
        ></LargeButton>
        <LargeButton
          title="Choose Location"
          onPress={() => {
            router.push("/(event)/choose-location");
          }}
          containerStyles="mt-6 w-full"
        ></LargeButton>
        <LargeButton
          title="Select Date"
          onPress={() => {
            DateTimePickerAndroid.open({
              value: new Date(),
              onChange,
              mode: "date",
              is24Hour: true,
            });
          }}
          containerStyles="mt-6 w-full"
        ></LargeButton>

        <LargeButton
          isLoading={isLoading}
          title="Create Event"
          onPress={async () => {
            setIsLoading(true);
            if (
              !form.image ||
              !form.latitude ||
              !form.longitude ||
              !selectedCategory ||
              !form.title ||
              !form.description ||
              !form.location ||
              !form.capacity ||
              !form.price
            ) {
              setIsLoading(false);
              return;
            }
            if (!pickedImage) {
              setIsLoading(false);
              return;
            }
            if (!currentUser) {
              console.log("no user");
              setIsLoading(false);
              return;
            }
            const response = await supabase.storage
              .from("event_images")
              .upload(`${form.title}-image`, decode(form.image.base64!), {
                contentType: `${form.image.mimeType!}`,
              });
            console.log(form);
            if (response.error) {
              console.warn(response.error);
              setIsLoading(false);
              return;
            }
            const { data, error } = await supabase.from("events").insert({
              event_name: form.title,
              event_description: form.description,
              location: form.location,
              host_id: currentUser.id,
              max_capacity: form.capacity,
              ticket_price: form.price,
              category_id: selectedCategory,
              latitude: form.latitude,
              longitude: form.longitude,
              event_date: form.date,
              image_url: response.data.path,
            });
            if (error) {
              console.warn(error);
              setIsLoading(false);
              return;
            }
            setIsLoading(false);
            router.dismiss();
            router.replace("/(tabs)/home");
          }}
          containerStyles="mt-6 w-full mb-6"
        ></LargeButton>
      </ScrollView>
    </SafeAreaView>
  );
};
export default CreateEvent;
