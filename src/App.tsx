import { useEffect, useRef, useState } from "react";
import EstimateAdd from "./component/EstimateAdd";
import type { ITasks } from "./component/EstimateTable";
import EstimateTable from "./component/EstimateTable";

const App = () => {
  const [tasks, setTasks] = useState<ITasks[]>([]);
  const intervalRefs = useRef<{ [key: number]: number }>({});

  const toggleTimer = (id: number) => {
    const task = tasks.find((t) => t.id === id);

    if (task?.isRunning) {
      clearInterval(intervalRefs.current[id]);
      delete intervalRefs.current[id];
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isRunning: false } : t))
      );
    } else {
      // Reset seconds to zero and start timer
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isRunning: true } : t))
      );

      intervalRefs.current[id] = setInterval(() => {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, seconds: t.seconds + 1 } : t))
        );
      }, 1000);
    }
  };

  const resetTimer = (id: number) => {
    clearInterval(intervalRefs.current[id]);
    delete intervalRefs.current[id];
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, seconds: 0, isRunning: false } : t
      )
    );
  };

  const handleAddTask = (data: {
    task: string;
    hour?: number;
    minutes: number;
  }) => {
    const newTask: ITasks = {
      id: tasks.length + 1,
      task: data.task,
      estimationSeconds: (data.hour || 0) * 3600 + data.minutes * 60,

      seconds: 0, // live timer starts from 0 on click
      isRunning: false,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  useEffect(() => {
    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
  }, []);

  return (
    <div className="p-4">
      <EstimateAdd onSubmit={handleAddTask} />
      <h2 className="text-xl font-bold mb-4">Task Timer Table</h2>
      <EstimateTable
        tasks={tasks}
        onClicked={toggleTimer}
        onReset={resetTimer}
      />
    </div>
  );
};

export default App;
