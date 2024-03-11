import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState("");
  const [taskCount, setTaskCount] = useState({});

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const storedTaskCount = JSON.parse(localStorage.getItem("taskCount")) || {};
    setTasks(storedTasks);
    setTaskCount(storedTaskCount);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("taskCount", JSON.stringify(taskCount));
  }, [tasks, taskCount]);

  const handleNewTask = (event) => {
    setNewTask(event.target.value);
  };

  const addTask = () => {
    const [taskName, quantity] = newTask.split(" ");
    const count = quantity ? parseInt(quantity) : 1;
    const newTasks = Array(count)
      .fill(taskName)
      .map((task, index) => `${task} ${index + 1}`);
    setTasks([...tasks, ...newTasks]);
    setNewTask("");
    newTasks.forEach((task) => {
      setTaskCount((prevCount) => ({
        ...prevCount,
        [task]: (prevCount[task] || 0) + 1,
      }));
    });
  };

  const deleteTask = (taskToDelete) => {
    setTasks(tasks.filter((task) => task !== taskToDelete));
    setTaskCount((prevCount) => ({
      ...prevCount,
      [taskToDelete]: (prevCount[taskToDelete] || 0) - 1,
    }));
  };

  const startEditingTask = (taskToEdit) => {
    setEditingTask(taskToEdit);
    setEditedTaskName(taskToEdit.split(" ")[0]);
  };

  const renameTask = () => {
    const [oldTaskName] = editingTask.split(" ");
    const newTasks = tasks.map((task) => {
      if (task.startsWith(oldTaskName)) {
        const [, index] = task.split(" ");
        return `${editedTaskName} ${index}`;
      }
      return task;
    });
    setTasks(newTasks);
    setEditingTask(null);
    setEditedTaskName("");
    setTaskCount((prevCount) => ({
      ...prevCount,
      [editingTask]: (prevCount[editingTask] || 0) - 1,
      [`${editedTaskName} 1`]: (prevCount[`${editedTaskName} 1`] || 0) + 1,
    }));
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#333",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Day Goals!</h1>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <input
          type="text"
          placeholder="Write code 3"
          value={newTask}
          onChange={handleNewTask}
          style={{
            flex: 1,
            marginRight: "10px",
            padding: "8px",
            borderRadius: "4px",
            border: "none",
          }}
        />
        <button
          onClick={addTask}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Add Todo
        </button>
      </div>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
              backgroundColor: "#555",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            {editingTask === task ? (
              <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <input
                  type="text"
                  value={editedTaskName}
                  onChange={(e) => setEditedTaskName(e.target.value)}
                  style={{
                    flex: 1,
                    marginRight: "10px",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "none",
                  }}
                />
                <button
                  onClick={renameTask}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Rename
                </button>
              </div>
            ) : (
              <span style={{ flex: 1 }}>{task}</span>
            )}
            <span style={{ marginRight: "10px" }}>
              Count: {taskCount[task] || 0}
            </span>
            <FaTrashAlt
              onClick={() => deleteTask(task)}
              style={{
                color: "#f44336",
                cursor: "pointer",
                marginRight: "10px",
              }}
            />
            <FaEdit
              onClick={() => startEditingTask(task)}
              style={{ color: "#2196F3", cursor: "pointer" }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
