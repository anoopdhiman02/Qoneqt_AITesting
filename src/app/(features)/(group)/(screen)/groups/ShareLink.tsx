import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { globalColors } from '@/assets/GlobalColors'
import { fontFamilies } from '@/assets/fonts'
import { CopyIcon, ShareIcon } from '@/assets/DarkIcon'

const ShareLink = ({onShare, copyToClipboard, groupDetails}:any) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <Text style={styles.shareText}>
          Share this link to join this group
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              onShare(groupDetails?.slug);
            }}
          >
            <ShareIcon height={24} width={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => copyToClipboard(groupDetails?.slug)}
          >
            <CopyIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ShareLink

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    borderRadius: 8,
    backgroundColor: globalColors.darkOrchidShade60,
    borderColor: globalColors.neutral4,
    borderStyle: "solid",
    borderWidth: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "1%",
    marginTop: "5%",
  },
  contentWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shareText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fontFamilies.semiBold,
    color: globalColors.neutral9,
    marginRight: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: 60,
  },
  actionButton: {
    padding: 4,
    marginHorizontal: 6,
  }
})