import React, { useContext } from "react";
import { CardListContext } from "./CardListContext";

const DeckList = () => {
  const data = useContext(CardListContext);
  // if (data.cropImage === undefined) {
  //   return <div />;
  // }
  const idArray = [];

  data.map(x => {
    idArray.push(x.id);
  });

  // console.log(idArray);
  function count() {

    idArray.sort();

    var current = null;
    var cnt = 0;
    for (var i = 0; i < idArray.length; i++) {
        if (idArray[i] != current) {
            if (cnt > 0) {
                console.log(current + ' comes --> ' + cnt + ' times<br>');
            }
            current = idArray[i];
            cnt = 1;
        } else {
            cnt++;
        }
    }
    if (cnt > 0) {
        console.log(current + ' comes --> ' + cnt + ' times');
    }
}

count();

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
