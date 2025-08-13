import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CheckItemComponent from "./CheckItemComponent";

const CategoriesList = ({ categoryData, toggleCuisine }: any) => {
  return (
    <View style={styles.container}>
      {categoryData.map((item: any) => (
        <CheckItemComponent
          key={item.id}
          id={item.id}
          label={item.category_name}
          categoryName={item.category_name}
          checked={item.isSelected}
          onPress={toggleCuisine}
        />
      ))}
    </View>
  );
};

export default CategoriesList;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        marginTop: 20,
    },
});
