import React, { Component } from "react";
import { pathOr } from "ramda";
import styled from "styled-components";

const CardContent = props => {
  const Default_Set = "Classic";
  const Card_Set = pathOr(Default_Set, ["card", "0", "cardSet"], props);

  const Default_Type = "Minion";
  const Card_Type = pathOr(Default_Type, ["card", "0", "type"], props);

  const Default_Rarity = undefined;
  const Card_Rarity = pathOr(Default_Rarity, ["card", "0", "rarity"], props);

  const Default_Flavor =
    "Sen'jin Village is nice, if you like trolls and dust.";
  const Card_Flavor = pathOr(Default_Flavor, ["card", "0", "flavor"], props);

  return (
    <ul className="Content_List">
      <li>Set: {Card_Set}</li>
      <li>Type: {Card_Type}</li>
      <li>
        {Card_Rarity == undefined || Card_Rarity == "Free"
          ? undefined
          : "Rarity: " + Card_Rarity}
      </li>
      <li>
        <i>{Card_Flavor}</i>
      </li>
    </ul>
  );
};

export default CardContent;
