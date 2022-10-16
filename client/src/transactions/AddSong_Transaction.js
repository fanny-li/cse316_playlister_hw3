import { jsTPS_Transaction } from "../common/jsTPS.js";

export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initPlaylist, initIndex) {
        super();
        this.store = initStore;
        this.playlist = initPlaylist;
        this.index = initIndex;
    }

    doTransaction() {
        this.store.addSongToList(this.playlist, this.index);
    }

    undoTransaction() {
        this.store.confirmDeleteSong(this.playlist, this.index);
    }
}