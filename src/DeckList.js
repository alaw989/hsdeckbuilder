import React, { useContext } from "react";
import { CardListContext } from "./CardListContext";

const DeckList = () => {
  const data = useContext(CardListContext);
  // if (data.cropImage === undefined) {
  //   return <div />;
  // }
 
  console.log(data);

  // const cropImage = data.cropImage; 
  // const id = data.id;



  return (
    <ul className={"test"}>
      {data.map((x, index) => (
        <li key={x.id}>
          <img src={x.cropImage} />
        </li>
      ))}
    </ul>
  );
};

export { DeckList };
