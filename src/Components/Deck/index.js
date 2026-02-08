import React from "react";
import { useDrop } from "react-dnd";
import shortid from "shortid";
import Card from "../Card";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import "./deck.css";

const Deck = () => {
  const dispatch = useDispatch();
  let main_deck = useSelector((state) => state.deck.main);
  let extra_deck = useSelector((state) => state.deck.extra);
  const [, drop] = useDrop({
    accept: "Card",
    drop: (item) => {
      dispatch({ type: "ADD_CARD_TO_DECK", payload: item.card });
    },
  });

  const handleSort = () => {
    dispatch({ type: "SORT_DECK" });
  };

  return (
    <div className="deck-container" ref={drop}>
      <div style={{ marginBottom: "10px" }}>
        <Button variant="contained" color="primary" onClick={handleSort}>
          Sort Deck
        </Button>
      </div>
      <div className="deck">
        <div className="main-deck-container">
          {main_deck.map((card, index) => (
            <Card
              cardInfo={card}
              key={shortid.generate()}
              isDraggable={false}
              index={index}
            />
          ))}
        </div>
        {main_deck.length > 0 && extra_deck.length > 0 && (
          <div className="deck-separator" />
        )}
        <div className="extra-deck-container">
          {extra_deck.map((card, index) => (
            <Card
              cardInfo={card}
              key={shortid.generate()}
              isDraggable={false}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deck;
