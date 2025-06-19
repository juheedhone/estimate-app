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
}

const EstimateTable = ({ tasks, onClicked, onReset }: Props) => {
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
                  <button
                    onClick={() => onClicked(task.id)}
                    className={`px-3 py-1 rounded text-white ${
                      task.isRunning
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {task.isRunning ? "Stop" : "Start"}
                  </button>
                 
                  <button
                    onClick={() => onReset(task.id)}
                    className="px-3 py-1  rounded bg-gray-400 text-white hover:bg-gray-500"
                  >
                    Reset
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
