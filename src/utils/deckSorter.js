export const sortMainDeck = (deck) => {
    const monsters = [];
    const spells = [];
    const traps = [];

    deck.forEach(card => {
        if (card.type === 'Spell Card') {
            spells.push(card);
        } else if (card.type === 'Trap Card') {
            traps.push(card);
        } else {
            monsters.push(card);
        }
    });

    const getMainDeckMonsterOrder = (card) => {
        const type = card.type || '';
        if (type.includes('Normal')) return 1; // Vanilla
        if (type.includes('Ritual')) return 3; // Ritual
        return 2; // Effect and others
    };

    // Sort Monsters: Category (Asc), Level (Desc), Name (Asc)
    monsters.sort((a, b) => {
        const orderA = getMainDeckMonsterOrder(a);
        const orderB = getMainDeckMonsterOrder(b);
        if (orderA !== orderB) return orderA - orderB;

        const valA = a.level || 0;
        const valB = b.level || 0;
        if (valB !== valA) return valB - valA;
        return a.name.localeCompare(b.name);
    });

    // Sort Spells: Type/Race (Asc), Name (Asc)
    spells.sort((a, b) => {
        const raceA = a.race || '';
        const raceB = b.race || '';
        if (raceA !== raceB) return raceA.localeCompare(raceB);
        return a.name.localeCompare(b.name);
    });

    // Sort Traps: Type/Race (Asc), Name (Asc)
    traps.sort((a, b) => {
        const raceA = a.race || '';
        const raceB = b.race || '';
        if (raceA !== raceB) return raceA.localeCompare(raceB);
        return a.name.localeCompare(b.name);
    });

    return [...monsters, ...spells, ...traps];
};

const getExtraDeckTypeOrder = (card) => {
    const type = card.type || '';
    if (type.includes('Fusion')) return 1;
    if (type.includes('Synchro')) return 2;
    if (type.includes('XYZ')) return 3;
    if (type.includes('Link')) return 4;
    return 5;
};

const getCardVal = (card) => {
    if (card.type && card.type.includes('Link')) return card.linkval || 0;
    return card.level || 0;
};

export const belongsToExtraDeck = (type) => {
    if (        type === 'XYZ Monster' ||
                type === 'Pendulum Effect Fusion Monster' ||
                type === 'Synchro Monster' ||
                type === 'Synchro Pendulum Effect Monster' ||
                type === 'Synchro Tuner Monster' ||
                type === 'XYZ Pendulum Effect Monster' ||
                type === 'Fusion Monster' ||
                type === 'Link Monster'
            ) { return true} 
            else {return false}  
}

export const sortExtraDeck = (deck) => {
    return [...deck].sort((a, b) => {
        // Group Order
        const orderA = getExtraDeckTypeOrder(a);
        const orderB = getExtraDeckTypeOrder(b);
        if (orderA !== orderB) return orderA - orderB;

        // Level/Rank/Link Rating (Desc)
        const valA = getCardVal(a);
        const valB = getCardVal(b);
        if (valB !== valA) return valB - valA;

        // Name (Asc)
        return a.name.localeCompare(b.name);
    });
};

export const sortAllCards = (cards) => {
    const mainDeck = [];
    const extraDeck = [];

    cards.forEach(card => {
        if (belongsToExtraDeck(card.type)) {
            extraDeck.push(card);
        } else {
            mainDeck.push(card);
        }
    });

    return [...sortMainDeck(mainDeck), ...sortExtraDeck(extraDeck)];
};

