import React, { useState, useEffect } from "react";
import unirest from "unirest";

function ClassCardList() {
  const [warlockCards, setCards] = useState({
    warlock: []
  });

  useEffect(() => {
    const cardURL = `https://omgvamp-hearthstone-v1.p.rapidapi.com/cards`;
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
          console.log("GET response", result.body);
          setCards({
            warlock: result.body
          });
        }
      });
  }, []);

  const cards = Object.values(warlockCards);


  const filtered = cards.map(x => {
    console.log("x", x);
    // x.cardSet !== "Credits" &&
    //   x.cardSet !== "Hall of Fame" &&
    //   x.cardSet !== "Hero Skins" &&
    //   x.cardSet !== "Missions" &&
    //   x.cardSet !== "Tavern Brawl" &&
    //   x.type !== "Hero" &&
    //   x.collectible === true;
  });

  console.log("cards:", filtered);

  return "hey";
}

export { ClassCardList };
