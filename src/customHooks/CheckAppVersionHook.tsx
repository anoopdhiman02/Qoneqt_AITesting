import { Linking, Platform} from "react-native";
import { BASE_GO_URL} from "../utils/constants";
import DeviceInfo from "react-native-device-info";
import versionCompare from "../utils/VersionCompare";
import { useCheckVersionStore } from "@/zustand/checkVersionStore";
import axiosInstance from "@/utils/axiosInstance";
import { ENDPOINTS } from "@/utils/endPoints";

const useCheckAppVersionHook = () => {
  const {
    setUpdateAvailable,
    setAppName,
    setAppStoreUrl,
    setForceUpdate,
    setIsSkipped,
    setLinkedin,
    setOS,
    setVersion,
    setId,
  } = useCheckVersionStore();
  const checkAppVersion = async () => {
    try {
      const response = await axiosInstance.get(`${BASE_GO_URL}${ENDPOINTS.Check_Version}`);
      const data = response.data?.data;
      let CheckVersionData: any = {};

      if (Platform.OS === "android") {
        CheckVersionData = data?.android;
      } else {
        CheckVersionData = data?.ios;
      }

      const {
        id,
        app_name,
        version,
        os,
        force_update,
        linkedin,
        app_store_url,
      } = CheckVersionData;

      // Assuming your API returns the latest version
      const currentVersion = DeviceInfo.getVersion();
      var versions = version;
      setLinkedin(linkedin);

      if (versionCompare(versions, currentVersion) > 0) {
        setUpdateAvailable(true);
        setAppName(app_name);
        setVersion(version);
        setForceUpdate(force_update);
      } else {
        setUpdateAvailable(false);
      }
    } catch (error) {}
  };

  const onPressUpdateHandler = () => {
    Linking.openURL(
      Platform.OS === "ios"
        ? "https://apps.apple.com/us/app/qoneqt/id1570117043"
        : "https://play.google.com/store/apps/details?id=com.qoneqt.android&pcampaignid=web_share"
    );
  };

  const onPressSkip = () => {
    setIsSkipped(true);
    setUpdateAvailable(false);
  };
  return {
    checkAppVersion,
    onPressUpdateHandler,
    onPressSkip,
  };
};

export default useCheckAppVersionHook;
