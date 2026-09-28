export function getDominantColor() {
  // Simple logic (can be upgraded later)
  const colors = ["Red", "Green", "Blue", "Yellow", "Black", "White"];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
