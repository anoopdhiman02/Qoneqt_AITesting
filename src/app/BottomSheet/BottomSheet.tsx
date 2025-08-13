import React, { useRef } from "react";
import ProfileOptionBottomSheet from "@/components/bottomSheet/ProfileOptionBottomSheet";
import BlockUserBottomSheet from "@/components/bottomSheet/BlockUserBottomSheet";

const useBottomSheetRefs = () => {
  const profileRef = useRef(null);
  const blockUserRef = useRef(null);

  return {
    profileRef,
    blockUserRef,
  };
};

const MemoizedProfileOptionSheet = React.memo(ProfileOptionBottomSheet);
const MemoizedBlockUserSheet = React.memo(BlockUserBottomSheet);

const BottomSheets = ({
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
  profileRef,
  blockUserRef,
  onPressEditOption
}) => {

  return (
    <>
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
