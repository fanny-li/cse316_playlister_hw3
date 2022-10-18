import './App.css';
import { React, useContext } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Banner, ListSelector, PlaylistCards, Statusbar } from './components'
import { GlobalStoreContext } from './store';
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
const App = () => {
    const { store } = useContext(GlobalStoreContext);

    function handleOnKeyDown(event) {
        console.log("here");
        if (event.ctrlKey && event.key == "z") {
            console.log("undo");
            store.undo();
        }
        if (event.ctrlKey && event.key == "y") {
            store.redo();
        }
    }
    return (
        <Router>
            <div id="app-root" tabIndex={-1} onKeyDown={handleOnKeyDown} >
                <Banner />
                <Switch>
                    <Route path="/" exact component={ListSelector} />
                    <Route path="/playlist/:id" exact component={PlaylistCards} />
                </Switch>
                <Statusbar />
            </div>
        </Router>
    )
}

export default App