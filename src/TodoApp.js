import Snackbar from '@material-ui/core/Snackbar';
import React, { useState } from 'react';
import './TodoApp.css';


function TodoApp() {
  const [todoItems, setTodoItems] = useState([{ text: 'Learn React', done: false }]);
  const [newItem, setNewItem] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Function to add a new item
  const addItem = e => {
    e.preventDefault();
    if (newItem.trim() === '') return alert('Please enter a new item');
    setTodoItems([...todoItems, { text: newItem, done: false }]);
    setNewItem('');
  };

  // const markDone = index => {
  //   const updatedItems = [...todoItems];
  //   updatedItems[index].done = true;
  //   setTodoItems(updatedItems);
  // };

  const handleMarkAsDone = (index) => {
    const newTodoItems = [...todoItems];

    setSnackbarMessage(`Working on it, the task will be marked as ${newTodoItems[index].done? 'undone': 'done'} in 3 seconds...`);

    setSnackbarOpen(true);
    let seconds = 3;
    const timer = setInterval(() => {
      seconds--;
      if (seconds === 0) {
        clearInterval(timer);
        newTodoItems[index].done = !newTodoItems[index].done;
        setTodoItems(newTodoItems);
        setSnackbarMessage("Task Marked as Done!");
      }
    }, 1000);
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const editItem = index => {
    if (editing) return alert('Please finish editing the current item');
    if (todoItems[index].done) return alert('You cannot edit a done item');
    setNewItem(todoItems[index].text);
    setEditing(true);
    setCurrentItem(index);
  };

  const updateItem = e => {
    e.preventDefault();
    const updatedItems = [...todoItems];
    updatedItems[currentItem].text = newItem;
    setTodoItems(updatedItems);
    setNewItem('');
    setEditing(false);
    setCurrentItem(null);
  };

  const deleteItem = index => {
    if (editing) return alert('Please finish editing the current item');
    if (!todoItems[index].done) return alert('You cannot delete not done item')

    const updatedItems = [...todoItems];
    updatedItems.splice(index, 1);
    setTodoItems(updatedItems);
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
              <button onClick={() => handleMarkAsDone(index)}>
                {item.done ? "Mark as Not Done" : "Mark as Done"}
              </button>
              <button onClick={() => editItem(index)}>Edit</button>
              <button onClick={() => deleteItem(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
        autoHideDuration={3000}
      />
    </div>

  );
}

export default TodoApp;