import React, {useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// fake data generator
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

    console.log(source)
    console.log(destination)
    console.log( droppableSource)
    console.log( droppableDestination)


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

const getItemStyleClick = (isClicking) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isClicking ? "lightgreen" : "grey",

});

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


// Hook
function useKeyPress(targetKey) {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);
    // If pressed key is our target key then set to true
    function downHandler({ key }) {
        if (key === targetKey) {
            setKeyPressed(true);
            console.log("PRESSED")
        }
    }
    // If released key is our target key then set to false
    const upHandler = ({ key }) => {
        if (key === targetKey) {
            setKeyPressed(false);
        }
    };
    // Add event listeners
    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount
    return keyPressed;
}


function QuoteApp() {
    const [state, setState] = useState([getItems(10), getItems(5, 10), getItems(5, 15), getItems(5, 20)]);
    let [stateXY, setStateXY] = useState()

    //  index: row, droppableId = Column
    const [sourceDroppableId, setsourceDroppableId] = useState(-1)
    const [sourceIndex, setsourceIndex] = useState(-1)

    const robotPress = useKeyPress("b");

    // State if clicked on file/button, mark as source, second click on folder button add it there using move

    // console.log(window.innerWidth)
    // console.log(window.innerHeight)
    let beforeLineBelongsF1 = window.innerWidth/100*80/4 + window.innerWidth/10
    let beforeLineBelongsF2 = window.innerWidth/100*80/4*2 + window.innerWidth/10
    let beforeLineBelongsF3 = window.innerWidth/100*80/4*3 + window.innerWidth/10

    // This function calculate X and Y
    const getPosition = (item_id) => {
        //const x = boxRef.current.offsetLeft;

        //const y = boxRef.current.offsetTop;
    };

    // // Get the position of the red box in the beginning
    // useEffect(() => {
    //    // getPosition();
    // }, []);


    function onClick(){

        // Else Folder 4

    }

    // Eye Gazing Code
    useEffect(()=>{
        const webgazer=window.webgazer
        webgazer.setGazeListener((data,clock)=>{
           // console.log(data)
            console.log(data.x)
            console.log("Line x")
            console.log(sourceDroppableId)




            // Index = row, droppableId = column = nr folder
            // if folder one selected: droppableId = 0
            // Clicked one is saved in  as ind
            if (data.x < beforeLineBelongsF1 && sourceDroppableId >= 0){
                console.log("Selected List 1")
                let source = {droppableId: sourceDroppableId, index: sourceIndex}
                console.log("Source saved in result ")
                console.log(source)
                let destination = {droppableId: 0, index: state[0].length}
                let result = { source, destination }
                onDragEnd(result)
                // move(state[source], state[0], source, destination) (droppableId)
            }
        }).begin()
    }, [sourceDroppableId]);

    function onDragEnd(result) {
        const { source, destination } = result;
        console.log(result)
        console.log("onDragEnd")
        console.log(source)
        console.log(destination)
        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        console.log("sInd in onDragEnd")
        console.log(sInd)

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
            {/* Element to Move Dynamically */}
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
                                                                console.log("Ind: Column")
                                                                console.log(index)
                                                                setsourceIndex(index)
                                                                console.log(sourceIndex)

                                                                console.log("Index: Row of item")
                                                                console.log(ind)
                                                                setsourceDroppableId(ind.toString())
                                                                console.log(sourceDroppableId)

                                                                //getPosition(item.id)

                                                                // const newState = [...state];
                                                                // newState[ind].splice(index, 1);
                                                                // setState(
                                                                //     newState.filter(group => group.length)
                                                                // );

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