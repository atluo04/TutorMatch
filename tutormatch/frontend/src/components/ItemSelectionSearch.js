import React, { useState, useEffect, useRef } from "react";
import closeButton from "../assets/x.png";
import "./ItemSelectionSearch.css";

const ItemSelectionSearch = ({
  itemList,
  updateItems,
  maxItems,
  placeHolderText,
}) => {
  const [value, setValue] = useState("");
  const [items, setItems] = useState(new Set());
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [dropDown, setDropDown] = useState(false);
  const inputRef = useRef(null);

  const handleInput = (event) => {
    setValue(event.target.value);
    setDropDown(true);
  };

  const handleSelection = (key) => {
    if (items.has(key)) {
      setItems(new Set([...items].filter((item) => item !== key)));
      setSelectedItems(
        new Set([...selectedItems].filter((item) => item !== key))
      );
    } else {
      setItems(new Set([...items, key]));
      setSelectedItems(new Set([...selectedItems, key]));
    }
    inputRef.current.value = "";
    setDropDown(false);
    inputRef.current.focus();
  };

  const handleDeletion = (key) => {
    setItems(new Set([...items].filter((item) => item !== key)));
    setSelectedItems(
      new Set([...selectedItems].filter((item) => item !== key))
    );
  };

  useEffect(() => {
    updateItems(items);
  }, [items]);

  return (
    <div className="itemContainer">
      <div className="inputContainer">
        <input
          type="text"
          ref={inputRef}
          className="itemSearch"
          placeholder={placeHolderText}
          onChange={handleInput}
        />
        {dropDown && value && (
          <ul className="itemList">
            {itemList
              .filter((item) =>
                item.ID.toLowerCase().includes(value.toLowerCase())
              )
              .slice(0, maxItems)
              .map((item) => (
                <li
                  key={item.ID}
                  className="listButton"
                  onClick={() => handleSelection(item.ID)}
                >
                  {item.ID}
                </li>
              ))}
          </ul>
        )}
      </div>
      <div className="selectedItemsContainer">
        {[...selectedItems].map((item) => (
          <div key={item} className="selectedItem">
            {item}
            <div
              className="xButtonContainer"
              onClick={() => handleDeletion(item)}
            >
              <img className="removeButton" src={closeButton} alt="Remove" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ItemSelectionSearch };
