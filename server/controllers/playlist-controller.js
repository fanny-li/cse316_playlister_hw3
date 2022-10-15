const Playlist = require('../models/playlist-model')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + body);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    console.log("playlist: " + JSON.stringify(body));
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    playlist
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                playlist: playlist,
                message: 'Playlist Created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Playlist Not Created!',
            })
        })
}
getPlaylistById = async (req, res) => {
    await Playlist.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json({ success: true, playlist: list })
    }).catch(err => console.log(err))
}
getPlaylists = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}
getPlaylistPairs = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: 'Playlists not found' })
        }
        else {
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in playlists) {
                let list = playlists[key];
                let pair = {
                    _id: list._id,
                    name: list.name
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
        }
    }).catch(err => console.log(err))
}
updatePlaylistById = async (req, res) => {

    const body = req.body;
    console.log("Update Playlist body: " + body);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }


    await Playlist.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        list.name = body.name;
        list.songs = body.songs;

        list
            .save()
            .then(() => {
                return res.status(201).json({
                    success: true,
                    playlist: list,
                    message: 'Playlist Updated!',
                })
            }).catch(err => {
                return res.status(400).json({
                    err,
                    message: 'Playlist Not Updated!'
                })
            })
    })
}

deletePlaylistById = async (req, res) => {
    await Playlist.findOneAndDelete({ _id: req.params.id }, (err, playlists) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: err
            })
        }
        return res.status(200).json({
            success: true,
            data: playlists
        })
    }).catch(err => console.log(err))
}

addSong = async (req, res) => {
    await Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: err
            })
        }

        let newSongs = [...playlist.songs];
        let song = {
            "title": "Untitled",
            "artist": "Unknown",
            "youTubeId": "dQw4w9WgXcQ"
        }

        newSongs.push(song);
        console.log(newSongs);

        playlist.songs = newSongs;

        playlist
            .save()
            .then(() => {
                return res.status(201).json({
                    success: true,
                    playlist: playlist,
                    message: "Song Added!"
                })
            }).catch(err => {
                return res.status(400).json({
                    err,
                    message: "Song Not Added!"
                })
            })
    })
}


module.exports = {
    createPlaylist,
    getPlaylists,
    getPlaylistPairs,
    getPlaylistById,
    updatePlaylistById,
    deletePlaylistById,
    addSong
}