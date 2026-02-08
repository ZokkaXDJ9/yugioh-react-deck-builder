import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { default as Axios } from "axios";
import "./search.css";

var axios = Axios.create({
  baseURL: "https://db.ygoprodeck.com/api/v7/",
});

const Search = () => {
  const dispatch = useDispatch();
  const banlistType = useSelector((state) => state.banlistType);
  const [name, setName] = useState("");
  const [race, setRace] = useState(""); //race is what usually is called type
  const [type, setType] = useState("");
  const [attribute, setAttribute] = useState("");
  const [level, setLevel] = useState("");
  const [cardValues, setCardValues] = useState(null);

  useEffect(() => {
    axios
      .get("cardvalues.php")
      .then((res) => setCardValues(res.data))
      .catch((err) => console.error("Error fetching card values:", err));
  }, []);

  const request = async () => {
    dispatch({ type: "SET_LOADING_STATE", payload: true });
    try {
      let response = await axios.get(queryBuilder());
      console.log(response);
      if (response.data.meta.pages_remaining != 0) {
        dispatch({ type: "SET_HAS_MORE_ITEMS_TO_LOAD", payload: true });
        dispatch({
          type: "SET_NEXT_PAGE_TO_LOAD",
          payload: response.data.meta.next_page,
        });
      } else {
        dispatch({ type: "SET_HAS_MORE_ITEMS_TO_LOAD", payload: false });
      }
      dispatch({ type: "UPDATE_LISTER", payload: response.data.data });
      dispatch({ type: "SET_LOADING_STATE", payload: false });
    } catch (err) {
      alert(
        `I-i'm sorry, something just gone wrong =(.\n Change the parameters and try again`,
      );
      dispatch({ type: "SET_LOADING_STATE", payload: false });
    }
  };

  const queryBuilder = () => {
    let query =
      `cardinfo.php?num=30&offset=0` + name + race + type + level + attribute;
    if (banlistType) {
      query += `&format=${banlistType}`;
    }
    return query;
  };

  const levelSelector = (
    <select
      onChange={({ target: { value } }) =>
        setLevel(value.toLowerCase() == "unset" ? "" : `&level=${value}`)
      }
    >
      <option defaultChecked={true}>Unset</option>
      {cardValues && cardValues.MONSTER && cardValues.MONSTER.level ? (
        cardValues.MONSTER.level.map((lvl) => <option key={lvl}>{lvl}</option>)
      ) : (
        <>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
          <option>7</option>
          <option>8</option>
          <option>9</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
        </>
      )}
    </select>
  );

  const raceSelector = (
    <select
      onChange={({ target: { value } }) =>
        setRace(value.toLowerCase() == "unset" ? "" : `&race=${value}`)
      }
    >
      <option>Unset</option>
      {cardValues ? (
        <>
          <optgroup label="Monster Cards">
            {cardValues.MONSTER.race.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </optgroup>
          <optgroup label="Spell Cards">
            {cardValues.SPELL.race.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </optgroup>
          <optgroup label="Trap Cards">
            {cardValues.TRAP.race.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </optgroup>
        </>
      ) : (
        <optgroup label="Loading...">
          <option disabled>Loading...</option>
        </optgroup>
      )}
    </select>
  );

  const typeSelector = (
    <select
      onChange={({ target: { value } }) =>
        setType(value.toLowerCase() == "unset" ? "" : `&type=${value}`)
      }
    >
      <option>Unset</option>
      {cardValues ? (
        <>
          <optgroup label="Main Deck Types">
            {cardValues.types
              .filter((t) => t.area.includes("MAIN"))
              .map((t) => (
                <option key={t.name}>{t.name}</option>
              ))}
          </optgroup>
          <optgroup label="Extra Deck Types">
            {cardValues.types
              .filter((t) => t.area.includes("EXTRA"))
              .map((t) => (
                <option key={t.name}>{t.name}</option>
              ))}
          </optgroup>
        </>
      ) : (
        <option disabled>Loading...</option>
      )}
    </select>
  );

  const attributeSelector = (
    <select
      onChange={({ target: { value } }) =>
        setAttribute(
          value.toLowerCase() == "unset" ? "" : `&attribute=${value}`,
        )
      }
    >
      <option>Unset</option>
      {cardValues && cardValues.MONSTER && cardValues.MONSTER.attributes ? (
        cardValues.MONSTER.attributes.map((attr) => (
          <option key={attr}>{attr}</option>
        ))
      ) : (
        <option disabled>Loading...</option>
      )}
    </select>
  );

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Type card name"
        onChange={({ target: { value } }) => setName(`&fname=${value}`)}
      />
      <table>
        <tbody>
          <tr>
            <td>Level</td>
            <td>{levelSelector}</td>
          </tr>
          <tr>
            <td>Race</td>
            <td>{raceSelector}</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>{typeSelector}</td>
          </tr>
          <tr>
            <td>Attribute</td>
            <td>{attributeSelector}</td>
          </tr>
        </tbody>
      </table>

      <button
        className="search-button"
        onClick={() => {
          request();
        }}
      >
        Search
      </button>
    </div>
  );
};

export default Search;
