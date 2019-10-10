import React, { useState, useEffect } from "react";
import unirest from "unirest";
import { DeckBuilderCardGrid } from "./Styles";
import axios from "axios";



function ClassCardList() {
  const [warlockCards, setCards] = useState({
    warlock: []
  });


  useEffect(() => {
    axios.get('https://cors-anywhere.herokuapp.com/https://api.hearthstonejson.com/v1/25770/enUS/cards.json')
    .then(function (response) {
      // handle success
      console.log(response.data);
      const filtered = response.data.filter(x => 
        // console.log(x.set)
        x.cardClass == "WARLOCK" &&
        x.set !== "TGT" &&
        x.set !== "GVG" &&
        x.type !== "HERO"  &&
        x.set !== "NAXX" &&
        x.set !== "LOE" &&
        x.set !== "KARA" &&
        x.type !== "HERO_SKINS" && 
        x.set !== "BRM" &&
        x.set !== "ICECROWN" &&
        x.set !== "UNGORO" &&
        x.set !== "GANGS" &&
        x.type !== "ENCHANTMENT" &&
        x.set !== "OG" && 
        x.set !== "TAVERNS_OF_TIME"

        
       

        // x.set !== "Credits" &&
        // x.set !== "Hall of Fame" &&
        // x.set !== "Hero Skins" &&
        // x.set !== "Missions" &&
        // x.set !== "Tavern Brawl" &&
        // x.set !== "Kobolds & Catacombs" &&
        // x.set !== "Whispers of the Old Gods" &&
        // x.set !== "Journey to Un'Goro" &&
        // x.set !== "The League of Explorers" &&
        // x.set !== "Knights of the Frozen Throne" &&
        // x.set !== "The Grand Tournament" &&
        // x.set !== "Mean Streets of Gadgetzan" &&
        // x.set !== "One Night in Karazhan" &&
        // x.set !== "Goblins vs Gnomes" &&
        // x.type !== "Hero" &&
        // x.collectible === true
        )
        console.log("warlock", filtered)
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
  });

//   useEffect(() => {
//     const cardURL = `https://api.hearthstonejson.com/v1/`;
//     unirest
//       .get(cardURL)
//       .header({
//         "x-rapidapi-host": "omgvamp-hearthstone-v1.p.rapidapi.com",
//         "x-rapidapi-key": "l8lYKhEqKMmshGwKXzi1ElRhojGwp1Dn8YQjsnQRkDZQyPMIdV"
//       })
//       .end(result => {
//         if (result.error) {
//           console.log("GET response", result.error);
//         } else {
//           console.log("GET response", result.body);
//           const filtered = result.body.filter(
//             x =>
              // x.set !== "Credits" &&
              // x.set !== "Hall of Fame" &&
              // x.set !== "Hero Skins" &&
              // x.set !== "Missions" &&
              // x.set !== "Tavern Brawl" &&
              // x.set !== "Kobolds & Catacombs" &&
              // x.set !== "Whispers of the Old Gods" &&
              // x.set !== "Journey to Un'Goro" &&
              // x.set !== "The League of Explorers" &&
              // x.set !== "Knights of the Frozen Throne" &&
              // x.set !== "The Grand Tournament" &&
              // x.set !== "Mean Streets of Gadgetzan" &&
              // x.set !== "One Night in Karazhan" &&
              // x.set !== "Goblins vs Gnomes" &&
              // x.type !== "Hero" &&
              // x.collectible === true
//           );
//           setCards({
//             warlock: filtered
//           });
//         }
//       });
//   }, []);

//   console.log(warlockCards.warlock);

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
