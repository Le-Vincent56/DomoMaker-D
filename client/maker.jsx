const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    // Prevent default events and hide error messages
    e.preventDefault();
    helper.hideError();

    // Get the name and age of the domo
    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;

    // Check if both a name and age are given
    if(!name || !age) {
        helper.handleError('All fields are required');
        return false;
    }

    // Post the domo
    helper.sendPost(e.target.action, {name, age}, onDomoAdded);
    return false;
};

const DomoForm = (props) => {
    return(
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name</label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age"/>
            <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
    );
};

const DomoList = (props) => {
    // Store the domos array using useState so that we can update and rerender the list
    const [domos, setDomos] = useState(props.domos);

    // Create an effect that reloads whenever the variable changes
    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    // Present the appropriate HTML if there are no Domos
    if(domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    // Create a node for each domo
    const domoNodes = domos.map(domo => {
        return (
            <div key={domo.id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
            </div>
        );
    });

    // List all domo nodes
    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const App = () => {
    // Store a state variable as a boolean and set it to false
    const [reloadDomos, setReloadDomos] = useState(false);

    // When we render DomoForm, we create a triggerReload prop, which calls setReloadDomos
    // and passes in the negation of reloadDomos so that it toggles every time it gets called
    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)}/>
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos}/>
            </div>
        </div>
    );
}

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App/>);
};

window.onload = init;