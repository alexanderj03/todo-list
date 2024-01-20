import React from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HistoryIcon from '@mui/icons-material/History';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import { IconButton } from '@mui/material';
import { db } from './firebase'
import { query, collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom/dist';
import { BeatLoader } from 'react-spinners';

const checkTask = (item) => {
  const editTask = item
  editTask.Completed = true
  try {
    const todoRef = doc(collection(db, 'TODO'), editTask.Id)
    updateDoc(todoRef, editTask)
  } catch (error) {
    console.error(error)
  }
}

const urgentTask = (item, e) => {
  const editTask = item
  editTask.Urgent = e
  try {
    const todoRef = doc(collection(db, 'TODO'), editTask.Id)
    updateDoc(todoRef, editTask)
  } catch (error) {
    console.error(error)
  }
}

const deleteTask = async (item) => {
  await deleteDoc(doc(db, 'TODO', item.Id))
}

function Todo(props) {
  const navigate = useNavigate()
  const ttype = props.todoType
  const [task, setTask] = React.useState('')
  const [todo, setTodo] = React.useState([])
  const [load, setLoad] = React.useState(false)

  React.useEffect(() => {
    setLoad(false)
    const q = query(collection(db, 'TODO'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let arr = []
      querySnapshot.forEach((doc) => {
        arr.push({...doc.data()})
        if (ttype === 'all') {
          arr = arr.filter(x => x.Completed === false)
        } else if (ttype === 'finish') {
          arr = arr.filter(x => x.Completed === true)
        } else if (ttype === 'urgent') {
          arr = arr.filter(x => x.Urgent === true && x.Completed === false)
        }
        setTodo(arr)
      })
      setLoad(true)
    })
    return () => unsubscribe()
  }, [ttype])

  const submit = (key) => {
    if (key === 'Enter') {
      createTask()
    }
  }

  const createTask = async () => {
    if (task === '') {
      alert('Please Enter a Valid Todo')
      return
    }

    const newTask = {
      Task: task,
      Urgent: false, 
      Completed: false,
      Id: uuidv4()
    }

    if (ttype === 'urgent') {
      newTask.Urgent = true
    } 
    
    try {
      const taskRef = doc(collection(db, 'TODO'), newTask.Id)
      await setDoc(taskRef, newTask)
      setTask('')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='todo-page'>
      <div className='column'>
        <div className='todo-click' onClick={() => navigate('/')} style={ttype === 'all' ? {backgroundColor:'black', color:'white', borderRadius:'20px'}:{}}>
          <div className='todo-icon'>
            <AccessTimeIcon fontSize='large'/>
          </div>
          All Tasks
        </div>
        <div className='todo-click' onClick={() => navigate('/urgent')} style={ttype === 'urgent' ? {backgroundColor:'black', color:'white', borderRadius:'20px'}:{}}>
          <div className='todo-icon'>
            <PriorityHighIcon fontSize='large'/>
          </div>
          Urgent Tasks
        </div>
        <div className='todo-click' onClick={() => navigate('/finished')} style={ttype === 'finish' ? {backgroundColor:'black', color:'white', borderRadius:'20px'}:{}}>
          <div className='todo-icon'>
          <HistoryIcon fontSize='large'/>
          </div>
          Finished Tasks
        </div>
      </div>
      {
        load === false ?
        <div className='loading-container'>
          <BeatLoader color="#36d7b7" size={30}/>
        </div>
        :
        <div className='todo-section'>
          <div className='search-container'>
            <input type="text" placeholder="Enter your task" 
            value={task} onChange={e => setTask(e.target.value)}
            onKeyDown={(e) => submit(e.key)}></input>
            <IconButton onClick={() => createTask()}>
              <AddCircleOutlineIcon fontSize='large' className='add-icon'/>
            </IconButton>
          </div>
          <div className='todo-container'>
            {
              todo.map(item => {
                return (
                  <div className='task-container' key={item.Id} style={item.Urgent ? {border:'1px red solid'}:{}}>
                    <div className='task'>
                      {item.Task}
                    </div>
                    <div className='task-icon'>
                      {
                        ttype === 'all' && 
                        <>
                          <IconButton id={item.Id} onClick={() => checkTask(item)}>
                            <CheckIcon className='add-icon'/>
                          </IconButton >
                          {
                            item.Urgent === true ?
                            <IconButton id={item.Id} onClick={() => urgentTask(item, false)}>
                              <LowPriorityIcon className='add-icon'/>
                            </IconButton>
                            :
                            <IconButton id={item.Id} onClick={() => urgentTask(item, true)}>
                              <PriorityHighIcon className='add-icon'/>
                            </IconButton>
                          }
                        </>
                      }
                      {
                        ttype === 'urgent' && 
                        <>
                          <IconButton id={item.Id} onClick={() => checkTask(item)}>
                            <CheckIcon className='add-icon'/>
                          </IconButton >
                          <IconButton id={item.Id} onClick={() => urgentTask(item, false)}>
                            <LowPriorityIcon className='add-icon'/>
                          </IconButton >
                        </>
                      }
                      <IconButton id={item.Id} onClick={() => deleteTask(item)}>
                        <DeleteIcon className='add-icon'/>
                      </IconButton>
                    </div>
                  </div> 
                )
              })
            }
          </div>
        </div>
      }
    </div>
  )
}

export default Todo