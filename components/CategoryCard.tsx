import { View, Text, Image, TouchableOpacity } from "react-native";
const CategoryCard = ({
  title,
  icon,
  color,
  onPressed,
}: {
  title: string;
  icon: any;
  color: string;
  onPressed: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPressed}
      className=" flex-row items-center justify-evenly h-[40px] rounded-3xl min-w-[110px] mr-3"
      style={{ backgroundColor: color }}
    >
      <Image source={icon}></Image>
      <Text className="font-pregular text-white text-md text-center mt-1">
        {title}
      </Text>
    </TouchableOpacity>
  );
};
export default CategoryCard;
