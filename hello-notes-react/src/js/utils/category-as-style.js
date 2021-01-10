const backgroundCols = {
  red: "bg-red-400",
  green: "bg-green-400",
  blue: "bg-blue-400",
  pink: "bg-pink-300",
  yellow: "bg-yellow-300",
  magenta: "bg-purple-700",
  orange: "bg-yellow-600",
  black: "bg-black"
};

const textCols = {
  red: "text-red-400",
  green: "text-green-400",
  blue: "text-blue-400",
  pink: "text-pink-300",
  yellow: "text-yellow-300",
  purple: "text-purple-700",
  orange: "text-yellow-500",
  black: "text-black"
};

export function categoryToBackgroundColour(category) {
  return backgroundCols[category] || "bg-white";
}

export function categoryToTextColour(category) {
  return textCols[category] || "text-white";
}
