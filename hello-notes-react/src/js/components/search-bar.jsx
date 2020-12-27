import React, { useState } from "react";

const SearchBar = props => {
  const { performSearch, clearSearch } = props;
  const [hasSearch, setHasSearch] = useState(false);
  const [query, setQuery] = useState("");
  const canSearch = query.trim().length > 0;

  const doSearch = () => {
    if (canSearch) {
      setHasSearch(true);
      performSearch(query);
    }
  };

  const removeSearch = () => {
    setHasSearch(false);
    setQuery("");
    clearSearch();
  };

  return (
    <div className="border-b bg-white">
      <input
        name="search"
        title="query"
        placeholder="Search"
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
