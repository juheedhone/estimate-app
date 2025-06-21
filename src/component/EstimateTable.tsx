import { useState } from "react";

export interface ITasks {
  id: number;
  name: string;
  estimate: number;
  seconds: number;
  isRunning?: boolean;
}

interface Props {
  tasks: ITasks[];
  onClicked: (id: number) => void;
  onReset: (id: number) => void;
  onDelete: (id: number) => void;
}

const EstimateTable = ({ tasks, onClicked, onReset, onDelete }: Props) => {
  // ✅ Local state to track completed tasks by their IDs
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  const toggleCompletion = (taskId: number) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Task Timer Table
      </h2>
      <table className="w-full text-left border-collapse rounded-xl overflow-hidden">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
          <tr>
            <th className="py-3 px-4 border-r border-gray-200">Task Name</th>
            <th className="py-3 px-4 border-r border-gray-200">Estimation</th>
            <th className="py-3 px-4 border-r border-gray-200">Timer</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => {
            const estHours = Math.floor(task.estimate / 3600);
            const estMinutes = Math.floor((task.estimate % 3600) / 60);

            const liveHours = Math.floor(task.seconds / 3600);
            const liveMinutes = Math.floor((task.seconds % 3600) / 60);
            const liveSeconds = task.seconds % 60;

            const formattedLiveTime = `${String(liveHours).padStart(
              2,
              "0"
            )}:${String(liveMinutes).padStart(2, "0")}:${String(
              liveSeconds
            ).padStart(2, "0")}`;

            const isCompleted = completedTasks.includes(task.id);

            return (
              <tr
                key={task.id}
                className={`border-b border-gray-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                <td className="py-3 px-4 border-r border-gray-200 relative group">
                  <div className="flex items-center gap-2 max-w-[200px] truncate">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => toggleCompletion(task.id)}
                      className="accent-green-500 cursor-pointer"
                    />
                    <span
                      className={`truncate ${
                        isCompleted ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {task.name}
                    </span>
                  </div>

                  <div className="absolute z-20 bottom-full right-0 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-normal max-w-sm break-words">
                    {task.name}
                  </div>
                </td>

                <td className="py-3 px-4 border-r border-gray-200">{`${estHours}h ${estMinutes}m`}</td>

                <td className="py-3 px-4 border-r border-gray-200 font-mono">
                  {formattedLiveTime}
                </td>
                <td className="py-3 px-4 border-gray-200 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        if (task.seconds < task.estimate) onClicked(task.id);
                      }}
                      disabled={task.seconds >= task.estimate || isCompleted}
                      className={`w-14 py-1 rounded border text-sm font-medium ${
                        task.seconds >= task.estimate || isCompleted
                          ? "text-gray-500 cursor-not-allowed bg-gray-100"
                          : task.isRunning
                          ? "text-yellow-500 border-yellow-400 hover:bg-amber-100"
                          : "text-green-500 hover:bg-green-200"
                      }`}
                    >
                      {task.seconds >= task.estimate
                        ? "Time Over"
                        : task.isRunning
                        ? "Pause"
                        : "Start"}
                    </button>

                    <button
                      onClick={() => onReset(task.id)}
                      disabled={isCompleted}
                      className={`w-14 py-1 border rounded text-black text-sm ${
                        isCompleted
                          ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                          : "hover:bg-gray-300"
                      }`}
                    >
                      Reset
                    </button>

                    <button
                      onClick={() => onDelete(task.id)}
                      className="w-14 py-1 border rounded text-red-500 hover:bg-red-200 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EstimateTable;
