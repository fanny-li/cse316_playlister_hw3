import React, { useContext } from 'react';
import { GlobalStoreContext } from '../store';

const DeleteListModal = () => {
    const { store } = useContext(GlobalStoreContext);

    let name = "";
    if (store.listToDelete) {
        name = store.listToDelete.name;
    }
    function confirmDeleteList(event) {
        event.stopPropagation();
        store.confirmDeleteList();
        document.getElementById("delete-list-modal").classList.remove("is-visible");
    }
    function cancelDeleteList(event) {
        event.stopPropagation();
        store.cancelDeleteList()
        document.getElementById("delete-list-modal").classList.remove("is-visible");
    }
    return (
        <div
            className="modal"
            id="delete-list-modal"
            data-animation="slideInOutLeft">
            <div className="modal-dialog" id='verify-delete-list-root'>
                <div className="modal-header">
                    Delete playlist?
                </div>
                <div className="modal-center">
                    <div className="modal-center-content">
                        Are you sure you wish to permanently delete the <span style={{ fontWeight: 'bold' }}>{name}</span> playlist?
                    </div>
                </div>
                <div className="modal-footer">
                    <input type="button"
                        id="delete-list-confirm-button"
                        className="modal-button"
                        onClick={confirmDeleteList}
                        value='Confirm' />
                    <input type="button"
                        id="delete-list-cancel-button"
                        className="modal-button"
                        onClick={cancelDeleteList}
                        value='Cancel' />
                </div>
            </div>
        </div>
    );
}

export default DeleteListModal;