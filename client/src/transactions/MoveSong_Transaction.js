import { jsTPS_Transaction } from "../common/jsTPS.js";


export default class MoveSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initPlaylist, initOldIndex, initNewIndex) {
        super();
        this.store = initStore;
        this.playlist = initPlaylist;
        this.oldIndex = initOldIndex;
        this.newIndex = initNewIndex;
    }

    doTransaction() {
        this.store.moveSong(this.playlist, this.oldIndex, this.newIndex);
    }

    undoTransaction() {
        this.store.moveSong(this.playlist, this.newIndex, this.oldIndex);
    }
}