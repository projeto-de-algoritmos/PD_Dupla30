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
    name: 'tarefa 4 - 4', 
    weight: 4, 
    start: new Date(2022, 4, 8), 
    end: new Date(2022, 4, 11) 
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
  const [totalResult, setTotalResult] = useState([]); 
  const [sortedTasks,setSortedTasks] = useState(initialTasksDAta);
  const [tasks,setTasks] = useState(initialTasksDAta); 
 
  const solve = (index, items) => {
    if(index === -1) { 
      return [0,items]; 
    } 
     
    if(auxMap[index]) { 
      return [auxMap[index], items]; 
    } 
    let get = [0,[...items, tasks[index]]];
    for(const item in lastItems[index]) {
      const aux = solve(item, [...items, tasks[index]]);
      if(aux[0] > get[0])  get = aux;
    }
    const notGet = solve(index-1, items);
    let res;
    if(tasks[index]?.weight + get[0] > notGet[0]) {
      res = [tasks[index]?.weight + get[0], get[1]]; 
    } else {
      res = notGet; 
    }
    setAuxMap(prev => ({ ...prev, [index]: res[0] })); 
    return res; 
  } 
 
  const getLastItem = index => { 
    let items = [];
    for (var i = index; i >= 0; i--) { 
      if(tasks[i].end <= tasks[index].start) items.push(i); 
   } 
   return items; 
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
      setTotalResult(solve(tasks.length-1, []));
      setAuxMap({});
    }}> Calcular</Button>
    <label>{totalResult[0]}</label>
    {totalResult[1]?.length ? (
      <Gantt tasks={totalResult[1].sort((a,b) => {
        if (a.end > b.end) {
          return 1;
        }
        if (a.end < b.end) {
          return -1;
        }
        return 0;
      })} />
    ) : null}
    </> 
  ); 
}

export default App;
