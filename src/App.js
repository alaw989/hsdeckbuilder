import React, { Component } from "react";
import "./App.css";
import unirest from "unirest";
import { asyncContainer, Typeahead } from "react-bootstrap-typeahead";
import CardImg from "./CardImg.js";
import CardTitle from "./CardTitle.js";
import CardContent from "./CardContent.js";
import styled from "styled-components";
import DeckList from "./DeckList.js";
import { Header } from "./Header";
import { ClassCardList } from "./ClassCardList";

const AsyncTypeahead = asyncContainer(Typeahead);
const cardURL = card =>
  `https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/${card}`;

const AppContents = styled.div`
  width: 50%;
`;

const AppDeckList = styled.div`
  width: 50%;
`;

const Add_Button = styled.button`
  border-radius: 3px;
  padding: 0.25em 1em;
  margin: 0 1em;
  background: transparent;
  color: palevioletred;
  border: 2px solid palevioletred;
`;

let counter = "hey";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardInfo: [],
      items: []
    };
    this.handleAction = this.handleAction.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleClick = event => {
    let value = event.toString("");
    if (event.length > 0) {
      unirest
        .get(cardURL(value))
        .header(
          "X-Mashape-Key",
          "l8lYKhEqKMmshGwKXzi1ElRhojGwp1Dn8YQjsnQRkDZQyPMIdV"
        )
        .end(result => {
          if (result.error) {
            console.log("GET response", result.error);
          } else {
            console.log("GET response", result.body);
            const card = result.body;
            const set = card.filter(
              x =>
                x.cardSet !== "Credits" &&
                x.cardSet !== "Hall of Fame" &&
                x.cardSet !== "Hero Skins" &&
                x.cardSet !== "Missions" &&
                x.cardSet !== "Tavern Brawl" &&
                x.type !== "Hero" &&
                x.collectible === true
            );
            counter = set;
            this.setState({
              CardInfo: set
            });
          }
        });
    }
  };

  handleButtonClick = event => {
    this.setState({
      CardInfo: counter,
      items: [...this.state.items, this.state.CardInfo]
    });
  };

  handleAction = event => {
    event.persist();
    const query = event.target.value;
    if (query === "") {
      return null;
    }
    if (event.key === "Enter") {
      unirest
        .get(cardURL(query))
        .header(
          "X-Mashape-Key",
          "l8lYKhEqKMmshGwKXzi1ElRhojGwp1Dn8YQjsnQRkDZQyPMIdV"
        )
        .end(result => {
          if (result.error) {
            console.log("GET response", result.error);
          } else {
            console.log("GET response", result.body);
            const card = result.body;
            const set = card.filter(
              x =>
                x.cardSet !== "Credits" &&
                x.cardSet !== "Hall of Fame" &&
                x.cardSet !== "Hero Skins" &&
                x.cardSet !== "Missions" &&
                x.cardSet !== "Tavern Brawl" &&
                x.type !== "Hero" &&
                x.collectible === true
            );
            counter = set;
            this.setState({
              CardInfo: set
            });
          }
        });
    }
  };

  render() {
    return (
      <div className="App">
        <div className="container-fluid">
          <div className="row">
            {" "}
            <div className="col-xs-12 no-padding">
              <Header />
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-9">
              <ClassCardList />
            </div>
            <div className="col-xs-3"></div>
          </div>
        </div>
        <AppContents>
          <AsyncTypeahead
            onSearch={card => {
              unirest
                .get(cardURL(card))
                .header(
                  "X-Mashape-Key",
                  "l8lYKhEqKMmshGwKXzi1ElRhojGwp1Dn8YQjsnQRkDZQyPMIdV"
                )
                .end(result => {
                  if (result.error) {
                    console.log("GET response", result.error);
                  } else {
                    console.log("GET response", result.body);
                    const card = result.body;
                    const set = card
                      .filter(
                        x =>
                          x.cardSet !== "Credits" &&
                          x.cardSet !== "Hall of Fame" &&
                          x.cardSet !== "Hero Skins" &&
                          x.cardSet !== "Missions" &&
                          x.cardSet !== "Tavern Brawl" &&
                          x.type !== "Hero" &&
                          x.collectible === true
                      )
                      .map(x => x.name);

                    this.setState({
                      options: set
                    });
                  }
                });
            }}
            onKeyDown={this.handleAction}
            onChange={this.handleClick}
            options={this.state.options}
            placeholder="Search Card..."
            maxResults={5}
            emptyLabel="No Matches Found"
            searchText=""
            propText=""
            paginationText=""
            delay={300}
          />{" "}
          <CardTitle card={this.state.CardInfo} />{" "}
          <CardImg card={this.state.CardInfo} />{" "}
          <CardContent card={this.state.CardInfo} />
          <Add_Button onClick={this.handleButtonClick}>Add To Deck</Add_Button>
        </AppContents>{" "}
        <AppDeckList>
          <DeckList card={this.state.items} />
        </AppDeckList>
      </div>
    );
  }
}

export default App;
