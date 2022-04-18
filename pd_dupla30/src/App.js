import React, { useState, useEffect } from 'react'
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import './App.css';

function App() {
  var auxMap = { 0: 0 }; 
  const [lastItems, setLastItems] = useState({}); 
  const [tasks,setTasks] = useState([ 
    { 
      name: 'teste 1', 
      weight: 3, 
      start: new Date(2022, 4, 9), 
      end: new Date(2022, 4, 10) 
    }, 
    { 
      name: 'teste 2', 
      weight: 2, 
      start: new Date(2022, 4, 8), 
      end: new Date(2022, 4, 9) 
    }, 
    { 
      name: 'teste 3', 
      weight: 5, 
      start: new Date(2022, 4, 12), 
      end: new Date(2022, 4, 16) 
    } 
  ]); 
 
  const solve = index => { 
 
    if(index === -1 || index === undefined) { 
      return 0; 
    } 
     
    if(auxMap[index]) { 
      return auxMap[index]; 
    } 
    console.log(tasks[index]?.weight, solve(lastItems[index]), solve(index-1)) 
    const res = Math.max(tasks[index]?.weight + solve(lastItems[index]), solve(index-1)); 
    auxMap = { ...auxMap, [index]: res }; 
    return res; 
  } 
 
  const getLastItem = index => { 
    for (var i = index; i >= 0; i--) { 
      if(tasks[i].end < tasks[index].start) return i; 
   } 
   return -1; 
  } 
 
  useEffect(() => { 
    tasks.forEach((item, index) => { 
      setLastItems(prev => ({ ...prev, [index]: getLastItem(index)})); 
    }) 
  },[]) 
 
  return ( 
    <> 
    {JSON.stringify(lastItems)} 
    {solve(tasks.length-1)} 
    {JSON.stringify(auxMap)} 
    <Gantt tasks={tasks} />
    </> 
  ); 
}

export default App;
