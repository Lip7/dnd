import React, {useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

/* TODO:
- Enable that the user needs to Drag and Drop shortly, then press the space key to freeze the selected item which will then be shifted with eye gazing
- As soon as an item is clicked on the button move, then a new red point/eye gazing will be shown again
- Sometimes, when not looking at the screen or when there are no x y coordinates detected by the eye gazing, the system crashes
- Show an object at the red point position while moving/selecting the folder
- When the user looks at the destination folder, it gets highlighted to improve the selection

 */

// Item in list generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}-${new Date().getTime()}`,
        content: `item ${k + offset}`
    }));

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {

    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
});

// Style of the Folders (Here change to activate the folders/list when user selects the destination folder???)
const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    border: '1px solid rgba(0, 0, 0, 10)',
    width: 250,
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'

});


function QuoteApp() {
    const [state, setState] = useState([getItems(10), getItems(5, 10), getItems(5, 15), getItems(5, 20)]);
    let [stateXY, setStateXY] = useState()
    const [keyPressed, setKeyPressed] = useState(false);
    const [keyPressed2, setKeyPressed2] = useState(false);


    //  index: row, droppableId = Column
    const [sourceDroppableId, setsourceDroppableId] = useState(-1)
    const [sourceIndex, setsourceIndex] = useState(-1)

    // Lines which separate the folders in order to detect which folder is in the eye gazing field
    let beforeLineBelongsF1 = window.innerWidth/100*80/4 + window.innerWidth/10 // Folder 1
    let beforeLineBelongsF2 = window.innerWidth/100*80/4*2 + window.innerWidth/10 // Folder 2
    let beforeLineBelongsF3 = window.innerWidth/100*80/4*3 + window.innerWidth/10 // Folder 3

    // Eye Gazing Code ////////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(()=>{
        const webgazer=window.webgazer
        webgazer.setGazeListener((data,clock)=>{

        // check if key B pressed to allow the dropping process
        document.addEventListener('keydown', function(event){
            //console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`); // Check which code pressed and the keycode

            if (event.keyCode == 66 && sourceDroppableId >= 0 ) { // 32 = space, 66 = b

                // Index = row, droppableId = column = nr folder
                // The clicked one solved as source
                let source = {droppableId: sourceDroppableId, index: sourceIndex}
                console.log("Source saved in result ")
                console.log(source)

                // if folder nr. 1 selected: droppableId = 0
                if (data.x < beforeLineBelongsF1){ //&& robotPress
                    console.log("Selected Folder 1")
                    let destination = {droppableId: 0, index: state[0].length}
                    let result = { source, destination }
                    onDragEnd(result)
                    // move(state[source], state[0], source, destination) (droppableId)
                }
                // if folder nr. 2 selected: droppableId = 1
                else if (data.x < beforeLineBelongsF2){
                    console.log("Selected Folder 2")
                    let destination = {droppableId: 1, index: state[1].length}
                    let result = { source, destination }
                    onDragEnd(result)
                }
                // if folder nr. 3 selected: droppableId = 2
                else if (data.x < beforeLineBelongsF3){
                    console.log("Selected Folder 3")
                    let destination = {droppableId: 2, index: state[2].length}
                    let result = { source, destination }
                    onDragEnd(result)
                }
                // if folder nr. 4 selected: droppableId = 3
                else if (data.x >= beforeLineBelongsF3){
                    console.log("Selected Folder 4")
                    let destination = {droppableId: 3, index: state[3].length}
                    let result = { source, destination }
                    onDragEnd(result)
                }

            }
        }
        )


        }).begin()
    }, [sourceDroppableId]);


    function onDragEnd(result) {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            const items = reorder(state[sInd], source.index, destination.index);
            const newState = [...state];
            newState[sInd] = items;
            setState(newState);
        } else {
            const result = move(state[sInd], state[dInd], source, destination);
            const newState = [...state];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];

            setState(newState.filter(group => group.length));
        }
    }

    return (
        <div>
            <br></br>
            <br></br>
            {/* Element to Move Dynamically i.e. when showing the object/item dragged_ */}
            {/*<div*/}
            {/*    style={{*/}
            {/*        position: "absolute",*/}
            {/*        left: window.innerWidth/100*80/4*3 + window.innerWidth/10,  // In Studysession margin left and right 10%*/}
            {/*        top: window.innerHeight/2,*/}
            {/*        background: "lightgrey",*/}
            {/*        border: '1px solid rgba(0, 0, 0, 10)',*/}

            {/*    }}*/}
            {/*>*/}
            {/*    GeeksforGeeks*/}
            {/*</div>*/}
            <button
                type="button"
                onClick={() => {
                    setState([...state, []]);
                }}
            >
                Add new Folder
            </button>
            <button
                type="button"
                onClick={() => {
                    setState([...state, getItems(1)]);
                }}
            >
                Add new File
            </button>
            <div style={{ display: "flex" }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    {state.map((el, ind) => (
                        <Droppable  key={ind} droppableId={`${ind}`}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                    {...provided.droppableProps}
                                >

                                    {el.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-around"
                                                        }}
                                                    >
                                                        {item.content}
                                                        <button
                                                            type="button"
                                                            onClick={() => {

                                                                // Send the index=row of the clicked item
                                                                setsourceIndex(index)

                                                                // Send the column/folder of the clicked item
                                                                setsourceDroppableId(ind.toString())
                                                            }}
                                                        >
                                                            move
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </DragDropContext>
            </div>
        </div>
    );
}


export default function App() {

    return (
        <QuoteApp />
    );
}