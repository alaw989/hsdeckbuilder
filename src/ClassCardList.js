import React, { useState, useEffect } from "react";
import unirest from "unirest";
import { DeckBuilderCardGrid } from "./Styles";

function ClassCardList() {
  const [warlockCards, setCards] = useState({
    warlock: []
  });

  useEffect(() => {
    const cardURL = `https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/classes/Warlock`;
    unirest
      .get(cardURL)
      .header({
        "x-rapidapi-host": "omgvamp-hearthstone-v1.p.rapidapi.com",
        "x-rapidapi-key": "l8lYKhEqKMmshGwKXzi1ElRhojGwp1Dn8YQjsnQRkDZQyPMIdV"
      })
      .end(result => {
        if (result.error) {
          console.log("GET response", result.error);
        } else {
          // console.log("GET response", result.body);
          const filtered = result.body.filter(
            x =>
              x.cardSet !== "Credits" &&
              x.cardSet !== "Hall of Fame" &&
              x.cardSet !== "Hero Skins" &&
              x.cardSet !== "Missions" &&
              x.cardSet !== "Tavern Brawl" &&
              x.cardSet !== "Kobolds & Catacombs" &&
              x.cardSet !== "Whispers of the Old Gods" &&
              x.cardset !== "Journey to Un'Goro" &&
              x.cardSet !== "The League of Explorers" &&
              x.cardSet !== "Knights of the Frozen Throne" &&
              x.cardSet !== "The Grand Tournament" &&
              x.cardSet !== "Mean Streets of Gadgetzan" &&
              x.cardSet !== "One Night in Karazhan" &&
              x.cardSet !== "Goblins vs Gnomes" &&
              x.type !== "Hero" &&
              x.collectible === true
          );
          setCards({
            warlock: filtered
          });
        }
      });
  }, []);

  console.log(warlockCards.warlock);

  const doSomething = () => {
      console.log('hey');
  }

  return (
    <DeckBuilderCardGrid>
      <ul>
        {" "}
        {warlockCards.warlock.map((x, index) => (
          <li key={index} onClick={doSomething}>
            <img src={x.img} />
          </li>
        ))}{" "}
      </ul>
    </DeckBuilderCardGrid>
  );
}

export { ClassCardList };
