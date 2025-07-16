import { Image, ImageBackground } from "expo-image";
import { R2_PUBLIC_URL } from "./constants";
import { useState } from "react";

interface ImageFallBackUserProps {
  imageData?: any;
  fullName?: string;
  borders?: number;
  widths?: number;
  heights?: number;
  isGroupList?: boolean;
}

export const ImageUrlConcated = (imageData: string) => {
  const mainUrl = "https://qoneqt.com/";
  const testUrl = `${R2_PUBLIC_URL}cdn-cgi/image/fit=scale-down,width=auto,quality=40/`;
  let ImageUrl = `${testUrl}${imageData}`;

  return ImageUrl;
};

export const ImageFallBackUser: React.FC<ImageFallBackUserProps> = ({
  imageData,
  fullName,
  borders,
  widths,
  heights,
  isGroupList,
}) => {
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [hasError, setHasError] = useState(false); // Error state

  const firstLetter = fullName ? fullName.trim().charAt(0).toUpperCase() : "Q";

  const mainUrl = `https://qoneqt.com/alphabets/${firstLetter}.webp`;
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (imageData) {
    return (
      <>
        {isGroupList ? (
          <ImageBackground
            style={{
              borderRadius: borders,
              width: widths,
              height: heights,
              backgroundColor: "white",
            }}
          >
            <Image
              style={{ borderRadius: borders, width: widths, height: heights }}
              contentFit="cover"
              contentPosition="center" // Centers the content
              source={
                hasError || !imageData
                  ? { uri: mainUrl }
                  : {
                      uri: imageData.startsWith("file")
                        ? imageData
                        : ImageUrlConcated(imageData),
                    } // Main image
              }
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </ImageBackground>
        ) : (
          <Image
            style={{ borderRadius: borders, width: widths, height: heights }}
            contentFit="cover"
            contentPosition="center" // Centers the content
            source={
              hasError || !imageData
                ? { uri: mainUrl } // Fallback image
                : {
                    uri: imageData.startsWith("file")
                      ? imageData
                      : ImageUrlConcated(imageData),
                  } // Main image
            }
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </>
    );
  } else {
    return (
      <Image
        style={{ borderRadius: borders, width: widths, height: heights }}
        contentPosition="center" // Centers the content
        source={
          hasError || !mainUrl
            ? require("@/assets/image/EmptyProfileIcon.webp") // Fallback image
            : { uri: mainUrl } // Main image
        }
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    );
  }
};
