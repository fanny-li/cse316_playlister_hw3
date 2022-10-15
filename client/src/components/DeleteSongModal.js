import React, { useContext } from 'react';
import { GlobalStoreContext } from '../store';

const DeleteSongModal = () => {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if (store.songToDelete) {
        name = store.songToDelete.title;
    }
    function confirmDeleteSong(event) {
        event.stopPropagation();
        store.confirmDeleteSong(store.currentList, store.songToDelete, store.songIndex);
        document.getElementById("delete-song-modal").classList.remove("is-visible");
    }
    function cancelDeleteSong(event) {
        event.stopPropagation();
        document.getElementById("delete-song-modal").classList.remove("is-visible");
    }
    return (
        <div
            className="modal"
            id="delete-song-modal"
            data-animation="slideInOutLeft">
            <div className="modal-dialog" id='verify-delete-song-root'>
                <div className="modal-header">
                    Delete playlist?
                </div>
                <div className="modal-center">
                    <div className="modal-center-content">
                        Are you sure you wish to permanently delete the <span style={{ fontWeight: 'bold' }}>{name}</span> from the playlist?
                    </div>
                </div>
                <div className="modal-footer">
                    <input type="button"
                        id="delete-list-confirm-button"
                        className="modal-button"
                        onClick={confirmDeleteSong}
                        value='Confirm' />
                    <input type="button"
                        id="delete-list-cancel-button"
                        className="modal-button"
                        onClick={cancelDeleteSong}
                        value='Cancel' />
                </div>
            </div>
        </div>
    );
}

export default DeleteSongModal;