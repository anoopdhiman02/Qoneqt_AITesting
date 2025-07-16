import React, { useRef, useCallback, useState } from "react";
import CommentsBottomSheet from "@/app/(features)/(viewPost)/component/CommentsBottomSheet";
import ProfileOptionBottomSheet from "@/components/bottomSheet/ProfileOptionBottomSheet";
import BlockUserBottomSheet from "@/components/bottomSheet/BlockUserBottomSheet";

const useBottomSheetRefs = () => {
  const commentRef = useRef(null);
  const profileRef = useRef(null);
  const blockUserRef = useRef(null);
  const shareChannelRef = useRef(null);

  return {
    commentRef,
    profileRef,
    blockUserRef,
    shareChannelRef,
  };
};

const MemoizedCommentsSheet = React.memo(CommentsBottomSheet);
const MemoizedProfileOptionSheet = React.memo(ProfileOptionBottomSheet);
const MemoizedBlockUserSheet = React.memo(BlockUserBottomSheet);

const BottomSheets = ({
  commentData,
  onPressCommentUser,
  onDeletePostOption,
  screen,
  screen_type,
  postGroupData,
  userId,
  postedByUserId,
  onPressReportOption,
  onPressBlockOption,
  onSubmitBlockHandler,
  blockLoading,
  reportUserDetails,
  commentRef,
  profileRef,
  blockUserRef,
  isComment,
  onPressEditOption
}) => {

  return (
    <>
      <MemoizedCommentsSheet
        onOpenSheet={commentRef}
        commentData={commentData}
        onPress={onPressCommentUser}
      />

      <MemoizedProfileOptionSheet
        onDeletePostOption={onDeletePostOption}
        profileOptionRef={profileRef}
        screen={screen}
        screen_type={screen_type}
        postGroupData={postGroupData}
        userId={userId}
        postedByUserId={postedByUserId}
        onPressReportOption={onPressReportOption}
        onPressBlockOption={onPressBlockOption}
        onPressEditOption={onPressEditOption}
      />

      <MemoizedBlockUserSheet
        BlockUserRef={blockUserRef}
        onPressBlockButton={() =>
          onSubmitBlockHandler({
            profileId: reportUserDetails?.reportId,
            isBlock: 1,
          })
        }
        loading={blockLoading}
      />
    </>
  );
};

export default BottomSheets;
export { useBottomSheetRefs };
