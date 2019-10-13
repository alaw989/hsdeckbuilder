import React, { useState, useEffect, useContext } from "react";
import unirest from "unirest";
import { DeckBuilderCardGrid } from "./Styles";
import axios from "axios";
import { CardListContext } from "./CardListContext";
import { DeckList } from "./DeckList";

const cardlist = [];

function ClassCardList() {
  const [warlockCards, setCards] = useState({
    warlock: [
      {
        image: "",
        name: "",
        cardSetId: "",
        cropImage: ""
      }
    ]
  });

  const [warlockList, setWarlockList] = useState({
    cropImage: null
  });

  function getData() {
    // console.log("cardlist:", cardlist);
    // setWarlockList({
    //   cropImage: cardlist
    // });

    axios
      .get(
        "https://us.api.blizzard.com/hearthstone/cards?locale=en_US&class=warlock&access_token=USP8WI2hZBcOJHns54gl80cvb3ReevG8UN"
      )
      .then(function(response) {
        // handle success
        // console.log(response.data.cards);
        const mapped = response.data.cards
          .filter(
            x =>
              x.cardSetId !== 17 &&
              x.cardSetId !== 21 &&
              x.cardSetId !== 1004 &&
              x.cardSetId !== 4 &&
              x.cardSetId !== 23 &&
              x.cardSetId !== 20 &&
              x.cardSetId !== 1001 &&
              x.cardSetId !== 27 &&
              x.cardSetId !== 13 &&
              x.cardSetId !== 15 &&
              x.cardSetId !== 25 &&
              x.cardSetId !== 14 &&
              x.cardSetId !== 12
          )
          .map(x => {
            return {
              image: x.image,
              name: x.name,
              cardSetId: x.cardSetId,
              cropImage: x.cropImage
            };
          });

        // console.log(mapped);

        setCards({
          warlock: mapped
        });
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .finally(function() {
        // always executed
      });
  }

  useEffect(() => {
    getData();
  }, []);

  const doSomething = (x, index) => {
    // console.log(index);
    cardlist.push(x.cropImage);
    getData();
  };

  return (
    <div className="container-fluid cardlist-container">
      <div className="row">
        <div className="col-xs-9">
          <DeckBuilderCardGrid>
            <ul>
              {" "}
              {warlockCards.warlock.map((x, index) => (
                <li key={index} onClick={() => doSomething(x, index)}>
                  <img src={x.image} />
                </li>
              ))}{" "}
            </ul>
          </DeckBuilderCardGrid>
        </div>
        <div className="col-xs-3">
          <CardListContext.Provider value={cardlist}>
            <DeckList />
          </CardListContext.Provider>
        </div>
      </div>
    </div>
  );
}

export { ClassCardList };
