import { useState } from "react";
import "./SearchResultStyles.css"; 
// need to design css


function SearchResult({ results }) {
  return (
    <div className="search-result">
      <div className="search-box">
        {/* below is the function to display the found posts */}
        
        {results.map((result) => ( 
          <div key={result.id}>
            <h4>{result.title}</h4>
            <h4>{result.content}</h4>

          </div>
        ))}

      </div>
    </div>
  );
}{/* <h3>٩( ᐛ )و</h3> */}

export {SearchResult};