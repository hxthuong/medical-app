import { DimensionValue, Image } from "react-native";

const Avatar = ({
  src,
  width,
  height,
}: {
  src: string;
  width?: number | string;
  height?: number | string;
}) => {
  const srcImg = !src
    ? null
    : src
        .replace("http://localhost", "http://192.168.0.2")
        .replace(":6001", ":3005")
        .replace("accounts\\", "");
  return (
    <Image
      source={
        !srcImg
          ? require("../../assets/images/logo.jpg")
          : {
              uri: srcImg,
            }
      }
      style={{
        marginRight: 15,
        width: (width as DimensionValue) || 50,
        height: (height as DimensionValue) || 50,
        borderRadius:
          typeof width === "number" ? Math.floor((width as number) / 2) : 50,
      }}
    />
  );
};

export default Avatar;
