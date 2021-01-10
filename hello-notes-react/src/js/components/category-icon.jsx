import React from "react";
import { categoryToTextColour } from "../utils/category-as-style";

const CategoryIcon = props => {
  const { category, title } = props;
  const icon = category ? "turned_in" : "turned_in_not";
  const colour = category ? categoryToTextColour(category) : "text-black";
  const style = "material-icons " + colour;
  return (
    <i className={style} title={title}>
      {icon}
    </i>
  );
};

export default CategoryIcon;
