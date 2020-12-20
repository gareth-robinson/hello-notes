import React from "react";

const styles = {
  red: "text-red-400",
  green: "text-green-400",
  blue: "text-blue-400"
};

const CategoryIcon = props => {
  const { category } = props;
  const icon = category ? "turned_in" : "turned_in_not";
  const style = "material-icons " + styles[category];
  return <i className={style}>{icon}</i>;
};

export default CategoryIcon;
