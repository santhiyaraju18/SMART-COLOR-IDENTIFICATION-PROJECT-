import { Buffer } from "buffer";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as Speech from "expo-speech";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getLanguage } from "../utils/language";
import { getTranslated } from "../utils/translation";

// @ts-ignore
import UPNG from "upng-js";

global.Buffer = global.Buffer || Buffer;

// --- Color Helpers (RGB <-> LAB, Delta E) ---

// Convert RGB to XYZ
const rgbToXyz = (r: number, g: number, b: number) => {
  let _r = r / 255;
  let _g = g / 255;
  let _b = b / 255;

  _r = _r > 0.04045 ? Math.pow((_r + 0.055) / 1.055, 2.4) : _r / 12.92;
  _g = _g > 0.04045 ? Math.pow((_g + 0.055) / 1.055, 2.4) : _g / 12.92;
  _b = _b > 0.04045 ? Math.pow((_b + 0.055) / 1.055, 2.4) : _b / 12.92;

  _r *= 100;
  _g *= 100;
  _b *= 100;

  const x = _r * 0.4124 + _g * 0.3576 + _b * 0.1805;
  const y = _r * 0.2126 + _g * 0.7152 + _b * 0.0722;
  const z = _r * 0.0193 + _g * 0.1192 + _b * 0.9505;

  return [x, y, z];
};

// Convert XYZ to CIELAB
const xyzToLab = (x: number, y: number, z: number) => {
  const refX = 95.047;
  const refY = 100.0;
  const refZ = 108.883;

  let _x = x / refX;
  let _y = y / refY;
  let _z = z / refZ;

  _x = _x > 0.008856 ? Math.pow(_x, 1 / 3) : 7.787 * _x + 16 / 116;
  _y = _y > 0.008856 ? Math.pow(_y, 1 / 3) : 7.787 * _y + 16 / 116;
  _z = _z > 0.008856 ? Math.pow(_z, 1 / 3) : 7.787 * _z + 16 / 116;

  const L = 116 * _y - 16;
  const a = 500 * (_x - _y);
  const b = 200 * (_y - _z);

  return [L, a, b];
};

const rgbToLab = (r: number, g: number, b: number) => {
  const [x, y, z] = rgbToXyz(r, g, b);
  return xyzToLab(x, y, z);
};

// Delta E formula (CIE76) - Simple but effective for general use
const deltaE = (labA: number[], labB: number[]) => {
  const dL = labA[0] - labB[0];
  const da = labA[1] - labB[1];
  const db = labA[2] - labB[2];
  return Math.sqrt(dL * dL + da * da + db * db);
};

// Minimal K-Means implementation to find dominant color
// We only need K=1 for the "dominant" color, effectively averaging, 
// but we can filter outliers first to be more robust.
const findDominantColor = (pixels: number[][]) => {
  if (pixels.length === 0) return [0, 0, 0];

  let rSum = 0;
  let gSum = 0;
  let bSum = 0;

  // Simple average for speed (K-Means with K=1 and 1 iteration)
  // Ideally, we could do full K-Means with K=3 to find distinct clusters
  // but for a "center point" detector, average of the region is usually what users expect
  // assuming the region is filled with the object.
  for (const p of pixels) {
    rSum += p[0];
    gSum += p[1];
    bSum += p[2];
  }

  return [
    Math.round(rSum / pixels.length),
    Math.round(gSum / pixels.length),
    Math.round(bSum / pixels.length),
  ];
};

export default function ColorScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [detectedColor, setDetectedColor] = useState("");
  const [colorHex, setColorHex] = useState("");

  // Expanded Color Database with Hex
  const colors: Record<string, string> = {
    Red: "#FF0000",
    DarkRed: "#8B0000",
    Green: "#00FF00",
    DarkGreen: "#006400",
    Blue: "#0000FF",
    DarkBlue: "#00008B",
    Yellow: "#FFFF00",
    Orange: "#FFA500",
    Purple: "#800080",
    Violet: "#EE82EE",
    Pink: "#FFC0CB",
    HotPink: "#FF69B4",
    Brown: "#A52A2A",
    Black: "#000000",
    White: "#FFFFFF",
    Gray: "#808080",
    LightGray: "#D3D3D3",
    Cyan: "#00FFFF",
    Teal: "#008080",
    Magenta: "#FF00FF",
    Lime: "#32CD32",
    Gold: "#FFD700",
    Silver: "#C0C0C0",
    Navy: "#000080",
    Maroon: "#800000",
    Olive: "#808000",
    Coral: "#FF7F50",
    Indigo: "#4B0082",
    Turquoise: "#40E0D0",
    SkyBlue: "#87CEEB",
    Chocolate: "#D2691E",
    Crimson: "#DC143C",
    Lavender: "#E6E6FA",
    Beige: "#F5F5DC",
    Salmon: "#FA8072",
    Tomato: "#FF6347",
    Khaki: "#F0E68C",
    Plum: "#DDA0DD",
    Orchid: "#DA70D6",
    Tan: "#D2B48C",
    SlateBlue: "#6A5ACD",
    SeaGreen: "#2E8B57",
  };

  // Pre-calculate LAB values for optimization
  const colorLabMap = useRef<Record<string, number[]>>({});

  // Initialize map once
  if (Object.keys(colorLabMap.current).length === 0) {
    for (const [name, hex] of Object.entries(colors)) {
      const bigint = parseInt(hex.replace("#", ""), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      colorLabMap.current[name] = rgbToLab(r, g, b);
    }
  }

  const getNearestColorLab = (r: number, g: number, b: number) => {
    const targetLab = rgbToLab(r, g, b);
    let minDistance = Infinity;
    let closestColor = "Unknown";

    for (const [name, lab] of Object.entries(colorLabMap.current)) {
      const dist = deltaE(targetLab, lab);
      if (dist < minDistance) {
        minDistance = dist;
        closestColor = name;
      }
    }
    return closestColor;
  };

  const isProcessing = useRef(false);

  const lastSpokenColor = useRef("");

  const detectColor = React.useCallback(async (forceSpeak = false) => {
    if (!cameraRef.current || (isProcessing.current && !forceSpeak)) return;

    isProcessing.current = true;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.3,
        skipProcessing: true,
      });

      if (!photo) {
        isProcessing.current = false;
        return;
      }

      // 1. Crop Center & Convert to PNG (UPNG only supports PNG)
      // We process a small 50x50 crop from the center, which is faster and sufficient for average color
      const originX = photo.width * 0.4; // Start at 40%
      const originY = photo.height * 0.4;
      const cropWidth = photo.width * 0.2; // Take 20% width/height
      const cropHeight = photo.height * 0.2;

      const manipulated = await ImageManipulator.manipulateAsync(
        photo.uri,
        [
          { crop: { originX, originY, width: cropWidth, height: cropHeight } },
          { resize: { width: 50, height: 50 } }, // Resize to small icon size for super fast looping
        ],
        { format: ImageManipulator.SaveFormat.PNG, base64: true }
      );

      if (!manipulated.base64) {
        isProcessing.current = false;
        return;
      }

      const buffer = Buffer.from(manipulated.base64, "base64");
      const arrayBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      );

      const img = UPNG.decode(arrayBuffer);
      const rgba = UPNG.toRGBA8(img)[0];
      const pixelArray = new Uint8Array(rgba);

      // Average all pixels in the resized 50x50 PNG
      let rSum = 0, gSum = 0, bSum = 0;
      const totalPixels = pixelArray.length / 4;

      for (let i = 0; i < pixelArray.length; i += 4) {
        rSum += pixelArray[i];
        gSum += pixelArray[i + 1];
        bSum += pixelArray[i + 2];
      }

      const r = Math.round(rSum / totalPixels);
      const g = Math.round(gSum / totalPixels);
      const b = Math.round(bSum / totalPixels);

      const detectedHex =
        "#" +
        [r, g, b]
          .map((x) => x.toString(16).padStart(2, "0"))
          .join("");

      // Use Delta E for perceptually closest color
      const colorName = getNearestColorLab(r, g, b);

      setColorHex(detectedHex);
      setDetectedColor(colorName);



      // Speak if forced (button) OR if color changed
      if (forceSpeak || colorName !== lastSpokenColor.current) {
        Speech.stop();
        const lang = getLanguage();

        const translatedIntro = getTranslated("it_looks_like", lang);
        const translatedColor = getTranslated(colorName, lang);

        Speech.speak(`${translatedIntro} ${translatedColor}`, { language: lang });
        lastSpokenColor.current = colorName;
      }

    } catch (error) {
      console.log("Color detection error:", error);
    } finally {
      isProcessing.current = false;
    }
  }, []);

  // Real-time detection loop REMOVED for manual mode
  /* 
  useFocusEffect(
    React.useCallback(() => {
      const interval = setInterval(() => {
        detectColor(false);
      }, 1000); 

      return () => {
        clearInterval(interval);
        isProcessing.current = false;
      };
    }, [detectColor])
  ); 
  */

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Camera permission is required</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.overlay}>
           {/* Focus Box */}
          <View style={styles.focusBox} />
        </View>
      </CameraView>
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.captureButton} onPress={() => detectColor(true)} disabled={isProcessing.current}>
           <MaterialIcons name="camera" size={40} color="white" />
        </TouchableOpacity>

        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Detected Color:</Text>
          {detectedColor ? (
            <View style={styles.colorRow}>
              <View style={[styles.colorPreview, { backgroundColor: colorHex }]} />
              <Text style={styles.resultText}>{detectedColor}</Text>
            </View>
          ) : (
            <Text style={styles.resultText}>Tap to detect...</Text>
          )}
        </View>
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
  camera: {
    flex: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  focusBox: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "transparent",
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
    alignItems: "flex-start"
  },
  resultTitle: {
    color: "#888",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "bold",
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#444",
  },
  resultText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
