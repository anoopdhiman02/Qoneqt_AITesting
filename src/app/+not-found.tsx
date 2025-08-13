import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "black" }}>404 - Page Not Found</Text>
      <Button title="Go Home" onPress={() => router.push("/")} />
    </View>
  );
}
