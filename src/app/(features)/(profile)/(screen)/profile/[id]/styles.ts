import { fontFamilies } from '@/assets/fonts';
import { globalColors } from '@/assets/GlobalColors';
import { StyleSheet } from 'react-native'


const styles = StyleSheet.create({
mainContainer:{
    // flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            // gap: 5,
},
profileButtonStyle:{
    flexDirection: "row", alignItems: "center"
},
followingStyle:{
    color: globalColors.neutralWhite,
                  fontSize: 22,
                  alignSelf: "center",
},
followButtonStyle:{
    flexDirection: "row",
              marginTop: "10%",
              alignItems: "center",
              padding: "1%",
              borderRadius: 10,
},
unFollowIcon:{
    padding: "2%",
                borderRadius: 10,
                backgroundColor: globalColors.slateBlueShade60
},
followText:{
    color: globalColors.neutralWhite,
                    fontFamily: fontFamilies.regular,
                    fontSize: 18,
                    marginLeft: "5%",
},
shareContainer:{
    flexDirection: "row",
              alignItems: "center",
              marginTop: "6%",
},
shareIcon:{
    borderWidth: 0.5,
                borderColor: "#212121",
                padding: "1%",
                borderRadius: 10,
                shadowColor: "#4E4D5B",
                shadowOpacity: 0.2,
                elevation: 1,
},
shareText:{
    color: globalColors.neutralWhite,
                fontSize: 18,
                marginTop: "1%",
                marginLeft: "5%",
},
copyViewStyle:{
    flexDirection: "row",
              alignItems: "center",
              marginTop: "6%",
},
linnerContainer:{
    height: 40,
            width: "40%",
            marginHorizontal: 5,
            // marginTop: "6%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            backgroundColor: globalColors.warmPinkTint100,
},
linnerButton:{
    width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
},
linnerText:{
    fontSize: 14,
                fontFamily: fontFamilies.medium,
                color: globalColors.neutralWhite,
},
feedContainer:{
    width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 10,
},
feedCountText:{
    fontSize: 20,
                fontFamily: fontFamilies.bold,
                color: globalColors.lightPink,
}
})

export default styles;