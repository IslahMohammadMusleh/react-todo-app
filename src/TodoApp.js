import firebase from './firebase';
import Snackbar from '@material-ui/core/Snackbar';
import React, { useState, useEffect } from 'react';
import './ReactTodoApp.css';
const database = firebase.database();



function TodoApp() {
  const [todoItems, setTodoItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // useEffect(() => {
  //   database.ref('Todo').on('value', (snapshot) => {
  //     setTodoItems(snapshot.val() || []);
  //   });
  // }, []);


  useEffect(() => {
    const todoRef = firebase.database().ref('Todo');
    todoRef.on('value', (snapshot) => {
      const todos = snapshot.val();
      const todoList = []
      for (let id in todos) {
        todoList.push({ id, ...todos[id] });
      }
      setTodoItems(todoList);
    })
  }, [])


  // Function to add a new item
  const addItem = e => {
    e.preventDefault();
    setSnackbarOpen(true);
    if (newItem.trim() === '') {
      return setSnackbarMessage('Please enter a new item');
    }

    const todoRef = firebase.database().ref('Todo');
    const todo = {
      text: newItem, done: false
    };
    todoRef.push(todo);
    setNewItem('');
    setSnackbarMessage('Item added successfully');
  };

  const handleMark = (item) => {
    const todoRef = firebase.database().ref('Todo').child(item.id);
    todoRef.update({
        done: !item.done
    })
    setSnackbarOpen(true);
    setSnackbarMessage(`Task marked as ${!item.done ? 'done' : 'undone'} successfully`);
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const editItem = index => {
    setSnackbarOpen(true);
    if (editing) {
      return setSnackbarMessage('Please finish editing the current item');
    }
    if (todoItems[index].done) {
      return setSnackbarMessage('You cannot edit a done item');
    }
    setNewItem(todoItems[index].text);
    setEditing(true);
    setCurrentItem(index);
  };

  const updateItem = e => {
    setSnackbarOpen(true);
    e.preventDefault();

    const todoRef = firebase.database().ref('Todo').child(todoItems[currentItem].id);
    todoRef.update({
        text: newItem
    })
    setNewItem('');
    setEditing(false);
    setCurrentItem(null);
    setSnackbarMessage('Item edited successfully');
  };

  const deleteItem = item => {
    setSnackbarOpen(true);
    if (editing) {
      return setSnackbarMessage('Please finish editing the current item');
    }
    if (!item.done) {
      return setSnackbarMessage('You cannot delete not done item');
    }
    const todoRef = firebase.database().ref('Todo').child(item.id);
    todoRef.remove()
    setSnackbarMessage(`${item.text} Item deleted successfully`);
  };

  return (
    <div>
      <div className='TodoApp'>
        <form onSubmit={editing ? updateItem : addItem}>
          <input
            type="text"
            placeholder="New item"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
          />
          <button>{editing ? 'Update' : "Add"}</button>
        </form>
        <ul>
          {todoItems.map((item, index) => (
            <li key={index} className={item.done ? 'done' : null}>
              {item.text}{' '}
              <button onClick={() => handleMark(item)}>
                {item.done ? "Mark as Not Done" : "Mark as Done"}
              </button>
              <button onClick={() => editItem(index)}>Edit</button>
              <button onClick={() => deleteItem(item)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
        autoHideDuration={1000}
      />
    </div>

  );
}

export default TodoApp;