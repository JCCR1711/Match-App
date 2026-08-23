import CustomIcon from "@/src/components/ui/CustomIcon";
import { theme } from "@/src/theme";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

interface ResourceCardArrowProps {
  tone?: "light" | "dark";
}

const ResourceCardArrow = ({ tone = "light" }: ResourceCardArrowProps) => (
  <View style={[styles.container, tone === "dark" && styles.darkContainer]} accessible={false}>
    <CustomIcon
      icon={ArrowUpRight01Icon}
      color={tone === "dark" ? theme.colors.white : theme.colors.black}
      size={23}
      strokeWidth={3}
    />
  </View>
);

export default memo(ResourceCardArrow);

const styles = StyleSheet.create({
  container: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.white,
  },
  darkContainer: { backgroundColor: theme.colors.mediaFloatingSurface },
});
