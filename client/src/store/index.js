import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS.js'
import api from '../api'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction.js';
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_SONG: "MARK_SONG"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        listToDelete: null,
        songClicked: null,
        songIndex: 0
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    // A reducer is a function that returns the next state of app
    // payload is a term used for the property that holds the actual data in an object
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listToDelete: payload
                });
            }

            case GlobalStoreActionType.DELETE_SELECTED_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter - 1,
                    listNameActive: false
                })
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true
                });
            }

            // MARK SONG
            case GlobalStoreActionType.MARK_SONG: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    songClicked: payload.song,
                    songIndex: payload.index
                });
            }

            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function () {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // this function creates a new list
    store.createNewList = function () {
        async function createNewList() {
            let response = await api.getAllPlaylists();
            if (response.data.success) {
                let newlist = {
                    "name": "Untitled",
                    "songs": [],
                };
                async function postList(newlist) {
                    response = await api.addNewPlaylist(newlist);
                    if (response.data.success) {
                        let playlist = response.data.playlist;

                        storeReducer({
                            type: GlobalStoreActionType.CREATE_NEW_LIST,
                            payload: playlist
                        })
                        store.loadIdNamePairs();
                    }
                }
                postList(newlist);
            }
        }
        createNewList();
    }

    // this function deletes a list
    store.markListForDeletion = function (id) {
        async function markListForDeletion(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: playlist
                })
            }
        }
        markListForDeletion(id);
    }

    store.confirmDeleteList = function () {
        async function confirmDeleteList() {
            let response = await api.getPlaylistPairs();
            if (response.data.success) {
                let playlist = store.listToDelete;
                async function deleteList(id) {
                    response = await api.deletePlaylistById(id);
                    if (response.data.success) {
                        store.loadIdNamePairs();

                        storeReducer({
                            type: GlobalStoreActionType.DELETE_SELECTED_LIST,
                            payload: {}
                        })
                    }
                }
                deleteList(playlist._id)
            }
        }
        confirmDeleteList();
    }

    // this function adds a song to the currentlist
    store.addSongToList = function (playlist) {
        async function addSong(id) {
            let response = await api.addSong(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
                store.history.push("/playlist/" + playlist._id);
            }
        }
        addSong(playlist._id)

    }

    // this function deletes a song from the current playlist
    store.markSong = function (playlist, song, index) {
        async function markSong(playlist, song, index) {
            let payload = {
                playlist: playlist,
                song: song,
                index: index
            }
            storeReducer({
                type: GlobalStoreActionType.MARK_SONG,
                payload: {
                    playlist: payload.playlist,
                    song: payload.song,
                    index: payload.index
                }
            })

            store.history.push("/playlist/" + playlist._id);
        }
        markSong(playlist, song, index);
    }

    store.confirmDeleteSong = function (playlist, song, index) {
        async function confirmDeleteSong(playlist, song, index) {
            let updatedSongs = [...playlist.songs];

            if (index >= 0) {
                updatedSongs.splice(index, 1);
            }

            playlist.songs = [...updatedSongs];
            console.log(playlist);

            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success) {
                let playlist = response.data.playlist;

                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                })

                store.history.push("/playlist/" + playlist._id);
            }
        }
        confirmDeleteSong(playlist, song, index);
    }

    // this function edits the song
    store.editSong = function (playlist, title, artist, youTubeId, index) {
        async function editSong(playlist, title, artist, youTubeId, index) {
            let updatedSongs = [...playlist.songs];

            updatedSongs[index] = {
                "title": title,
                "artist": artist,
                "youTubeId": youTubeId
            }

            playlist.songs = [...updatedSongs];
            console.log(playlist);

            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success) {
                let playlist = response.data.playlist;

                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                })

                store.history.push("/playlist/" + playlist._id);
            }
        }
        editSong(playlist, title, artist, youTubeId, index);
    }

    // this function moves the song
    store.moveSong = function (playlist, start, end) {
        async function moveSong(playlist, start, end) {
            if (start < end) {
                let temp = playlist.songs[start];

                for (let i = +(start); i < end; i++) {
                    playlist.songs[i] = playlist.songs[i + 1];
                }
                playlist.songs[end] = temp;
            }
            else if (start > end) {
                let temp = playlist.songs[start];
                for (let i = +(start); i > end; i--) {
                    playlist.songs[i] = playlist.songs[i - 1];
                }
                playlist.songs[end] = temp;
            }

            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success) {
                let playlist = response.data.playlist;

                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                })

                store.history.push("/playlist/" + playlist._id);
            }
        }

        moveSong(playlist, start, end);

    }

    // TRANSACTIONS
    store.addMoveSongTransaction = function (playlist, start, end) {
        let transaction = new MoveSong_Transaction(this, playlist, start, end);
        tps.addTransaction(transaction);
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}