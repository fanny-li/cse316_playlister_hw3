import { jsTPS_Transaction } from "../common/jsTPS.js";

export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initPlaylist, initSong, initIndex) {
        super();
        this.store = initStore;
        this.playlist = initPlaylist;
        this.song = initSong;
        this.index = initIndex;
    }

    doTransaction() {
        this.store.addSongToList(this.playlist, this.song, this.index);
    }

    undoTransaction() {
        this.store.confirmDeleteSong(this.playlist, this.index);
    }
}