import { createStore } from "redux";
import reducer from "../Reducers";

const initialState = {
  lister: [],
  deck: { main: [], extra: [] },
  isLoading: false,
  hasMoreItemsToLoad: false,
  nextPageToLoad: "",
  banlist: {},
  isUnlimitedMode: false,
  banlistType: "tcg",
};

const store = createStore(reducer, initialState);

export default store;
