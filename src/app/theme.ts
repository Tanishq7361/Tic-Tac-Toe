import { createDarkTheme, type BrandVariants } from "@fluentui/react-components";

const brandRamp: BrandVariants = {
  10: "#F5F2FF",
  20: "#EAE4FF",
  30: "#D9CEFF",
  40: "#C5B5FF",
  50: "#AF99FF",
  60: "#9A80FF",
  70: "#896BFF",
  80: "#7C5CFC",
  90: "#6949E9",
  100: "#5637D1",
  110: "#462BB5",
  120: "#382198",
  130: "#2C197B",
  140: "#21135F",
  150: "#180E46",
  160: "#10092F",
};

export const appTheme = {
  ...createDarkTheme(brandRamp),
  colorNeutralBackground1: "#131A2E",
  colorNeutralBackground2: "#0B1020",
  colorNeutralBackground3: "#080C18",
  colorNeutralBackground1Hover: "#19223A",
  colorNeutralBackground1Pressed: "#1E2944",
  colorNeutralBackground1Selected: "#211B3D",
  colorNeutralForeground1: "#F4F5FC",
  colorNeutralForeground2: "#9AA4BF",
  colorNeutralStroke1: "#27314B",
  colorNeutralStroke2: "#35415E",
  colorBrandBackground: "#7C5CFC",
  colorBrandForeground1: "#A893FF",
  colorPaletteTealBackground2: "#35D6C1",
};
