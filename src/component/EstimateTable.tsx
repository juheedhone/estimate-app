export interface ITasks {
  id: number;
  task: string;
  estimationSeconds: number; // for showing estimation separately
  seconds: number; // live timer starting from 0
  isRunning?: boolean;
}

interface Props {
  tasks: ITasks[];
  onClicked: (id: number) => void;
  onReset: (id: number) => void;
}

const EstimateTable = ({ tasks, onClicked, onReset }: Props) => {
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Task Name</th>
          <th>Estimation</th>
          <th>Timer</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => {
          const estHours = Math.floor(task.estimationSeconds / 3600);
          const estMinutes = Math.floor((task.estimationSeconds % 3600) / 60);

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
            <tr key={task.id}>
              <td>{task.task}</td>
              <td>{`${estHours}h ${estMinutes}m`}</td>
              <td>{formattedLiveTime}</td>
              <td>
                <button
                  className={`btn ${
                    task.isRunning ? "btn-danger" : "btn-success"
                  } me-2`}
                  onClick={() => onClicked(task.id)}
                >
                  {task.isRunning ? "Stop" : "Start"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => onReset(task.id)}
                >
                  Reset
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default EstimateTable;
