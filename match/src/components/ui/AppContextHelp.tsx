import AppBottomSheet from "@/src/components/ui/AppBottomSheet";
import CustomIcon from "@/src/components/ui/CustomIcon";
import CustomText from "@/src/components/ui/CustomText";
import { theme } from "@/src/theme";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface AppContextHelpItem {
  title: string;
  description: string;
}

interface AppContextHelpProps {
  title: string;
  description?: string;
  items?: readonly AppContextHelpItem[];
  iconColor?: string;
}

const AppContextHelp = ({ title, description, items, iconColor = theme.colors.authTextSecondary }: AppContextHelpProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={`Más información sobre ${title}`}
        hitSlop={6}
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
      >
        <CustomIcon icon={InformationCircleIcon} color={iconColor} size={18} strokeWidth={2.25} />
      </Pressable>
      <AppBottomSheet visible={visible} title={title} collapsedHeight={items?.length ? 430 : 260} onClose={() => setVisible(false)}>
        {items?.length ? (
          <View style={styles.list}>
            {items.map((item) => (
              <View key={item.title} style={styles.item}>
                <CustomText text={item.title} variant="action" style={styles.itemTitle} />
                <CustomText text={item.description} variant="body" style={styles.description} />
              </View>
            ))}
          </View>
        ) : description ? (
          <CustomText text={description} variant="body" style={styles.description} />
        ) : null}
      </AppBottomSheet>
    </>
  );
};

export default AppContextHelp;

const styles = StyleSheet.create({
  trigger: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  list: { gap: theme.spacing.lg },
  item: { gap: theme.spacing.xxs },
  itemTitle: { color: theme.colors.white },
  description: { color: theme.colors.textOnDarkSecondary },
  pressed: { opacity: 0.68 },
});
