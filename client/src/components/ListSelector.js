import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ListCard from './ListCard.js'
import { GlobalStoreContext } from '../store'
/*
    This React component lists all the playlists in the UI.
    
    @author McKilla Gorilla
*/
const ListSelector = () => {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    if (store) {
        listCard = store.idNamePairs.map((pair) => (
            <ListCard
                key={pair._id}
                idNamePair={pair}
                selected={false}
            />
        ))
    }

    let editStatus = false;
    let buttonClass = "playlister-button";
    if (store.modalActive) {
        editStatus = true;
        buttonClass = "playlister-button-disabled";
    }
    return (
        <div id="playlist-selector">
            <div id="list-selector-list">
                <div id="playlist-selector-heading">
                    <input
                        disabled={editStatus}
                        type="button"
                        id="add-list-button"
                        onClick={handleCreateNewList}
                        className={buttonClass}
                        value="+" />
                    Your Lists
                </div>                {
                    listCard
                }
            </div>
        </div>)
}

export default ListSelector;