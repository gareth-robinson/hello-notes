import React from "react";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import CategoryIcon from "./category-icon";
import { useCategory } from "../context";

const CategoryEditor = props => {
  const [categoryState] = useCategory();
  const asCategoryLine = category => {
    return (
      <li key={category.id} className="h-8 p-1 flex">
        <input type="checkbox" defaultChecked={category.enabled}></input>
        <CategoryIcon category={category.id} />
        <input
          type="text"
          className="border border-grey-400"
          defaultValue={category.title}
          disabled={!category.enabled}
        ></input>
      </li>
    );
  };

  return (
    <div className="flex-1 flex flex-col border-b border-gray-400">
      <div className="border-b h-8 p-1 bg-white">
        <FormattedMessage
          id="navigation.categories"
          defaultMessage="Categories"
        />
      </div>
      <ul className="overflow-y-scroll p-2">
        {categoryState.map(asCategoryLine)}
      </ul>
    </div>
  );
};

export default CategoryEditor;
