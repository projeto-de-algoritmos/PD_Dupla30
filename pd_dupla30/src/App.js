import React, { useState, useEffect } from 'react'
import { Gantt } from 'gantt-task-react';
import { Button, Input } from 'antd';
import "gantt-task-react/dist/index.css";
import './App.css'

const initialTaskData = {
  name: 'nova tarefa',
  weight: 1,
  start: new Date(2022, 4, 8),
  end: new Date(2022, 4, 9)
}

const tasksInputMap = [
  { key: 'name', label: 'Nome da matéria' },
  { key: 'weight', label: 'Peso' },
  { key: 'start', label: 'inicio' },
  { key: 'end', label: 'fim' }
]

const initialTasksDAta = [
  {
    name: 'C 1 - 3',
    weight: 3,
    start: new Date(2022, 4, 8),
    end: new Date(2022, 4, 9)
  },
  {
    name: 'Física - 2',
    weight: 2,
    start: new Date(2022, 4, 9),
    end: new Date(2022, 4, 12)
  },
  {
    name: 'APC - 4',
    weight: 4,
    start: new Date(2022, 4, 9),
    end: new Date(2022, 4, 11)
  }
]

function App() {
  const [auxMap, setAuxMap] = useState({});
  const [newTaskData, setNewTaskData] = useState(initialTaskData);
  const [lastItems, setLastItems] = useState({});
  const [totalResult, setTotalResult] = useState([]);
  const [sortedTasks, setSortedTasks] = useState(initialTasksDAta);
  const [tasks, setTasks] = useState(initialTasksDAta);

  const solve = (index, items) => {
    if (index === -1) {
      return [0, items];
    }

    if (auxMap[index]) {
      return [auxMap[index], items];
    }
    let get = [0, [...items, tasks[index]]];
    for (const item in lastItems[index]) {
      const aux = solve(item, [...items, tasks[index]]);
      if (aux[0] > get[0]) get = aux;
    }
    const notGet = solve(index - 1, items);
    let res;
    if (tasks[index]?.weight + get[0] > notGet[0]) {
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
      if (tasks[i].end <= tasks[index].start) items.push(i);
    }
    return items;
  }

  useEffect(() => {
    tasks.forEach((item, index) => {
      setLastItems(prev => ({ ...prev, [index]: getLastItem(index) }));
    });
    setSortedTasks(tasks.sort((a, b) => {
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
    <div className='content'>
      <h1>Bem vindo ao otimizador de grade!</h1>
      <h2>Cadastre suas turmas com o peso que acredita que elas tem e clique em calcular que mostramos o resultado com o peso máximo.
      </h2>
    </div>
      <div className='top-content'>
        {tasksInputMap.map(task => (
          <div className='input-content'>
            <label>{task.label}:</label>
            <Input onChange={e => setNewTaskData(prev => ({ ...prev, [task.key]: e.target.value }))} />
          </div>
        ))}
        <Button type="primary" onClick={() => {
          const _newTaskData = { name: `${newTaskData.name} - ${newTaskData.weight}`, weight: Number(newTaskData.weight), start: new Date(2022, 4, newTaskData.start), end: new Date(2022, 4, newTaskData.end) }
          setTasks(prev => ([...prev, _newTaskData]));
        }}>Adicionar</Button>
      </div>

      <div className='content'>
        <Gantt tasks={sortedTasks} locale="br" />
        <Button type="primary" onClick={() => {
          setTotalResult(solve(tasks.length - 1, []));
          setAuxMap({});
        }}> Calcular</Button>

        <label>Resultado: {totalResult[0]}</label>
        {totalResult[1]?.length ? (
          <Gantt locale="br" tasks={totalResult[1].sort((a, b) => {
            if (a.end > b.end) {
              return 1;
            }
            if (a.end < b.end) {
              return -1;
            }
            return 0;
          })} />
        ) : null}
      </div>
    </>
  );
}

export default App;
