import React, { Component } from 'react';
import { pathOr } from "ramda";



const CardInfo = (props) => {
    
    const Default_Title = "Sen'Jin Sheildmasta"
    const Card_Title = pathOr(Default_Title, ["card", "0", "name"], props);

    return (
        <h1>{Card_Title}</h1>
    )
}
 
export default CardInfo;