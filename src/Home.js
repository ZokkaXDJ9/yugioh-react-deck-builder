import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { default as Axios } from 'axios';
import './Home.css';
import Deck from './Components/Deck'
import Search from './Components/Search'
import Lister from './Components/Lister'
import Options from './Components/Options'

function Home() {
  const dispatch = useDispatch();
  const banlistType = useSelector(state => state.banlistType);

  useEffect(() => {
    const fetchBanlist = async () => {
        try {
            let banlistMap = {};
            
            if (banlistType === 'goat') {
                // Fetch ALL Goat format cards
                const { data } = await Axios.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?format=goat`);
                data.data.forEach(card => {
                    // Start by assuming it's legal (Unlimited) because it's in the format list
                    let status = 'Unlimited';
                    if (card.banlist_info && card.banlist_info.ban_goat) {
                        status = card.banlist_info.ban_goat;
                    }
                    banlistMap[card.name] = status;
                });
            } else {
                // For TCG/OCG, only fetch the banlist (blacklist)
                const { data } = await Axios.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?banlist=${banlistType}`);
                const key = `ban_${banlistType}`;
                data.data.forEach(card => {
                    if (card.banlist_info && card.banlist_info[key]) {
                        banlistMap[card.name] = card.banlist_info[key];
                    }
                });
            }

            dispatch({ type: 'SET_BANLIST', payload: banlistMap });
        } catch (error) {
            console.error("Failed to fetch banlist", error);
            dispatch({ type: 'SET_BANLIST', payload: {} });
        }
    };
    fetchBanlist();
  }, [dispatch, banlistType]);

  return (
    <div className="Home">
      <Search/>
      <Lister/>
      <Deck/>
      <Options/>
    </div>
  );
}


export default Home;
