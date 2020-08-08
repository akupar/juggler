
const list = [];

const currentList = list;

const eventListeners = {
    add: [],
};


function add(expr) {
    currentList.push(expr);

    emitEvent("add", expr);
}


function emitEvent(event, param) {

    const func = "on" + event.substr(0,1).toUpperCase() + event.substr(1);
    
    for ( let listener of eventListeners[event] ) {
        if ( listener[func] ) {
            listener[func](param);
        }
    }
}

function addListener(listener, event) {
    if ( !(event in eventListeners) ) {
        throw new Error("No such event: " + event);
    }

    eventListeners[event].push(listener);
}


window.expressionTree = {
    add,    
    addListener
};

export default window.expressionTree;
