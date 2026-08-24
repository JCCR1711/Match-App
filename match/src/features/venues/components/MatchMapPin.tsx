import { theme } from "@/src/theme";
import Svg, { Path } from "react-native-svg";

interface MatchMapPinProps {
  size?: number;
  color?: string;
}

const MatchMapPin = ({ size = 44, color = theme.colors.white }: MatchMapPinProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2a8 8 0 0 0-8 8c0 5.25 6.2 11.3 7.15 12.2a1.25 1.25 0 0 0 1.7 0C13.8 21.3 20 15.25 20 10a8 8 0 0 0-8-8Zm0 11.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z"
    />
  </Svg>
);

export default MatchMapPin;
