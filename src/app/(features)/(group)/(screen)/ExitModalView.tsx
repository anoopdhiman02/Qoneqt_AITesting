import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { globalColors } from '@/assets/GlobalColors'
import { fontFamilies } from '@/assets/fonts'

const ExitModalView = ({onCancelExitGroup,onPress}) => {
  return (
   <View style={styles.modalOverlay}>
             <View style={styles.modalContainer}>
               <Text style={styles.modalTitle}>Exit group</Text>
               <Text style={styles.modalMessage}>
                 Are you sure exit this group?
               </Text>
               <View style={styles.modalButtonContainer}>
                 <TouchableOpacity
                   style={styles.modalButton}
                   onPress={onCancelExitGroup}
                 >
                   <Text style={styles.modalButtonText}>Cancel</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   style={styles.modalButton}
                   onPress={onPress}
                 >
                   <Text style={styles.modalButtonText}>Exit</Text>
                 </TouchableOpacity>
               </View>
             </View>
           </View>
  )
}

export default ExitModalView

const styles = StyleSheet.create({
    // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: globalColors.neutral2,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fontFamilies.bold,
    color: globalColors.neutralWhite,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutralWhite,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
    backgroundColor: globalColors.neutral4,
  },
  modalButtonText: {
    color: globalColors.neutralWhite,
    fontFamily: fontFamilies.medium,
  },
})