import { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { GlobalStoreContext } from '../store'
import DeleteListModal from './DeleteListModal.js';
/*
    This is a card in our list of playlists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    store.history = useHistory();
    const { idNamePair, selected } = props;
    const [modalActive, setModalActive] = useState(false);

    function handleLoadList(event) {
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(_id);
            store.setlistNameActive();
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setlistNameActive();
        }
        setEditActive(newActive);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            if (text === "") {
                toggleEdit();
            }
            else {
                let id = event.target.id.substring("list-".length);
                store.changeListName(id, text);
                toggleEdit();
            }
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleDeleteList(event) {
        event.stopPropagation();
        let newActive = !modalActive;
        if (newActive) {
            store.markListForDeletion(idNamePair._id);
        }
        setModalActive(newActive);
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }

    let cardStatus = false;

    if (modalActive) {
        document.getElementById("delete-list-modal").classList.add("is-visible");
        setModalActive(!modalActive);
    }
    let cardElement =
        <div
            id={idNamePair._id}
            key={idNamePair._id}
            onClick={handleLoadList}
            className={'list-card ' + selectClass}>
            <span
                id={"list-card-text-" + idNamePair._id}
                key={"span-" + idNamePair._id}
                className="list-card-text">
                {idNamePair.name}
            </span>
            <input
                disabled={cardStatus}
                type="button"
                id={"delete-list-" + idNamePair._id}
                className="list-card-button"
                onClick={handleDeleteList}
                value={"\u2715"}
            />
            <input
                disabled={cardStatus}
                type="button"
                id={"edit-list-" + idNamePair._id}
                className="list-card-button"
                onClick={handleToggleEdit}
                value={"\u270E"}
            />
            <DeleteListModal />
        </div>;


    if (editActive) {
        cardElement =
            <input
                id={"list-" + idNamePair._id}
                className='list-card'
                type='text'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
            />;
    }

    // if (modalActive) {
    //     document.getElementById("delete-list-modal").classList.add("is-visible");
    //     cardStatus = true;
    //     // setModalActive(!modalActive);
    // }

    return (
        cardElement
    );
}

export default ListCard;