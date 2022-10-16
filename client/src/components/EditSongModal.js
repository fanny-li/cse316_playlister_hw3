import React, { useContext, useRef, useState } from 'react';
import { GlobalStoreContext } from '../store';

const EditSongModal = () => {
    const { store } = useContext(GlobalStoreContext);

    const titleRef = useRef('');
    const artistRef = useRef('');
    const youTubeIdRef = useRef('');

    if (store.songClicked) {
        titleRef.current.value = store.songClicked.title;
        artistRef.current.value = store.songClicked.artist;
        youTubeIdRef.current.value = store.songClicked.youTubeId;
    }
    function confirmEditSong(event) {
        event.stopPropagation();
        let newSong = {
            "title": titleRef.current.value,
            "artist": artistRef.current.value,
            "youTubeId": youTubeIdRef.current.value
        }
        store.addEditSongTransaction(store.currentList, store.songClicked, newSong, store.songIndex);
        document.getElementById("edit-song-modal").classList.remove("is-visible");
    }
    function cancelEditSong(event) {
        event.stopPropagation();
        document.getElementById("edit-song-modal").classList.remove("is-visible");
    }


    return (
        <div
            className='modal'
            id="edit-song-modal"
            data-animation="slideInOutLeft"
        >
            <div className='modal-dialog'>
                <div className='modal-header'>Edit Song</div>
                <div className='modal-center-edit-song'>
                    <div className='edit-song-attributes'>
                        <label htmlFor="title">Title:</label>
                        <label htmlFor="artist">Artist:</label>
                        <label htmlFor="youTubeId">YouTube Id:</label>
                    </div>
                    <div className='edit-song-attributes'>
                        <input type="text" id='song-title-input' ref={titleRef} />
                        <input type="text" id="song-artist-input" ref={artistRef} />
                        <input type="text" id="song-youtube-id-input" ref={youTubeIdRef} />
                    </div>
                </div>
                <div className='modal-footer'>
                    <input type="button" className="modal-button" value="Confirm" onClick={confirmEditSong} />
                    <input type="button" className="modal-button" value="Cancel" onClick={cancelEditSong} />
                </div>

            </div>
        </div>
    )
}

export default EditSongModal;