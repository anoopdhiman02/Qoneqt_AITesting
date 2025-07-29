import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import BottomSheetWrap from "@/components/bottomSheet/BottomSheetWrap";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";
import { CheckCircleIcon } from "@/assets/DarkIcon";
import Button1 from "@/components/buttons/Button1";

const EditCategorySheet = ({
  EditCategoryRef,
  categoryList = [],
  onSelectCategory,
  selectCat,
  onPressAddNewCategory,
  onSubmitEditCategoryName,
}) => {
  return (
    <BottomSheetWrap bottomSheetRef={EditCategoryRef}>
      <View
        style={{
          alignItems: "center",
          width: "100%",
          flex: 1,
        }}
      >
        {/* Header Section */}
        <View
          style={{
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 20,
              fontFamily: fontFamilies.semiBold,
            }}
          >
            Edit Category
          </Text>
        </View>

        {/* Description */}
        <View
          style={{ width: "100%", paddingHorizontal: 16, marginBottom: 16 }}
        >
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 16,
            }}
          >
            Select or add your channel category
          </Text>
          <Text style={{ color: globalColors.neutral5, fontSize: 13 }}>
            You can add only one category per group
          </Text>
        </View>

        {/* Category List */}
        <View
          style={{
            width: "100%",
            marginTop: 10,
          }}
        >
          {categoryList?.length > 0 ? (
            categoryList.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => onSelectCategory(item)}
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  marginBottom: 8,
                  borderRadius: 8,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                }}
              >
                {/* Selection Icon */}
                {selectCat?.id === item.id ? (
                  <CheckCircleIcon />
                ) : (
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: globalColors.neutral5,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                )}

                {/* Category Name */}
                <Text
                  style={{
                    color: globalColors.neutralWhite,
                    fontSize: 14,
                    marginLeft: 12,
                    fontFamily: fontFamilies.regular,
                  }}
                >
                  {item.category}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text
              style={{
                color: globalColors.neutral5,
                fontSize: 14,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Please add a new category.
            </Text>
          )}
        </View>

        {/* Footer Section */}
        <View style={{ width: "100%", position: "absolute", bottom: "10%" }}>
          <TouchableOpacity onPress={onPressAddNewCategory}>
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 17,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Add New Category
            </Text>
          </TouchableOpacity>

          <Button1
            title="Continue"
            onPress={() =>
              onSubmitEditCategoryName({
                categoryId: selectCat?.id,
                categoryName: selectCat?.category,
              })
            }
          />
        </View>
      </View>
    </BottomSheetWrap>
  );
};

export default EditCategorySheet;
