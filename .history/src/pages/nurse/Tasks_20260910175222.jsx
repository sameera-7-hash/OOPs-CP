import React, { useState } from "react";
import { NurseLayout } from "./NurseDashboard";

function Tasks({ navigate, logout }) {

  const [tasks, setTasks] = useState([
    ["Check Vitals - Room 204", true],
    ["Medicine Rounds", true],
    ["Update Care Notes", false],
    ["Assist in Consultation", false],
    ["Discharge Summary", false]
  ]);

  const toggle = (index) => {

    const updated = [...tasks];

    updated[index][1] = !updated[index][1];

    setTasks(updated);
  };

  const completed = tasks.filter((task) => task[1]).length;

  return (
    <NurseLayout
      active="tasks"
      navigate={navigate}
      logout={logout}
    >

      <div className="page-heading">

        <h1>Today's Tasks</h1>

        <p>
          Track daily nursing activities.
        </p>

      </div>

      <div className="panel">

        <h3>
          {completed} of {tasks.length} tasks completed
        </h3>

        <div className="task-progress">

          <div
            style={{
              width: `${(completed / tasks.length) * 100}%`
            }}
          ></div>

        </div>

        {tasks.map((task, index) => (

          <label
            className="task-large"
            key={index}
          >

            <input
              type="checkbox"
              checked={task[1]}
              onChange={() => toggle(index)}
            />

            <span>{task[0]}</span>

          </label>

        ))}

      </div>

    </NurseLayout>
  );
}

export default Tasks;