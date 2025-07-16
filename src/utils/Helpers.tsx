
import { useState } from "react";
import { Alert, Linking } from "react-native";
import Share from "react-native-share";
import 'intl';
import 'intl/locale-data/jsonp/en'; 

//Number Currency
export let rupee = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export const commentTimeFormat = (data) => {
  const regex = /(\d+)\s+(\w+)/;
  const match = regex.exec(data);

  if (match) {
    const number = match[1];
    const unit = match[2];

    // Modify the output based on the unit
    let formattedString;
    switch (unit) {
      case "minutes":
        formattedString = `${number} min`;
        break;
      case "hours":
        formattedString = `${number} hr`;
        break;
      // Add more cases for other units as needed
      default:
        formattedString = data; // Use the original string if the unit is not "minutes"
        break;
    }

    return formattedString;
  } else {
  }
};

export const onShare = async (id) => {
  try {
    // Proceed to share if needed
    const url = `https://qoneqt.com/profile/${id}`;

    // Proceed to share the URL
    const result = await Share.open({
      url: id.id, // Pass the URL as a string
    });

    if (result.success) {
      console.log("Content was shared successfully!");
    }
  } catch (error) {
    console.log("Error during share:", error);
  }
};

export function replaceSpacesWithHyphens(str: string) {
  return str.split(" ").join("-").toLowerCase();
}
