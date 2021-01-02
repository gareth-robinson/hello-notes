import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";

const SearchBar = props => {
  const { hasSearch, performSearch, clearSearch } = props;
  const [query, setQuery] = useState("");
  const canSearch = query.trim().length > 0;
  useEffect(() => {
    if (!hasSearch && query) {
      setQuery("");
    }
  }, [hasSearch]);
  const intl = useIntl();

  const doSearch = () => {
    if (canSearch) {
      performSearch(query);
    }
  };

  const removeSearch = () => {
    setQuery("");
    clearSearch();
  };

  return (
    <div className="border-b h-8 p-1 bg-white flex">
      <input
        name="search"
        placeholder={intl.formatMessage({ id: "search-bar.search" })}
        className="flex-grow"
        value={query}
        onChange={x => setQuery(x.target.value)}
      />
      <button
        title={intl.formatMessage({ id: "search-bar.search" })}
        className={canSearch ? "" : "text-gray-300"}
        onClick={doSearch}
      >
        <i className="material-icons">search</i>
      </button>
      {hasSearch ? (
        <button
          title={intl.formatMessage({ id: "search-bar.clear" })}
          onClick={removeSearch}
        >
          <i className="material-icons">search_off</i>
        </button>
      ) : null}
    </div>
  );
};

export default SearchBar;
