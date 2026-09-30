import React, { useState } from "react";

function Tasks() {

  const [tasks, setTasks] = useState([
    { name: "Check Vitals - Room 204", done: true },
    { name: "Medicine Rounds", done: true },
    { name: "Update Care Notes", done: false },
    { name: "Assist in Consultation", done: false },
    { name: "Discharge Summary", done: false }
  ]);

  const toggle = (index) => {

    const updated = [...tasks];

    updated[index].done = !updated[index].done;

    setTasks(updated);
  };

  const completed = tasks.filter(t => t.done).length;

  return (
    <div className="section-page">

      <div className="section-header">

        <div>
          <span className="eyebrow">NURSING ACTIVITIES</span>
          <h1>Today's Tasks</h1>
          <p>Track daily nursing activities.</p>
        </div>

      </div>


      <section className="card">

        <h2>
          {completed} of {tasks.length} tasks completed
        </h2>


        <div className="task-page-list">

          {tasks.map((task, index) => (

            <label key={index}>

              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggle(index)}
              />

              <span className={task.done ? "task-done" : ""}>
                {task.name}
              </span>

            </label>

          ))}

        </div>

      </section>

    </div>
  );
}

export default Tasks;