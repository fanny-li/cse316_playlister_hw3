import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS.js';
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let buttonClass = "playlister-button";
    let undoButtonClass = "playlister-button";
    let redoButtonClass = "playlister-button";

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    function handleAddSong(event) {
        event.stopPropagation();
        let song = {
            "title": "Untitled",
            "artist": "Unknown",
            "youTubeId": "dQw4w9WgXcQ"
        }
        let index = store.currentList.songs.length;
        store.addAddSongTransaction(store.currentList, song, index);
    }
    let editStatus = false;
    let undoStatus = false;
    let redoStatus = false;

    if (!store.currentList && !store.listNameActive) {
        editStatus = true;
        undoStatus = true;
        redoStatus = true;
        buttonClass = "playlister-button-disabled";
        undoButtonClass = "playlister-button-disabled";
        redoButtonClass = "playlister-button-disabled";
    }
    else if (store.listNameActive) {
        editStatus = true;
        undoStatus = true;
        redoStatus = true;
        buttonClass = "playlister-button-disabled";
        undoButtonClass = "playlister-button-disabled";
        redoButtonClass = "playlister-button-disabled";
    }
    else if (store.modalActive) {
        editStatus = true;
        undoStatus = true;
        redoStatus = true;
        buttonClass = "playlister-button-disabled";
        undoButtonClass = "playlister-button-disabled";
        redoButtonClass = "playlister-button-disabled";
    }
    else if (store.currentList) {
        undoStatus = true;
        redoStatus = true;
        undoButtonClass = "playlister-button-disabled";
        redoButtonClass = "playlister-button-disabled";

        if (store.hasUndoTransaction()) {
            undoStatus = false;
            undoButtonClass = "playlister-button";
        }

        if (store.hasRedoTransaction()) {
            redoStatus = false;
            redoButtonClass = "playlister-button";
        }

    }
    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={editStatus}
                value="+"
                className={buttonClass}
                onClick={handleAddSong}
            />
            <input
                type="button"
                id='undo-button'
                disabled={undoStatus}
                value="⟲"
                className={undoButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={redoStatus}
                value="⟳"
                className={redoButtonClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={editStatus}
                value="&#x2715;"
                className={buttonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;