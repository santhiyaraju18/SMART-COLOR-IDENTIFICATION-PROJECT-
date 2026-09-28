import { CameraView, useCameraPermissions } from "expo-camera";
import { View, Button, StyleSheet, Text } from "react-native";
import { useRef } from "react";

export default function CameraModule({ onCapture }: any) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera permission required</Text>
        <Button title="Allow Camera" onPress={requestPermission} />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      onCapture(photo.uri);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} />
      <Button title="Detect Color" onPress={takePicture} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
