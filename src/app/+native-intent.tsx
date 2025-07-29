import { router } from "expo-router";

export function redirectSystemPath({ path, initial }) {
  console.log("path", path);
  const newPath = path.replace('com.qoneqt.qoneqt://', ''); // Extract "google/link"
    const path_new = newPath.startsWith('google/') ? "com.qoneqt.qoneqt://" : path;
  try {
    if (initial) {
      return path_new;
    }
     return path_new;
  } catch {
    // Do not crash inside this function! Instead you should redirect users
    // to a custom route to handle unexpected errors, where they are able to report the incident
    return "/unexpected-error";
  }
}
