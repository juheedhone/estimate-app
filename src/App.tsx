import { useEffect, useRef, useState } from "react";
import EstimateAdd from "./component/EstimateAdd";
import EstimateTable, { type ITasks } from "./component/estimateTable";

const App = () => {
  const [tasks, setTasks] = useState<ITasks[]>([
    {
      id: 1,
      task: "juhee",
      hour: 1,
      minutes: 0,
      isRunning: false,
    },
    {
      id: 2,
      task: "shrikant",
      hour: 10,
      minutes: 0,
      isRunning: false,
    },
  ]);

  const intervalRefs = useRef<{ [key: number]: NodeJS.Timeout }>({});
  const [runningTaskId, setRunningTaskId] = useState<number | null>(null);
  const toggleTimer = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isRunning: !task.isRunning } : task
      )
    );

    const currentTask = tasks.find((task) => task.id === id);

    if (currentTask?.isRunning) {
      // Stop timer
      clearInterval(intervalRefs.current[id]);
      delete intervalRefs.current[id];
    } else {
      // Start timer
      intervalRefs.current[id] = setInterval(() => {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === id ? { ...task, time: task.minutes + 1 } : task
          )
        );
      }, 1000);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
  }, []);

  return (
    <div className="p-4">
      <div className="mb-3">
        <EstimateAdd
          onSubmit={(task) =>
            setTasks([...tasks, { ...task, id: tasks.length + 1 }])
          }
        />
      </div>

      <h2 className="text-xl font-bold mb-4">Task Timer Table</h2>
      <EstimateTable
        tasks={tasks}
        onClicked={toggleTimer}
        runningTaskId={runningTaskId}
      />
    </div>
  );
};

export default App;
