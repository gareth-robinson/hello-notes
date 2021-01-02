const backgroundCols = {
  red: "bg-red-400",
  green: "bg-green-400",
  blue: "bg-blue-400"
};

const textCols = {
  red: "text-red-400",
  green: "text-green-400",
  blue: "text-blue-400"
};

export function categoryToBackgroundColour(category) {
  return backgroundCols[category] || "bg-white";
}

export function categoryToTextColour(category) {
  return textCols[category] || "text-white";
}
