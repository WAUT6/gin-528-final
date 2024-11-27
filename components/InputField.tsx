import { InputType } from "@/constants/InputTypes";
import { useState } from "react";
import { View, Text, TextInput, Image } from "react-native";
const InputField = ({
  placeHolder,
  prefixIcon,
  onChange,
  value,
  type,
  otherStyles,
}: {
  placeHolder: string;
  prefixIcon: any;
  onChange: (text: string) => void;
  value: string;
  type: InputType;
  otherStyles?: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View
      className={`flex-row h-16 w-full items-center px-4 rounded-2xl border-secondary border-[1px] ${otherStyles}`}
    >
      <Image
        source={prefixIcon}
        className="w-6 h-6 mr-4"
        resizeMode="contain"
      ></Image>
      <TextInput
        onChangeText={onChange}
        placeholder={placeHolder}
        placeholderTextColor={"#747688"}
        value={value}
        secureTextEntry={type === InputType.Password && !showPassword}
        className="flex-1 font-psemibold text-secondary"
      ></TextInput>
    </View>
  );
};
export default InputField;
