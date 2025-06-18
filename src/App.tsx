import axios from "axios";
import { useEffect, useRef, useState } from "react";
import EstimateAdd from "./component/EstimateAdd";
import type { ITasks } from "./component/EstimateTable";
import EstimateTable from "./component/EstimateTable";

interface IFetchTask {
  id: number;
  name: string;
  estimate: number;
  status: string;
  startTime: null;
  endTime: null;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

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
      name: data.task,
      estimate: (data.hour || 0) * 3600 + data.minutes * 60,

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

  useEffect(() => {
    axios
      .get<{ data: IFetchTask[] }>(
        "https://estimate-tracker.shrikant.workers.dev/task/fetchAll"
      )
      // id: number;
      // name: string;
      // estimate: number; // for showing estimation separately
      // seconds: number; /
      .then((res) => {
        setTasks(
          res.data.data.map((d) => ({
            id: d.id,
            name: d.name,
            estimate: d.estimate,
            seconds: 0,
          }))
        );
      })
      .catch((err) => console.log(err));
  }, []);

  // const addTasks = () => {
  //   const newTask = { name: "test", estimate: 3, actorId: "juhee",seconds:0 };
  //   setTasks([newTask, ...tasks]);

  //   axios
  //     .post(
  //       "https://estimate-tracker.shrikant.workers.dev/task/create",
  //       newTask
  //     )
  //     .then((res) => console.log(res));
  // };

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
