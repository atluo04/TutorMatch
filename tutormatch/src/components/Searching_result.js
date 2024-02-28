import { useState } from "react";
import "./SearchResultStyles.css"; 
// need to design css


function SearchResult({ results }) {
  return (
    <div className="search-result">
      <div className="search-box">
        {/* ... your existing code */}
        {results.map((result) => ( // Use the passed "results" here
          <div key={result.id}>
            <h4>{result.title}</h4>
            {/* Render other details of the search result */}
          </div>
        ))}
      </div>
    </div>
  );
}{/* <h3>٩( ᐛ )و</h3> */}

export {SearchResult};