import React, {useEffect, useRef, useState} from "react";
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
// avoids showing warn and errors in console
console.warn = console.error = () => {};

// global webgazer in order to have only one and saving data in a global value
let dataXY = {x: 0, y: 0}
let startTime
let endTime
let totalTimeTest1 = 0 // and two

let startTestTime

let numberTimesClickedFolder = 0
let startTimeClickedFolder1
let endTimeClickedFolder2
let totalTimeClickingFolders = 0


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

// Style of Files
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

// Function to run Webgazer and folder states
function QuoteApp() {
    const [state, setState] = useState([getItems(5) ]);//, getItems(5, 10), getItems(5, 15), getItems(5, 20)]);

    let [showBox, setShowBox] = useState(false)
    const [showItemName, setItemName] = useState("Item not selected");
    let [isDraggingOverFolder, setIsDragging] = useState(false);

    let [disable, setDisable] = React.useState(false);
    let [disableFinish, setDisableFinish] = React.useState(false);

    let [myArray, setMyArray] = useState(["HOME"]);

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
        // if(sourceDroppableId < 0){
        //     webgazer.setGazeListener((data,clock)=>{
        //         //console.log(data)
        //         if((typeof data === "null")|| (typeof data === "null")){
        //             dataXY = {x: 0, y: 0}
        //         }
        //         else{
        //             dataXY = data
        //             // setInterval(Greeting(dataXY), 1);
        //         }
        //     }).begin()
        // }

        // check if key B pressed to allow the dropping process
        document.addEventListener('keydown', function(event){

                if (event.keyCode == 66 && sourceDroppableId >= 0 ) { // 32 = space, 66 = b

                    //webgazer.pause();
                    // Index = row, droppableId = column = nr folder
                    // The clicked one solved as source
                    let source = {droppableId: sourceDroppableId, index: sourceIndex}
                    // console.log("Source saved in result ")
                    // console.log(source)

                    // if folder nr. 1 selected: droppableId = 0
                    if (dataXY.x < beforeLineBelongsF1){ //&& robotPress
                        console.log("Test 2: Dropped " + "item number " + sourceIndex + " from folder " + sourceDroppableId +  " by clicking B to folder 0")
                        let destination = {droppableId: 0, index: state[0].length}
                        let result = { source, destination }
                        onDragEnd(result)
                        // move(state[source], state[0], source, destination) (droppableId)
                    }
                    // if folder nr. 2 selected: droppableId = 1
                    else if (dataXY.x < beforeLineBelongsF2){
                        console.log("Test 2: Dropped " + "item number " + sourceIndex + " from folder " + sourceDroppableId +  " by clicking B to folder 1")
                        let destination = {droppableId: 1, index: state[1].length}
                        let result = { source, destination }
                        onDragEnd(result)
                    }
                    // if folder nr. 3 selected: droppableId = 2
                    else if (dataXY.x < beforeLineBelongsF3){
                        console.log("Test 2: Dropped " + "item number " + sourceIndex + " from folder " + sourceDroppableId +  " by clicking B to folder 2")
                        let destination = {droppableId: 2, index: state[2].length}
                        let result = { source, destination }
                        onDragEnd(result)
                    }
                    // if folder nr. 4 selected: droppableId = 3
                    else if (dataXY.x >= beforeLineBelongsF3){
                        console.log("Test 2: Dropped " + "item number " + sourceIndex + " from folder " + sourceDroppableId +  " by clicking B to folder 3")
                        let destination = {droppableId: 3, index: state[3].length}
                        let result = { source, destination }
                        onDragEnd(result)
                    }
                    setShowBox(false)

                    endTime = performance.now()
                    let usedTime = (endTime - startTime)
                    console.log("Test 2: Dragged Item and used Eye Gazer and had: " + usedTime + " milliseconds")
                    totalTimeTest1 = totalTimeClickingFolders + usedTime
                    console.log("Totally used time for test 2: " + totalTimeTest1)

                    //webgazer.resume();
                }
            }
        )

    }, [sourceDroppableId]);

    // Moves item to folder
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
            await setState([...state, getItems(5, 0)])
            setIsDragging(false)
            endTime = performance.now()
            let usedTime = (endTime - startTime)
            console.log("Dragged Item and Hovered over folder and had: " + usedTime + " milliseconds")
            totalTimeTest1 = totalTimeTest1 + usedTime
            console.log("Totally used Dragging time for test 1: " + totalTimeTest1)
        }

    }

    // Outputes the name of the user
    const handleMobile=(text)=>{
        console.log(text);
    }


    return (
        <div>
            <div  style={{ color: "lightgreen" }}>
                <h1>TEST 1: Drag and Drop</h1>
                <p>Thank you for taking your time. Here is the first task with the goal to move the item 2 to the folder 6.
                    Please read the instructions carefully before you start:</p>
                <form>
                    <label>
                        1. Enter your Name:

                        <input type="text" name="name" onChange={(event)=>{handleMobile(event.target.value)}}   onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                        />
                    </label>
                </form>
                <p>2. Click on START TEST 1 and Drag and Drop the item 2 into the corresponding folders (alternately like Folder NR. 0 (Top) -> folder nr. 1 (Bottom) -> Folder NR. 2 (Top) -> folder nr. 3 (Bottom) and so on). </p>
                <p>3. Start by dragging the item 2 over the Folder NR. 0. Then Drag and Drop the new item 2 in the Folder NR. 0 into the bottom folder nr. 1 </p>
                <p>4. Drag and Drop the new item 2 into the top Folder NR. 2 and so on till it is in the folder 6.</p>
                <p>5. Stop the test by pressing on the END TEST 1 Button. Please do not start again if you failed and leave it like this.</p>
                <br></br>
                {disableFinish && <p>
                    <p>6. Now go to the developer console window on Chrome, use the keyboard shortcut Control-Shift-J on Windows or Cmd-Option-J on a Mac </p>
                    <p>OR Right Click with the mouse on the website and click on inspect to go to CONSOLE</p>
                    <p>9. Go to CONSOLE and make a screenshot of the whole screen including the output of the console (you can move the window of the output more to the left like a normal window) and save it as yourName_test1_trial1 in order that you can later upload it on the google form after the second task.</p>
                    <p>10. Please do the whole test 1 in total 3 times. If you have 3 screenshots of the test 1, then move to the eye gazer test 2 by clicking on <a className='a' target="_blank" href={"https://dndgazer-d0158.web.app/gazer"}> https://drag-and-drop-c9785.web.app/gazer</a> </p>
                </p>  }
                <br></br>
                <button
                    disabled={disable}
                    onClick={() => {
                        startTestTime = performance.now()
                        setDisable(true)
                    }}
                >START TEST 1</button>

                {disable &&
                <button
                    disabled={disableFinish}
                    onClick={() => {
                        let endTestTime1 = performance.now()
                        console.log("Finished Test 1 and used: " + (endTestTime1-startTestTime))
                        //setDisable(false)
                        setDisableFinish(true)

                    }}>
                    END TEST 1</button> }
            </div>
            <br></br>
            <br></br>


            <MouseTooltip
                visible={false} // test 1 no selected item showing
                offsetX={15}
                offsetY={15}
            >
                <div
                    // onMouseMove={onMouseMove}

                    style={{
                        position: "absolute",
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
                                        <b> {myArray[ind]} </b>
                                        {/*HOME\DOCUMENTS\Folder NR.*/}
                                    </p>
                                    <br></br>
                                    <button
                                        type="button"
                                        // style={{
                                        //     maxWidth: "285px",
                                        //     maxHeight: "50px",
                                        //     minWidth: "285px",
                                        //     minHeight: "50px",
                                        //     marginBottom: "8px"
                                        // }}
                                        onMouseOver={() => {
                                            if(isDraggingOverFolder){
                                                let nextArray = myArray[ind] + "/" + (ind)
                                                setMyArray(oldArray => [...oldArray, nextArray])
                                            }
                                            UserGreeting()
                                        }}
                                        onClick={() => {
                                            setState([...state, getItems(5)]);
                                            numberTimesClickedFolder = numberTimesClickedFolder + 1
                                            console.log("Second Test: Clicked on Folder Nr. " + (ind))

                                            if (numberTimesClickedFolder === 1){
                                                startTimeClickedFolder1 = performance.now()
                                            } else if (numberTimesClickedFolder === 7){
                                                endTimeClickedFolder2 = performance.now()
                                                totalTimeClickingFolders = endTimeClickedFolder2-startTimeClickedFolder1
                                                console.log("Test 2: Used time to click/open three folders: " + (totalTimeClickingFolders))
                                            }
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

                                                    {snapshot.isDragging ? setsourceIndex(index) : ''}
                                                    {snapshot.isDragging ? setsourceDroppableId(ind.toString()) : ''}

                                                    {snapshot.isDragging ? setItemName(item.id.substr(0, 7) + " selected") : '' }
                                                    <div style={{ color: "lightgreen" }}>{snapshot.isDragging ? (startTime = performance.now()) : ""  }</div>

                                                    {(sourceIndex > 0 && !isDraggingOverFolder) ? (console.log("Is dragging item " + sourceIndex  + " from Folder Nr " + (sourceDroppableId-1) + " and started: " + startTime)) : ""}
                                                    {snapshot.isDragging ? setShowBox(true) : '' }
                                                    {snapshot.isDragging ? setIsDragging(true) : false }

                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-around"
                                                        }}
                                                    >

                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    <button
                                        type="button"
                                        // style={{
                                        //     maxWidth: "285px",
                                        //     maxHeight: "50px",
                                        //     minWidth: "285px",
                                        //     minHeight: "50px",
                                        //     marginBottom: "8px"
                                        // }}
                                        onMouseOver={() => {
                                            if(isDraggingOverFolder){
                                                let nextArray = myArray[ind] + "/" + (ind)
                                                setMyArray(oldArray => [...oldArray, nextArray])
                                            }
                                            UserGreeting()
                                        }}

                                        onClick={() => {
                                            setState([...state, getItems(5)]);
                                            numberTimesClickedFolder = numberTimesClickedFolder + 1
                                            console.log("Second Test: Clicked on Folder Nr. 1 BELOW")

                                            if (numberTimesClickedFolder === 1){
                                                startTimeClickedFolder1 = performance.now()
                                            } else if (numberTimesClickedFolder === 3){
                                                endTimeClickedFolder2 = performance.now()
                                                totalTimeClickingFolders = endTimeClickedFolder2-startTimeClickedFolder1
                                                console.log("Test 2: Used time to click/open three folders: " + (totalTimeClickingFolders))
                                            }                                        }}
                                    >
                                        <div className='rowC'>
                                            <img  src={folderImage} width="50" height="50"/>
                                            <div
                                                style={{ marginTop: "20px", marginRight: "5px" }}
                                            >
                                                folder nr. {ind}</div>
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