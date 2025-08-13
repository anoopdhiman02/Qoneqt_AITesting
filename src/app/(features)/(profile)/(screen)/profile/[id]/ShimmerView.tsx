import { View, Text } from 'react-native'
import React from 'react'
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import PostLoaderComponent from '@/components/PostLoaderComponent';

const ShimmerView = ({isOtherProfile}: {isOtherProfile?: boolean}) => {
  return (
    <View>
      {isOtherProfile ? (<View style={{ padding: 10, marginBottom: 12 , alignItems: "center"}}>
        <ShimmerPlaceholder
          style={{
            width: 75,
            height: 75,
            borderRadius: 50,
          }}
        />

<ShimmerPlaceholder
        style={{
          width: "50%",
          height: 22,
          borderRadius: 3,
          marginTop: "6%",
        }}
      />
      <ShimmerPlaceholder
        style={{
          width: "50%",
          height: 22,
          borderRadius: 3,
          marginTop: "3%",
        }}
      />
      <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "80%",
            marginTop: "6%",
          }}
        >
          <ShimmerPlaceholder
            style={{
              width: "25%",
              height: 35,
              marginBottom: 16,
              borderRadius: 3,
            }}
          />
          <ShimmerPlaceholder
            style={{
              width: "22%",
              height: 35,
              marginBottom: 16,
              borderRadius: 3,
            }}
          />
          <ShimmerPlaceholder
            style={{
              width: "22%",
              height: 35,
              marginBottom: 16,
              borderRadius: 3,
            }}
          />
        </View>
     
    </View>) : (
    <View style={{ padding: 10, marginBottom: 12 }}>
      
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ShimmerPlaceholder
            style={{
              width: 75,
              height: 75,
              borderRadius: 50,
            }}
          />
          <View
            style={{
              marginLeft: "22%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <ShimmerPlaceholder
              style={{
                width: "25%",
                height: 35,
                marginBottom: 16,
                borderRadius: 3,
              }}
            />
            <ShimmerPlaceholder
              style={{
                width: "22%",
                height: 35,
                marginBottom: 16,
                borderRadius: 3,
              }}
            />
            <ShimmerPlaceholder
              style={{
                width: "22%",
                height: 35,
                marginBottom: 16,
                borderRadius: 3,
              }}
            />
          </View>
        </View>
        <ShimmerPlaceholder
          style={{
            width: "40%",
            height: 22,
            borderRadius: 3,
            marginTop: "6%",
            marginLeft: "3%",
          }}
        />
        <ShimmerPlaceholder
          style={{
            width: "50%",
            height: 22,
            borderRadius: 3,
            marginTop: "3%",
            marginLeft: "3%",
          }}
        />
      </View>
      )}
      {[1, 2, 3].map((index) => <PostLoaderComponent key={index} />)}
    </View>
  )
}

export default ShimmerView