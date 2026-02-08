import {
  sortMainDeck,
  sortExtraDeck,
  belongsToExtraDeck,
  sortAllCards,
} from "../../utils/deckSorter";

const reducer = (state, action) => {
  let { payload, type, index } = action;
  switch (type) {
    case "UPDATE_LISTER":
      return {
        ...state,
        lister: sortAllCards(payload),
      };

    case "UPDATE_LISTER_ITEMS":
      return {
        ...state,
        lister: [...state.lister, ...sortAllCards(payload)],
      };

    case "ADD_CARD_TO_DECK":
      if (belongsToExtraDeck(payload.type)) {
        return {
          ...state,
          deck: {
            main: [...state.deck.main],
            extra: [...state.deck.extra, payload],
          },
        };
      } else {
        return {
          ...state,
          deck: {
            main: [...state.deck.main, payload],
            extra: [...state.deck.extra],
          },
        };
      }

    case "REMOVE_CARD":
      if (belongsToExtraDeck(payload.type)) {
        return {
          ...state,
          deck: {
            main: [...state.deck.main],
            extra: [
              ...state.deck.extra
                .slice(0, index)
                .concat(state.deck.extra.slice(index + 1)),
            ],
          },
        };
      } else {
        return {
          ...state,
          deck: {
            main: [
              ...state.deck.main
                .slice(0, index)
                .concat(state.deck.main.slice(index + 1)),
            ],
            extra: [...state.deck.extra],
          },
        };
      }

    case "ERASE_DECK":
      return {
        ...state,
        deck: { main: [], extra: [] },
      };

    case "SET_LOADING_STATE":
      return {
        ...state,
        isLoading: payload,
      };

    case "SET_HAS_MORE_ITEMS_TO_LOAD":
      return {
        ...state,
        hasMoreItemsToLoad: payload,
      };

    case "SET_NEXT_PAGE_TO_LOAD":
      return {
        ...state,
        nextPageToLoad: payload,
      };

    case "SORT_DECK":
      return {
        ...state,
        deck: {
          main: sortMainDeck(state.deck.main),
          extra: sortExtraDeck(state.deck.extra),
        },
      };
  }
  return state;
};

export default reducer;
