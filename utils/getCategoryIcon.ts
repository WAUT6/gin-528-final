import Icons from "@/constants/Icons";

const getCategoryIcon = (category: string) => {
    if (category === "Sports") {
        return Icons.sportsMapIcon;
      } else if (category === "Music") {
        return Icons.musicMapIcon;
      } else if (category === "Food") {
        return Icons.foodMapIcon;
      } else if (category === "Work") {
        return Icons.workMapIcon;
      }
};

export default getCategoryIcon;