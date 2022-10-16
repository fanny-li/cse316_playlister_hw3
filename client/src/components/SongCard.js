import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import DeleteSongModal from './DeleteSongModal';

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [deleteModalActive, setDeleteModalActive] = useState(false);
    const [editModalActive, setEditModalActive] = useState(false);
    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";

    function handleDeleteSong(event) {
        event.stopPropagation();
        let newActive = !deleteModalActive;
        if (newActive) {
            store.markSongForDeletion(store.currentList, song, index);
        }
        setDeleteModalActive(newActive);
    }

    function handleClick(event) {
        event.stopPropagation();
        if (event.detail == 2) {
            let newActive = !editModalActive;
            setEditModalActive(newActive);
        }
    }
    if (deleteModalActive) {
        document.getElementById("delete-song-modal").classList.add("is-visible");
        setDeleteModalActive(!deleteModalActive);
    }
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onClick={handleClick}
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                onClick={handleDeleteSong}
                value={"\u2715"}
            />
            <DeleteSongModal />
        </div>
    );
}

export default SongCard;