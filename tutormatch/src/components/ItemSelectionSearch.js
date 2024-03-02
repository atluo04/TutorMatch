import { useState, useEffect, useRef} from "react";
import closeButton from "../assets/x.png";
import './ItemSelectionSearch.css'

const ItemSelectionSearch = ({
  itemList,
  updateItems,
  maxItems,
  placeHolderText,
}) => {
  const [value, setValue] = useState("");
  const [items, setItems] = useState(new Set());
  const [dropDown, setDropDown] = useState(false);
  const inputRef = useRef(null);

  const handleInput = (event) => {
    setValue(event.target.value);
    setDropDown(true);
  };

  const handleSelection = (key) => {
    setItems((items) => new Set([...items, key]));
    inputRef.current.value = "";
    setDropDown(false);
    inputRef.current.focus();
  };

  const handleDeletion = (key) => {
    setItems(new Set([...items].filter((item) => item !== key)));
  };

  useEffect(() => {
    updateItems(items);
  }, [items]);

  return (
    <div>
      <ul>
        {[...items].map((item) => (
          <button key={item} className="selectedItem">
            {item}
            {
              <div
                className="xButtonContainer"
                onClick={() => handleDeletion(item)}
              >
                <img className="removeButton" src={closeButton} />
              </div>
            }
          </button>
        ))}
      </ul>
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
              <button
                key={item.ID}
                className="listButton"
                onClick={() => handleSelection(item.ID)}
              >
                {item.ID}
              </button>
            ))}
        </ul>
      )}
    </div>
  );
};

export { ItemSelectionSearch };
