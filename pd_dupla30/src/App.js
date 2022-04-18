import React, { useState, useEffect } from 'react'
import { Gantt } from 'gantt-task-react';
import { Button, Input } from 'antd';
import "gantt-task-react/dist/index.css";

const initialTaskData = {
  name: 'nova tarefa',
  weight: 1,
  start: new Date(2022, 4, 8),
  end: new Date(2022, 4, 9) 
}

const tasksInputMap = [
  { key: 'name', label: 'Nome'},
  { key: 'weight', label: 'peso'},
  { key: 'start', label: 'dia de inicio'},
  { key: 'end', label: 'dia de fim'}
]

const initialTasksDAta = [ 
  { 
    name: 'tarefa 1 - 3', 
    weight: 3, 
    start: new Date(2022, 4, 8), 
    end: new Date(2022, 4, 9) 
  }, 
  { 
    name: 'tarefa 2 - 2', 
    weight: 2, 
    start: new Date(2022, 4, 9), 
    end: new Date(2022, 4, 10) 
  }, 
  { 
    name: 'tarefa 3 - 5', 
    weight: 5, 
    start: new Date(2022, 4, 12), 
    end: new Date(2022, 4, 16) 
  } 
]

function App() {
  const [auxMap, setAuxMap] = useState({}); 
  const [newTaskData,setNewTaskData] = useState(initialTaskData);
  const [lastItems, setLastItems] = useState({}); 
  const [totalResult, setTotalResult] = useState(null); 
  const [resultTasks,setResultTasks] = useState([]);
  const [sortedTasks,setSortedTasks] = useState(initialTasksDAta);
  const [tasks,setTasks] = useState(initialTasksDAta); 
 
  const solve = index => {
    if(index === -1) { 
      return 0; 
    } 
     
    if(auxMap[index]) { 
      return auxMap[index]; 
    } 
    const res = Math.max(tasks[index]?.weight + solve(lastItems[index]), solve(index-1)); 
    setAuxMap(prev => ({ ...prev, [index]: res })); 
    return res; 
  } 
 
  const getLastItem = index => { 
    for (var i = index; i >= 0; i--) { 
      if(tasks[i].end <= tasks[index].start) return i; 
   } 
   return -1; 
  } 
 
  useEffect(() => {
    tasks.forEach((item, index) => { 
      setLastItems(prev => ({ ...prev, [index]: getLastItem(index)})); 
    });
    setSortedTasks(tasks.sort((a,b) => {
      if (a.end > b.end) {
        return 1;
      }
      if (a.end < b.end) {
        return -1;
      }
      return 0;
    }));
  }, [tasks]);

  return ( 
    <> 
    <div>
      {tasksInputMap.map(task => (
        <div>
          <label>{task.label}:</label>
          <Input onChange={e => setNewTaskData(prev => ({ ...prev, [task.key]: e.target.value}))}/>
        </div>
      ))}
    <Button type="primary" onClick={() => {
      const _newTaskData = { name:`${newTaskData.name} - ${newTaskData.weight}` , weight: Number(newTaskData.weight), start: new Date(2022, 4, newTaskData.start), end: new Date(2022, 4, newTaskData.end)}
      setTasks(prev => ([...prev, _newTaskData]));
    }}>Adicionar</Button>
    </div>
    <Gantt tasks={sortedTasks} />
    <Button type="primary"  onClick={() => {
      setTotalResult(solve(tasks.length-1));

    }}> Calcular</Button>
    <label>{totalResult}</label>
    {resultTasks.length ? (
      <Gantt tasks={resultTasks} />
    ) : null}
    </> 
  ); 
}

export default App;
