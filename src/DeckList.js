import React, { Component } from "react";
import { pathOr } from "ramda";
import styled, { css } from "styled-components";

const DeckList = props => {
  const Default_Img = "";
  const Card_Img = pathOr(Default_Img, ["card", "0", "0", "img"], props);

  const Card_List = [];
  const arrValue = [];
  

  props.card.map(x => Card_List.push(x));
                                      

  let result = []; 

  Card_List.forEach(function(element, index) {
    
    // Find if there is a duplicate or not
    if (Card_List.indexOf(element, index + 1) > -1) {
       
      // Find if the element is already in the result array or not
      if (result.indexOf(element) === -1) {
        result.push(element); 
      }
    }
  });
console.log(result)
  const jj = result.map(x => x[0].name)
  console.log(jj)

 

  const Mapped_Cards = Card_List.map(x => (
    <li
      key={x[0].name}
      style={{
        backgroundImage:
          "linear-gradient(to left, rgba(0, 0, 0,0.1), #000), url(" +
          x[0].img +
          ")",
        height: "20px",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "230% 30%",
        border: "1px solid black",
        padding: "0",
        height: "40px"
      }}
    >
      <div style={{ display: "flex", height: "40px" }}>
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "yellow",
            width: "30px",
            height: "100%",
            margin: "0",
            textAlign: "center"
          }}
        >
          {x[0].cost}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              margin: "0",
              paddingLeft: "20px"
            }}
          >
            {x[0].name}
          </p>
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "yellow",
              width: "30px",
              height: "100%",
              margin: "0",
              textAlign: "center"
            }}
          >
            {
             jj.map(y => y === x[0].name ? 2 : "")
            }
          </p>
        </div>
      </div>
    </li>
  ));

  const ulStyle = {
    position: "relative",
    width: "75%"
  };

  return <ul style={ulStyle}>{Mapped_Cards}</ul>;
};

export default DeckList;
