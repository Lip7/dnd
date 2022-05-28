import React, {useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MouseTooltip from 'react-sticky-mouse-tooltip';
import './button.css';

import word from './word.png'; // with import
import folderImage from './folderImage.png'; // with import



/* TODO:
- When the user looks at the destination folder, it gets highlighted to improve the selection
- add log
- show selected folder only for second test and also disable hover
- if move item 1 from folder 1 and then want to move item 2 from folder 1 (same start folder), it moves still item 1

Info
- browser sometimes after a while does not show camera anymore, close all apps using cameras and browser and restart
 */


// global webgazer in order to have only one and saving data in a global value
const webgazer=window.webgazer
let dataXY = {x: 0, y: 0}
let diffXMousePoint = 0
let diffYMousePoint = 0
let FolderPath = "HOME/DOCUMENTS/"
let startTime


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
        maxWidth: "100px",

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "white",

    // styles we need to apply on draggables
    ...draggableStyle
});

// Style of the Folders (Here change to activate the folders/list when user selects the destination folder???)
const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "white",
    padding: grid,
    border: '1px solid rgba(0, 0, 0, 10)',
    width: 250,
    flex:1,
    flexDirection:'row',
    alignItems:'left',
    justifyContent:'left'

});

function QuoteApp() {
    const [state, setState] = useState([getItems(5) ]);//, getItems(5, 10), getItems(5, 15), getItems(5, 20)]);
    const [state2, setState2] = useState([getItems(10) ]);//, getItems(5, 10), getItems(5, 15), getItems(5, 20)]);

    let [showBox, setShowBox] = useState(false)
    const [showItemName, setItemName] = useState("Item not selected");
    let [isDraggingOverFolder, setIsDragging] = useState(false);

    const [diffXMousePoint, setDiffXMousePoint] = useState(10)


    //  index: row, droppableId = Column
    const [sourceDroppableId, setsourceDroppableId] = useState(-1)
    const [sourceIndex, setsourceIndex] = useState(-1)

    // Lines which separate the folders in order to detect which folder is in the eye gazing field
    let beforeLineBelongsF1 = window.innerWidth/100*80/4 + window.innerWidth/10 // Folder 1
    let beforeLineBelongsF2 = window.innerWidth/100*80/4*2 + window.innerWidth/10 // Folder 2
    let beforeLineBelongsF3 = window.innerWidth/100*80/4*3 + window.innerWidth/10 // Folder 3

    // Eye Gazing Code ////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(()=>{
        // only start the eye gazing once at the beginning until one item was clicked
        if(sourceDroppableId < 0){
            webgazer.setGazeListener((data,clock)=>{
                //console.log(data)
				if((typeof data === "null")|| (typeof data === "null")){
					dataXY = {x: 0, y: 0}
				}
				else{
					 dataXY = data
                    // setInterval(Greeting(dataXY), 1);
                }
            }).begin()
        }

        // check if key B pressed to allow the dropping process
        document.addEventListener('keydown', function(event){
            //console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`); // Check which code pressed and the keycode

            if (event.keyCode == 66 && sourceDroppableId >= 0 ) { // 32 = space, 66 = b

                //webgazer.pause();
                // Index = row, droppableId = column = nr folder
                // The clicked one solved as source
                let source = {droppableId: sourceDroppableId, index: sourceIndex}
                // console.log("Source saved in result ")
                // console.log(source)

                // if folder nr. 1 selected: droppableId = 0
                if (dataXY.x < beforeLineBelongsF1){ //&& robotPress
                    console.log("Test 2: Dropped " + "item number " + sourceIndex + " from folder " + sourceDroppableId +  " by clicking B to folder 1")
                    let destination = {droppableId: 0, index: state[0].length}
                    let result = { source, destination }
                    onDragEnd(result)
                    // move(state[source], state[0], source, destination) (droppableId)
                }
                // if folder nr. 2 selected: droppableId = 1
                else if (dataXY.x < beforeLineBelongsF2){
                    console.log("Test 2: Dropped " + "item number " + sourceIndex + " from folder " + sourceDroppableId +  " by clicking B to folder 2")
                    let destination = {droppableId: 1, index: state[1].length}
                    let result = { source, destination }
                    onDragEnd(result)
                }
                // if folder nr. 3 selected: droppableId = 2
                else if (dataXY.x < beforeLineBelongsF3){
                    console.log("Test 2: Dropped " + "item number " + sourceIndex + " from folder " + sourceDroppableId +  " by clicking B to folder 3")
                    let destination = {droppableId: 2, index: state[2].length}
                    let result = { source, destination }
                    onDragEnd(result)
                }
                // if folder nr. 4 selected: droppableId = 3
                else if (dataXY.x >= beforeLineBelongsF3){
                    console.log("Test 2: Dropped " + "item number " + sourceIndex + " from folder " + sourceDroppableId +  " by clicking B to folder 4")
                    let destination = {droppableId: 3, index: state[3].length}
                    let result = { source, destination }
                    onDragEnd(result)
                }
                setShowBox(false)

                //webgazer.resume();
            }
        }
        )

        let update = (e) => {
            if((typeof dataXY === "null")|| (typeof dataXY === "null")) {
                setDiffXMousePoint( 0 - e.x)
                diffYMousePoint = 0 - e.y
            }
            else{
                setDiffXMousePoint((dataXY.x - e.x) * (-1))
                diffYMousePoint = (dataXY.y - e.y) * (-1)
                //console.log("Mouse X Diff", diffXMousePoint)
            }

        }

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

    // To enable hovering over folder and opening/adding new folder to the right
    async function UserGreeting()  {
        if(isDraggingOverFolder){
            await setState([...state, getItems(sourceIndex+1, 0)])
            setIsDragging(false)
            console.log("Dragged Item and Hovered over folder Nr. ")
        }
    }

    function GuestGreeting(props) {
        return <h1>Please sign up.
            <div style={{position: 'absolute',left: dataXY.x,
                top: dataXY.y, }} />
            GeeksforGeeks2222
        </h1>;
    }

    function Greeting(props) {
        // console.log("changed")
        // const isLoggedIn = props.isLoggedIn;
        return <h1>Please sign up.
            <div style={{position: 'absolute',left: props.x,
                top: props.y, }} />
            GeeksforGeeks2222
        </h1>;
    }



    return (
        <div>
            <p>Thank you for taking your time. Here is the first task with the goal to move the item 2 to the folder 2. Please read it carefully before you start and then click on START FIRST TEST</p>
            <p>2. Drag and Drop the new item 2 into the folder zero by dragging it over the folder zero</p>
            <p>3. Drag and Drop the new item 2 into the folder one BELOW</p>
            <p>4. Drag and Drop the new item 2 into the folder two</p>
            <br></br>
            <button>START TEST 1</button>
            <button>END TEST 1</button>

            <br></br>
            <br></br>


            <MouseTooltip
                visible={showBox}
                offsetX={15}
                offsetY={15}
            >
            <div
                // onMouseMove={onMouseMove}

                style={{
                    position: "absolute",
                    // left: window.innerWidth/100*80/4*3 + window.innerWidth/10,  // In Studysession margin left and right 10%
                    // top: window.innerHeight/2,
                    //left: dataXY.x,
                    //top: dataXY.y,
                    background: "grey",
                    border: '1px solid rgba(0, 0, 0, 10)',
                    padding: 5,

                }}
            >
                {
                    showItemName
                }
            </div>
            </MouseTooltip>

            {/*}*/}
            {/*<button*/}
            {/*    type="button"*/}
            {/*    onClick={() => {*/}
            {/*        setState([...state, []]);*/}
            {/*    }}*/}
            {/*>*/}
            {/*    Add new Folder*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    type="button"*/}
            {/*    onClick={() => {*/}
            {/*        setState([...state, getItems(1)]);*/}
            {/*    }}*/}
            {/*>*/}
            {/*    Add new File*/}
            {/*</button>*/}
            <div style={{ display: "flex" }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    {state.map((el, ind) => (
                        <Droppable  key={ind} droppableId={`${ind}`}>

                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                    {...provided.droppableProps}
                                    align="left"
                                >
                                    <p>
                                        <b>Folder NR. {ind-1} </b>
                                         {/*HOME\DOCUMENTS\Folder NR.*/}
                                    </p>
                                    <br></br>
                                    <button
                                        // className="button_content"
                                        type="button"
                                        // style={{
                                        //     maxWidth: "285px",
                                        //     maxHeight: "50px",
                                        //     minWidth: "285px",
                                        //     minHeight: "50px",
                                        //     marginBottom: "8px"
                                        // }}
                                        onMouseOver={UserGreeting}
                                        onClick={() => {
                                            setState([...state, getItems(5)]);
                                            console.log("Second Test: Clicked on Folder Nr. " + (ind-1))
                                            // {FolderPath = FolderPath + "Folder NR." +  {ind} + "/"}
                                        }}
                                    >
                                        <div className='rowC'>
                                            <img  src={folderImage} width="50" height="50"/>
                                            <div
                                                style={{ marginTop: "20px", marginRight: "5px" }}
                                            >
                                                Folder NR. {ind} </div>
                                        </div>

                                    </button>


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
                                                    <div>
                                                    <img src={word} width="20" height="20"/>
                                                    {" " + item.content}
                                                    </div>


                                                    {/*{console.log("dragged item:" + snapshot.isDragging)}*/}
                                                    {/*{this.Greeting2(snapshot.isDragging, index, ind.toString())}*/}
                                                    {snapshot.isDragging ? setsourceIndex(index) : ''}
                                                    {snapshot.isDragging ? setsourceDroppableId(ind.toString()) : ''}
                                                    {snapshot.isDragging ? setShowBox(true) : '' }
                                                    {snapshot.isDragging ? setItemName(item.id.substr(0, 7) + " selected") : '' }
                                                    {snapshot.isDragging ? setIsDragging(true) : false }

                                                    {console.log("Is dragging item " + sourceIndex  + " from Folder Nr " + (sourceDroppableId-1) )}
                                                    {/*<Greeting2 isDragging={snapshot.isDragging} index={index} ind = {ind}/>*/}

                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-around"
                                                        }}
                                                    >
                                                        {/*<button*/}
                                                        {/*    type="button"*/}
                                                        {/*    onClick={() => {*/}

                                                        {/*        // Send the index=row of the clicked item*/}
                                                        {/*        setsourceIndex(index)*/}

                                                        {/*        // Send the column/folder of the clicked item*/}
                                                        {/*        setsourceDroppableId(ind.toString())*/}
                                                        {/*    }}*/}
                                                        {/*>*/}
                                                        {/*    move*/}
                                                        {/*</button>*/}
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    <button
                                        // className="button_content"
                                        type="button"
                                        // style={{
                                        //     maxWidth: "285px",
                                        //     maxHeight: "50px",
                                        //     minWidth: "285px",
                                        //     minHeight: "50px",
                                        //     marginBottom: "8px"
                                        // }}
                                        onMouseOver={UserGreeting}
                                        onClick={() => {
                                            setState([...state, getItems(5)]);
                                        }}
                                    >
                                        <div className='rowC'>
                                            <img  src={folderImage} width="50" height="50"/>
                                            <div
                                                style={{ marginTop: "20px", marginRight: "5px" }}
                                            >
                                                Folder NR. 1 </div>
                                        </div>

                                    </button>
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