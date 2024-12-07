import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, usePathname, useRouter } from "expo-router";
import supabase from "@/app/supabaseClient";
import InputField from "@/components/InputField";
import LargeButton from "@/components/LargeButton";
import { Picker } from "@react-native-picker/picker";
import Icons from "@/constants/Icons";
import { InputType } from "@/constants/InputTypes";

const EditEvent = () => {
  const path = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [eventId, setEventId] = useState<string>();
  const [form, setForm] = useState<{
    title: string;
    description: string;
    location: string;
    capacity: string;
    price: string;
    date: number;
    latitude: number | null;
    longitude: number | null;
    image: string | null;
  }>({
    title: "",
    description: "",
    location: "",
    capacity: "",
    price: "",
    date: 0,
    latitude: null,
    longitude: null,
    image: null,
  });

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<
    {
      category_name: string;
      created_at: string;
      id: number;
    }[]
  >([]);
  const [pickedImage, setPickedImage] = useState(null);

  useNavigation().setOptions({ headerShown: false });

  useEffect(() => {
    const pathArray = path.split("/");
    const id = pathArray[pathArray.length - 1];
    setEventId(id);
  }, []);

  const fetchEvent = async () => {
    if (!eventId) return;

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (error) {
      console.warn(error);
      Alert.alert("Error", "Unable to fetch event details.");
      return;
    }

    setForm({
      title: data.event_name,
      description: data.event_description!,
      location: data.location,
      capacity: data.max_capacity.toString(),
      price: data.ticket_price.toString(),
      date: data.event_date,
      latitude: data.latitude,
      longitude: data.longitude,
      image: data.image_url,
    });
    setSelectedCategory(data.category_id);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      console.warn(error);
      return;
    }
    setCategories(data || []);
  };

  useEffect(() => {
    fetchCategories();
    if (eventId) fetchEvent();
  }, [eventId]);

  const handleUpdateEvent = async () => {
    setIsLoading(true);

    if (
      !form.title ||
      !form.description ||
      !form.location ||
      !form.capacity ||
      !form.price ||
      !selectedCategory
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from("events")
      .update({
        event_name: form.title,
        event_description: form.description,
        location: form.location,
        max_capacity: parseInt(form.capacity),
        ticket_price: parseInt(form.price),
        category_id: selectedCategory,
        latitude: form.latitude!,
        longitude: form.longitude!,
        event_date: form.date,
      })
      .eq("id", Number(eventId));

    if (error) {
      console.warn(error);
      Alert.alert("Error", "Unable to update event.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    Alert.alert("Success", "Event updated successfully.");
    router.replace("/(tabs)/home");
  };

  if (!form.title) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-primaryDark w-full h-full">
      <ScrollView className="px-6 mt-14" showsVerticalScrollIndicator={false}>
        <InputField
          prefixIcon={Icons.emailIcon}
          type={InputType.Default}
          placeHolder="Event Title"
          value={form.title}
          onChange={(text) => setForm({ ...form, title: text })}
        />
        <InputField
          prefixIcon={Icons.emailIcon}
          type={InputType.Default}
          placeHolder="Event Description"
          value={form.description}
          onChange={(text) => setForm({ ...form, description: text })}
          otherStyles="mt-6"
        />
        <InputField
          prefixIcon={Icons.emailIcon}
          type={InputType.Default}
          placeHolder="Event Location"
          value={form.location}
          onChange={(text) => setForm({ ...form, location: text })}
          otherStyles="mt-6"
        />
        <InputField
          prefixIcon={Icons.emailIcon}
          type={InputType.Number}
          placeHolder="Event Capacity"
          value={form.capacity}
          onChange={(text) => setForm({ ...form, capacity: text })}
          otherStyles="mt-6"
        />
        <InputField
          prefixIcon={Icons.emailIcon}
          type={InputType.Number}
          placeHolder="Ticket Price"
          value={form.price}
          onChange={(text) => setForm({ ...form, price: text })}
          otherStyles="mt-6"
        />
        <View className="mt-6">
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}
            className="rounded-xl"
            style={{ backgroundColor: "white", borderRadius: 16 }}
          >
            {categories.map((category) => (
              <Picker.Item
                key={category.id}
                label={category.category_name}
                value={category.id}
              />
            ))}
          </Picker>
        </View>
        <LargeButton
          title="Update Event"
          isLoading={isLoading}
          onPress={handleUpdateEvent}
          containerStyles="mt-6 w-full"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditEvent;
