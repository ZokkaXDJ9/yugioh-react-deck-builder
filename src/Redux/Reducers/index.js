import {
  sortMainDeck,
  sortExtraDeck,
  belongsToExtraDeck,
  sortAllCards,
} from "../../utils/deckSorter";

const getBanStatus = (name, banlist, banlistType) => {
    if (!banlist) return 3;
    const status = banlist[name];
    
    // For GOAT, if a card is not in the map (which contains all legal cards), it is Forbidden
    if (banlistType === 'goat' && !status) return 0;
    // For TCG/OCG, if a card is not in the map (which contains only banned cards), it is Unlimited
    if (banlistType !== 'goat' && !status) return 3;

    if (status === 'Forbidden') return 0;
    if (status === 'Limited') return 1;
    if (status === 'Semi-Limited') return 2;
    return 3;
}

const initialState = {
  deck: {
    main: [],
    extra: [],
    side: []
  },
  lister: [],
  banlist: null,
  isUnlimitedMode: false,
  banlistType: 'tcg'
}

const reducer = (state = initialState, action) => {
  let { payload, type, index } = action;
  switch (type) {
    case "SET_BANLIST":
        return {
            ...state,
            banlist: payload
        }

    case "SET_BANLIST_TYPE":
        return {
            ...state,
            banlistType: payload,
            banlist: null // Clear current banlist while fetching
        }
    
    case "TOGGLE_UNLIMITED":
        return {
            ...state,
            isUnlimitedMode: !state.isUnlimitedMode
        }

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
      const currentCopies = [...state.deck.main, ...state.deck.extra].filter(
        (c) => c.name === payload.name
      ).length;

      const limit = state.isUnlimitedMode ? 3 : getBanStatus(payload.name, state.banlist, state.banlistType);

      if (currentCopies >= limit) {
        return state;
      }

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
