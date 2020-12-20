import React, { useState } from "react";
import CategoryIcon from "./category-icon";

const colours = [
  {
    id: "red",
    name: "Red"
  },
  {
    id: "green",
    name: "Green"
  },
  {
    id: "blue",
    name: "Blue"
  }
];

const CategoryChooser = props => {
  const { onChange, category } = props;
  const [isOpen, setOpen] = useState(false);

  const updateCategory = c => {
    onChange(c);
    setOpen(false);
  };

  const list = isOpen ? (
    <ul className="absolute z-10 bg-white border">
      <li key="null" onClick={() => updateCategory(null)}>
        <CategoryIcon category={null} />
      </li>
      {colours.map(c => (
        <li key={c.id} onClick={() => updateCategory(c.id)}>
          <CategoryIcon category={c.id} />
        </li>
      ))}
    </ul>
  ) : null;

  return (
    <div className="relative inline-block">
      <span onClick={() => setOpen(!isOpen)}>
        <CategoryIcon category={category} />
        <i className="material-icons">
          {isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
        </i>
      </span>
      {list}
    </div>
  );
};

export default CategoryChooser;
