import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import DeleteSongModal from './DeleteSongModal';
import EditSongModal from './EditSongModal';

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [deleteModalActive, setDeleteModalActive] = useState(false);
    const [editModalActive, setEditModalActive] = useState(false);
    const { song, index } = props;
    const [drag, setDrag] = useState({
        "isDragging": false,
        "draggedTo": false
    })

    let cardClass = "list-card unselected-list-card";

    function handleDeleteSong(event) {
        event.stopPropagation();
        let newActive = !deleteModalActive;
        if (newActive) {
            store.markSong(store.currentList, song, index);
        }
        setDeleteModalActive(newActive);
    }

    function handleClick(event) {
        event.stopPropagation();
        if (event.detail == 2) {
            let newActive = !editModalActive;
            if (newActive) {
                store.markSong(store.currentList, song, index);
            }
            setEditModalActive(newActive);
        }
    }

    function handleDragStart(event) {
        event.dataTransfer.setData("song", event.target.id); // chosen song
        setDrag({
            "isDragging": true,
            "draggedTo": drag.draggedTo
        })
    }
    function handleDragOver(event) {
        event.preventDefault();
        setDrag({
            "isDragging": drag.isDragging,
            "draggedTo": true
        })
    }
    function handleDragEnter(event) {
        event.preventDefault();
        setDrag({
            "isDragging": drag.isDragging,
            "draggedTo": true
        })
    }
    function handleDragLeave(event) {
        event.preventDefault();
        setDrag({
            "isDragging": drag.isDragging,
            "draggedTo": false
        })
    }
    function handleDrop(event) {
        event.preventDefault();
        let target = event.target;
        let targetId = (event.target.id).substring(target.id.indexOf("-") + 1, target.id.indexOf("-") + 2);

        let sourceId = event.dataTransfer.getData("song"); // gets the stored data from when stored
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1, sourceId.indexOf("-") + 2);

        setDrag({
            "isDragging": false,
            "draggedTo": false
        })

        store.addMoveSongTransaction(store.currentList, sourceId, targetId);
    }
    if (deleteModalActive) {
        document.getElementById("delete-song-modal").classList.add("is-visible");
        setDeleteModalActive(!deleteModalActive);
    }
    if (editModalActive) {
        document.getElementById("edit-song-modal").classList.add("is-visible");
        setEditModalActive(!editModalActive);
    }
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onClick={handleClick}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
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
            <EditSongModal />
        </div>
    );
}

export default SongCard;