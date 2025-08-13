import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useMemo } from 'react'
import { ImageFallBackUser } from '@/utils/ImageUrlConcat';
import { CommentIcon, OptionsIcon, ShareIcon, VerifiedIcon } from '@/assets/DarkIcon';
import { fontFamilies } from '@/assets/fonts';
import { globalColors } from '@/assets/GlobalColors';
import moment from 'moment';

interface PostHeaderProps {
    data?: any;
    userId?: any;
    onPressProfile?: () => void;
    onPressGroup?: () => void;
    onPressPostOption?: (data?: any) => void;
    setPostId?: (postId?: any) => void;
    setPostedByUserId?: (postedByUserId?: any) => void;
    setDeleteUserId?: (deleteUserId?: any) => void;
}

// Memoized components for better performance
const MemoizedImageFallBackUser = memo(ImageFallBackUser);
const MemoizedVerifiedIcon = memo(VerifiedIcon);
const MemoizedOptionsIcon = memo(OptionsIcon);



const PostHeaderComponent: React.FC<PostHeaderProps> = ({data, 
    userId, 
    onPressProfile, 
    onPressGroup, 
    onPressPostOption,
    setPostId,
    setPostedByUserId,
    setDeleteUserId }) => {
    const handleProfilePress = () => {
        // onPressProfile?.();
      };
      const handleGroupPress = () => {
        // onPressGroup?.();
      };
      const handleOptionsPress = () => {
        // onPressPostOption?.(data);
      };

       const timeAgo = useMemo(() => {
          return moment.utc(data?.time).utcOffset("+05:30").fromNow();
        }, [data?.time]);
      
        const groupName = useMemo(() => {
          return data?.loop_id_conn?.loop_name || data?.loop_group?.loop_name;
        }, [data?.loop_id_conn?.loop_name, data?.loop_group?.loop_name]);
  return (
    <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleProfilePress} style={styles.profileContainer}>
            {/* <MemoizedImageFallBackUser
              imageData={data?.post_by?.profile_pic}
              fullName={data?.post_by?.full_name}
              widths={40}
              heights={40}
              borders={40}
            /> */}
          </TouchableOpacity>
    
          <View style={styles.contentContainer}>
            <TouchableOpacity onPress={handleProfilePress} style={styles.nameContainer}>
              <Text style={styles.nameText}>
                {data?.post_by?.full_name}
              </Text>
              {/* {data?.post_by?.kyc_status === 1 && (
                <MemoizedVerifiedIcon style={styles.verifiedIcon} />
              )} */}
            </TouchableOpacity>
    
            <View style={styles.metaContainer}>
              <Text style={styles.timeText}>
                {timeAgo}
              </Text>
              <View style={styles.dot} />
              <TouchableOpacity onPress={handleGroupPress}>
                <Text style={styles.groupText}>
                  {groupName}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
    
          {/* <TouchableOpacity onPress={handleOptionsPress} style={styles.optionsContainer}>
            <MemoizedOptionsIcon width={24} height={24} />
          </TouchableOpacity> */}
        </View>
  )
}

export default PostHeaderComponent

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "4%",
        width: "96%",
        marginHorizontal: "2%",
      },
      profileContainer: {
        flexDirection: "row",
        alignItems: "center",
      },
      contentContainer: {
        flex: 1,
        marginLeft: "2%",
      },
      nameContainer: {
        flexDirection: "row",
        alignItems: "center",
      },
      nameText: {
        fontSize: 16,
        fontFamily: fontFamilies.bold,
        color: globalColors.neutral_white[200],
      },
      verifiedIcon: {
        marginLeft: 1,
        marginTop: 3,
      },
      metaContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
      },
      timeText: {
        fontSize: 12,
        lineHeight: 14,
        fontFamily: fontFamilies.regular,
        color: globalColors.neutral_white[300],
      },
      dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: globalColors.neutral7,
        marginHorizontal: 8,
      },
      groupText: {
        fontSize: 12,
        lineHeight: 14,
        fontFamily: fontFamilies.regular,
        color: globalColors.neutral_white[300],
      },
      optionsContainer: {
        marginLeft: "2%",
      },
})