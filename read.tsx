import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as Speech from "expo-speech";
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getLanguage } from "../utils/language";
import { getTranslated } from "../utils/translation";

export default function ReadScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView | null>(null);
    const [loading, setLoading] = useState(false);
    const [detectedText, setDetectedText] = useState("");

    if (!permission) return <View />;

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>Camera permission is required</Text>
                <Button title="Grant Permission" onPress={requestPermission} />
            </View>
        );
    }

    const captureAndRead = async () => {
        if (!cameraRef.current || loading) return;

        setLoading(true);
        setDetectedText("");

        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.5,
            });

            if (!photo) {
                setLoading(false);
                return;
            }

            // Optimize image for OCR
            const manipulated = await ImageManipulator.manipulateAsync(
                photo.uri,
                [{ resize: { width: 800 } }], // Resize to reduce upload size
                { base64: true, compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
            );

            // Call OCR API
            await performOCR(manipulated.base64);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to capture image.");
            setLoading(false);
        }
    };

    const performOCR = async (base64Image: string | undefined) => {
        if (!base64Image) return;

        try {
            // Use FormData for better handling of large payloads
            const formData = new FormData();
            formData.append("base64Image", "data:image/jpeg;base64," + base64Image);
            formData.append("language", "eng");

            const response = await fetch("https://api.ocr.space/parse/image", {
                method: "POST",
                headers: {
                    apikey: "helloworld",
                    // Do NOT set Content-Type header manually when using FormData;
                    // fetch will automatically set it to multipart/form-data with the correct boundary
                },
                body: formData,
            });

            const data = await response.json();

            if (data.IsErroredOnProcessing) {
                Alert.alert("OCR Error", data.ErrorMessage?.[0] || "Failed to process image.");
                setLoading(false);
                return;
            }

            const parsedText = data.ParsedResults?.[0]?.ParsedText;
            const lang = getLanguage();

            if (parsedText) {
                setDetectedText(parsedText);
                const prefix = getTranslated('the_text_says', lang);
                Speech.speak(`${prefix}: ${parsedText}`, { language: lang });
            } else {
                const noTextMsg = getTranslated('no_text_detected', lang);
                setDetectedText(noTextMsg);
                Speech.speak(noTextMsg, { language: lang });
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Network request failed. Please check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} ref={cameraRef}>
                <View style={styles.overlay}>
                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#ffffff" />
                            <Text style={styles.loadingText}>Reading text...</Text>
                        </View>
                    )}
                </View>
            </CameraView>

            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.captureButton}
                    onPress={captureAndRead}
                    disabled={loading}
                >
                    <MaterialIcons name="camera" size={40} color="white" />
                </TouchableOpacity>

                <ScrollView style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>Detected Text:</Text>
                    <Text style={styles.resultText}>
                        {detectedText || "Scan something to read..."}
                    </Text>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    permissionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    permissionText: {
        marginBottom: 10,
        fontSize: 16,
    },
    camera: {
        flex: 2,
    },
    overlay: {
        flex: 1,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
    },
    loadingContainer: {
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    loadingText: {
        color: "white",
        marginTop: 10,
    },
    controls: {
        flex: 1,
        backgroundColor: "#222",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: "center",
    },
    captureButton: {
        backgroundColor: "#4A90E2",
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        marginTop: -50, // Pull button up into camera view slightly
        borderWidth: 4,
        borderColor: "#111",
    },
    resultContainer: {
        width: "100%",
    },
    resultTitle: {
        color: "#888",
        fontSize: 14,
        marginBottom: 5,
        fontWeight: "bold",
    },
    resultText: {
        color: "white",
        fontSize: 16,
        lineHeight: 24,
    },
});
