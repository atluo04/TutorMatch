import { useState } from "react";
import "./SearchResultStyles.css"; 
// need to design css


function SearchResult({ results, collection }) {
  return (
    <div className="search-result">
      <div className="search-box">
        {collection === 'posts' && (
          // Render posts content
          // there will be more other elements need to show for the result list
          // there will be creater info, so we need place for it,
          // and other's are able to click the creater name to checkout the profile
          //
          // it can be short like a preview, no need to show the full content if it is too much
          //
          // may need to create a new page for each post after select
          // or can just extent the full content for now,
          // but might need to fix the issue later on if the post is too long
          // 
          // need to figure out the space for replys
          //
          // result is each post it found, and it contains elements like title, username...
          <>
            {results.map((result, index) => ( 
              <div key={index}>
                <h5>{result.title}</h5>
                <p>{result.content}</p>
              </div>
            ))}
          </>
        )}

        {collection === 'users' && (
          <>
            {results.map((result, index) => ( 
              <div key={index}>
                <h5>{result.title}</h5>
                <p>{result.content}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}{/* <h3>٩( ᐛ )و</h3> */}

export {SearchResult};