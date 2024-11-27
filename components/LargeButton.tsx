import { View, Text, TouchableOpacity } from "react-native";
const LargeButton = ({
  title,
  onPress,
  textStyles,
  containerStyles,
  isLoading,
}: {
  title: string;
  onPress: () => void;
  textStyles?: string;
  containerStyles?: string;
  isLoading?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`bg-primary rounded-2xl min-h-[58px] justify-center items-center w-3/4 ${
        isLoading ? "opacity-50" : ""
      } ${containerStyles}`}
      disabled={isLoading}
    >
      <Text className={`text-white font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
export default LargeButton;
