import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search across all columns..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button
          className="clear-button"
          onClick={() => setSearchTerm('')}
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default SearchBar;
