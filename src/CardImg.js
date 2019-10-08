import React, { Component } from "react";
import { pathOr } from "ramda";

const CardImg = props => {


    const Default_Img = "http://media.services.zam.com/v1/media/byName/hs/cards/enus/CS2_179.png";
    const Card_Img = pathOr(Default_Img, ["card", "0", "img"], props);

  return (
    <div className="ImageWrapper">
      <img src={Card_Img} />
    </div>
  );
};

export default CardImg;
