import React from "react";
import "./options.css";
import { useDispatch, useSelector } from "react-redux";
import fileDownload from "js-file-download";

const Options = () => {
  const dispatch = useDispatch();
  const mainDeck = useSelector((state) => state.deck.main);
  const extraDeck = useSelector((state) => state.deck.extra);
  const isUnlimited = useSelector((state) => state.isUnlimitedMode);
  const banlistType = useSelector((state) => state.banlistType);

  const deckBuilder = () => {
    let deckFileToDownload = "";

    deckFileToDownload += `#created by DaisukiTamago's Deck Builder https://github.com/DaisukiTamago/yugioh-react-deck-builder\n`;
    deckFileToDownload += `#main\n`;
    mainDeck.map((card) => (deckFileToDownload += card.id.toString() + "\n"));
    deckFileToDownload += `#extra\n`;
    extraDeck.map((card) => (deckFileToDownload += card.id.toString() + "\n"));
    deckFileToDownload += `!side\n`;
    //sideDeck.map(card => deckFileToDownload+= card.id.toString() + '\n')

    fileDownload(deckFileToDownload, "deck.ydk", "application/octet-stream");
  };

  return (
    <div className="options">
      <div className="banlist-select-container">
        <select
          value={banlistType}
          onChange={(e) =>
            dispatch({ type: "SET_BANLIST_TYPE", payload: e.target.value })
          }
          className="banlist-select"
        >
          <option value="tcg">TCG</option>
          <option value="ocg">OCG</option>
          <option value="goat">GOAT</option>
        </select>
      </div>
      <button
        onClick={() => dispatch({ type: "TOGGLE_UNLIMITED" })}
        style={{
          background: isUnlimited
            ? "#d32f2f"
            : "linear-gradient(311deg, rgba(0,98,157,1) 25%, rgba(18,124,67,1) 77%)",
        }}
      >
        {isUnlimited ? "No Limits" : "Banlist"}
      </button>
      <button onClick={() => dispatch({ type: "ERASE_DECK" })}>Erase</button>
      <button onClick={() => deckBuilder()}>Download</button>
    </div>
  );
};

export default Options;
