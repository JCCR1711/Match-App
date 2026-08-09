import { theme } from "@/src/theme";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react-native";

type IconColorToken = keyof typeof theme.iconColors;
type IconSizeToken = keyof typeof theme.iconSizes;

interface CustomIconProps {
  icon: IconSvgElement;
  color?: string;
  colorToken?: IconColorToken;
  size?: number;
  sizeToken?: IconSizeToken;
  strokeWidth?: number;
}

const CustomIcon = ({
  icon,
  color,
  colorToken = "primary",
  size,
  sizeToken = "medium",
  strokeWidth = 2.2,
}: CustomIconProps) => (
  <HugeiconsIcon
    icon={icon}
    color={color ?? theme.iconColors[colorToken]}
    size={size ?? theme.iconSizes[sizeToken]}
    strokeWidth={strokeWidth}
  />
);

export default CustomIcon;
