import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#4A90E2" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="color"
        options={{
          title: "Color ID",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="color-lens" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="read"
        options={{
          title: "Read Text",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="text-fields" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="clothing"
        options={{
          title: "Outfit Match",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="checkroom" size={24} color={color} />
          ),
        }}
      />
      {/* Hide other screens from tabs if necessary, or let them be auto-discovered if not adding explicit options */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="second"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

