import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getLanguage, LanguageCode, LANGUAGES, setLanguage } from "../utils/language";

export default function Home() {
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(getLanguage());

  const handleLanguageSelect = (lang: LanguageCode, label: string) => {
    setLanguage(lang);
    setSelectedLang(lang);
    Speech.speak(`Language set to ${label}`, { language: lang }); // Announce choice
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <MaterialIcons name="color-lens" size={60} color="#4A90E2" />
          <Text style={styles.title}>Smart Color Aid</Text>
          <Text style={styles.subtitle}>
            Your personal assistant for real-time color identification.
          </Text>
        </View>

        {/* Language Selection Section */}
        <View style={styles.languageSection}>
          <Text style={styles.sectionTitle}>Select Language</Text>
          <View style={styles.langGrid}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langButton,
                  selectedLang === lang.code && styles.langButtonActive,
                ]}
                onPress={() => handleLanguageSelect(lang.code, lang.label)}
              >
                <Text
                  style={[
                    styles.langText,
                    selectedLang === lang.code && styles.langTextActive,
                  ]}
                >
                  {lang.label}
                </Text>
                <Text
                  style={[
                    styles.langSubText,
                    selectedLang === lang.code && styles.langTextActive,
                  ]}
                >
                  {lang.sub}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>
            Point your camera at any object to hear and see its color instantly.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/color")}
            accessibilityRole="button"
            accessibilityLabel="Start Color Detection"
          >
            <MaterialIcons name="camera-alt" size={24} color="white" style={styles.btnIcon} />
            <Text style={styles.buttonText}>Start Detection</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { marginTop: 15, backgroundColor: "#9B51E0" }]}
            onPress={() => router.push("/clothing")}
            accessibilityRole="button"
            accessibilityLabel="Start Outfit Match"
          >
            <MaterialIcons name="checkroom" size={24} color="white" style={styles.btnIcon} />
            <Text style={styles.buttonText}>Outfit Match</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  languageSection: {
    marginTop: 30,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 15,
    textAlign: "center",
  },
  langGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  langButton: {
    width: "48%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 1,
  },
  langButtonActive: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  langText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  langSubText: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  langTextActive: {
    color: "white",
  },
  content: {
    marginBottom: 30,
    alignItems: "center",
    marginTop: 20,
  },
  description: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  btnIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});