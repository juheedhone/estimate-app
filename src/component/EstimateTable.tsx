export interface ITasks {
  id: number;
  task: string;
  hour: number;
  minutes: number; // in seconds
  isRunning?: boolean;
}

interface Props {
  tasks: ITasks[];
  onClicked: (id: number) => void;
  runningTaskId: number | null;
}

const EstimateTable = ({ tasks, onClicked, runningTaskId }: Props) => {
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <td>Task Name</td>
          <td>Time Estimate</td>
          <td>Timer</td>
          <td>Action</td>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => {
          const isRunning = runningTaskId === task.id;
          const minutes = Math.floor(task.minutes / 60);
          const seconds = task.minutes % 60;
          const formatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
          return (
            <tr key={task.id}>
              <td>{task.task}</td>
              <td>
                {Math.floor(task.hour / 60)}Hour
                {task.minutes % 60}Min
              </td>
              <td>{formatted}</td>
              <td>
                <button
                  className={`btn ${isRunning ? "btn-success" : "btn-danger"}`}
                  onClick={() => onClicked(task.id)}
                >
                  {task.isRunning ? "Stop" : "Start"}
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
