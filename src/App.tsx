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
  const [loading, setLoading] = useState<boolean>(false);

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
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isRunning: true } : t))
      );

      intervalRefs.current[id] = window.setInterval(() => {
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id !== id || !t.isRunning) return t;

            const updatedSeconds = t.seconds + 1;

            // ✅ Stop the timer automatically when estimation is reached
            if (updatedSeconds >= t.estimate) {
              clearInterval(intervalRefs.current[id]);
              delete intervalRefs.current[id];
              return { ...t, seconds: updatedSeconds, isRunning: false };
            }

            return { ...t, seconds: updatedSeconds };
          })
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
      seconds: 0,
      isRunning: false,
    };

    setTasks([...tasks, newTask]);

    axios
      .post("https://estimate-tracker.shrikant.workers.dev/task/create", {
        ...newTask,
        actorId: "system",
      })
      .then((res) => setTasks([res.data.data, ...tasks]))
      .catch((err) => console.log(err));
  };
  const onDelete = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
    axios.delete(
      "https://estimate-tracker.shrikant.workers.dev/task/delete/" + id
    );
  };

  useEffect(() => {
    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get<{ data: IFetchTask[] }>(
        "https://estimate-tracker.shrikant.workers.dev/task/fetchAll"
      )
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
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Task Time Estimation Tracker
      </h1>
      <div className="max-w-3xl mx-auto space-y-6">
        <EstimateAdd onSubmit={handleAddTask} />
        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-800"></div>
          </div>
        )}
        <EstimateTable
          onDelete={onDelete}
          tasks={tasks}
          onClicked={toggleTimer}
          onReset={resetTimer}
        />
      </div>
    </div>
  );
};

export default App;
