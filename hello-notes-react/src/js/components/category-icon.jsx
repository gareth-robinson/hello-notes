import React from "react";
import { categoryToTextColour } from "../utils/category-as-style";

const CategoryIcon = props => {
  const { category } = props;
  const icon = category ? "turned_in" : "turned_in_not";
  const style = "material-icons " + categoryToTextColour(category);
  return <i className={style}>{icon}</i>;
};

export default CategoryIcon;
