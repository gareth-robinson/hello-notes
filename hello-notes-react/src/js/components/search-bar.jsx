import React, { useState, useEffect } from "react";

const SearchBar = props => {
  const { hasSearch, performSearch, clearSearch } = props;
  const [query, setQuery] = useState("");
  const canSearch = query.trim().length > 0;
  useEffect(() => {
    if (!hasSearch && query) {
      setQuery("");
    }
  }, [hasSearch]);

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
        title="query"
        placeholder="Search"
        className="flex-grow"
        value={query}
        onChange={x => setQuery(x.target.value)}
      />
      <button
        title="Search"
        className={canSearch ? "" : "text-gray-300"}
        onClick={doSearch}
      >
        <i className="material-icons">search</i>
      </button>
      {hasSearch ? (
        <button title="Clear" onClick={removeSearch}>
          <i className="material-icons">search_off</i>
        </button>
      ) : null}
    </div>
  );
};

export default SearchBar;
