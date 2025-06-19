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
  return (
    <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
      <h2 className="text-xl font-semibold mb-3">Task Timer Table</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-3">Task Name</th>
            <th className="py-2 px-3">Estimation</th>
            <th className="py-2 px-3">Timer</th>
            <th className="py-2 px-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
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

            return (
              <tr key={task.id} className="border-b last:border-0">
                <td className="py-2 px-3">{task.name}</td>
                <td className="py-2 px-3">{`${estHours}h ${estMinutes}m`}</td>
                <td className="py-2 px-3 font-mono">{formattedLiveTime}</td>
                <td className="py-2 px-3 space-x-2">
                  <span className="px-1">
                    <button
                      onClick={() => onClicked(task.id)}
                      className={`px-3 py-1  rounded  ${
                        task.isRunning
                          ? "border text-red-500 border-red-400 hover:bg-red-200"
                          : "border text-green-500  hover:bg-green-200"
                      }`}
                    >
                      {task.isRunning ? "Stop" : "Start"}
                    </button>
                  </span>

                  <span className="px-1">
                    <button
                      onClick={() => onReset(task.id)}
                      className="px-3 py-1 border rounded  text-black hover:bg-gray-300"
                    >
                      Reset
                    </button>
                  </span>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="px-3 py-1 border rounded text-red-500 hover:bg-red-200"
                  >
                    Delete
                  </button>
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
