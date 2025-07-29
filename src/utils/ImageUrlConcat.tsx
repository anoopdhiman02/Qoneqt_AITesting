import { Image, ImageBackground } from "expo-image";
import { R2_PUBLIC_URL } from "./constants";
import { memo, useMemo, useRef } from "react";

interface ImageFallBackUserProps {
  imageData?: string;
  fullName?: string;
  borders?: number;
  widths?: number | string;
  heights?: number | string;
  isGroupList?: boolean;
}

export const ImageUrlConcated = (imageData: string) => {
  const testUrl = `${R2_PUBLIC_URL}cdn-cgi/image/fit=scale-down,width=auto,quality=40/`;
  return `${testUrl}${imageData}`;
};


const ImageFallBackUserComponent: React.FC<ImageFallBackUserProps> = ({
  imageData,
  fullName,
  borders,
  widths,
  heights,
  isGroupList,
}) => {
  const isLoading = useRef(true);
  const hasError = useRef(false);

  const mainUrl = `https://qoneqt.com/alphabets/${(fullName || "Q")
    .trim()
    .charAt(0)
    .toUpperCase()}.webp`;

  const parseDimension = (value?: number | string): number | undefined => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  };

  const imageStyle = useMemo(
    () => ({
      borderRadius: borders,
      width: parseDimension(widths),
      height: parseDimension(heights),
    }),
    [borders, widths, heights]
  );

  const handleImageLoad = () => {
    isLoading.current = false;
  };
  const handleImageError = () => {
    isLoading.current = false;
    hasError.current = true;
  };

  const source =
    hasError.current || !imageData
      ? { uri: mainUrl }
      : {
          uri: imageData.startsWith("file")
            ? imageData
            : ImageUrlConcated(imageData),
        };

  const fallbackSource = hasError.current
    ? require("@/assets/image/EmptyProfileIcon.webp")
    : { uri: mainUrl };

  return imageData ? (
    isGroupList ? (
      <ImageBackground style={{ ...imageStyle, backgroundColor: "white" }}>
        <Image
          style={imageStyle}
          contentFit="cover"
          source={source}
          onLoad={handleImageLoad}
          onError={handleImageError}
          cachePolicy="memory-disk" // Best caching option
          transition={100}
        />
      </ImageBackground>
    ) : (
      <Image
        style={imageStyle}
        contentFit="cover"
        source={source}
        onLoad={handleImageLoad}
        onError={handleImageError}
        cachePolicy="memory-disk" // Best caching option
        transition={100}
      />
    )
  ) : (
    <Image
      style={imageStyle}
      contentPosition="center"
      source={fallbackSource}
      onLoad={handleImageLoad}
      onError={handleImageError}
      cachePolicy="memory-disk" // Best caching option
      transition={100}
    />
  );
};

export const ImageFallBackUser = memo(ImageFallBackUserComponent);
