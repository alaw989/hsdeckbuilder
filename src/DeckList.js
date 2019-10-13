import React, { useContext } from "react";
import { CardListContext } from "./CardListContext";

const DeckList = () => {
  const warlockList = useContext(CardListContext);
  console.log(warlockList);
  
  return (
    <ul className={warlockList}>
      {warlockList.map((x, index) => (
       console.log(x),
        <li key={index}>
          <img src={x} />
        </li>
      ))}{" "}
    </ul>
  );
};

export { DeckList };
