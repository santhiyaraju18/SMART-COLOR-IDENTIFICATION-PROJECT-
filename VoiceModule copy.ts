import * as Speech from "expo-speech";

export function speakColor(color: string) {
  Speech.speak(`The detected color is ${color}`, {
    rate: 0.9,
    pitch: 1.0,
  });
}
