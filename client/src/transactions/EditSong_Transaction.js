import { jsTPS_Transaction } from "../common/jsTPS.js";

export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initPlaylist, initOldSong, initNewSong, initIndex) {
        super();
        this.store = initStore;
        this.playlist = initPlaylist;
        this.oldSong = initOldSong;
        this.newSong = initNewSong;
        this.index = initIndex;
    }

    doTransaction() {
        this.store.editSong(this.playlist, this.newSong, this.index);
    }

    undoTransaction() {
        this.store.editSong(this.playlist, this.oldSong, this.index);
    }
}