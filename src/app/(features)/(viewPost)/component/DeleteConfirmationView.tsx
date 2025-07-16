import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from './styles'
import { globalColors } from '@/assets/GlobalColors'

interface DeleteConfirmationViewProps {
    handleModalCancel: () => void;
    handleModalConfirm: () => void;
}

const DeleteConfirmationView = ({ handleModalCancel, handleModalConfirm }: DeleteConfirmationViewProps) => {
  return (
    <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Delete Comment</Text>
                <Text style={styles.modalMessage}>
                  Are you sure you want to delete this comment?
                </Text>
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      { backgroundColor: globalColors.neutral6 },
                    ]}
                    onPress={handleModalCancel}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: "#FF6B6B" }]}
                    onPress={handleModalConfirm}
                  >
                    <Text style={styles.modalButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
  )
}

export default DeleteConfirmationView