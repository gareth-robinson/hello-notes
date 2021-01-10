import React, { useState } from "react";
import { useIntl } from "react-intl";
import CategoryIcon from "./category-icon";
import { useCategory } from "../context";

const CategoryChooser = props => {
  const { onChange, category } = props;
  const [isOpen, setOpen] = useState(false);
  const [categoryState] = useCategory();
  const intl = useIntl();

  const updateCategory = c => {
    onChange(c);
    setOpen(false);
  };

  const displayCategories = isOpen ? (
    <ul className="absolute z-10 bg-white border">
      <li key="null" onClick={() => updateCategory(null)}>
        <CategoryIcon
          category={null}
          title={intl.formatMessage({
            id: "category-chooser.remove",
            defaultMessage: "Remove category"
          })}
        />
      </li>
      {categoryState
        .filter(c => c.enabled)
        .map(c => (
          <li key={c.id} onClick={() => updateCategory(c.id)}>
            <CategoryIcon category={c.id} title={c.title} />
          </li>
        ))}
    </ul>
  ) : null;

  return (
    <div className="relative inline-block">
      <span onClick={() => setOpen(!isOpen)}>
        <CategoryIcon
          category={category}
          title={
            categoryState.filter(c => c.id === category).map(c => c.title)[0]
          }
        />
        {displayCategories}
        <i className="material-icons">
          {isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
        </i>
      </span>
    </div>
  );
};

export default CategoryChooser;
