import { useState, type FormEvent } from "react";

const EstimateAdd = () => {
  const [estimations, setEstimations] = useState({
    task: "",
    hours: 0,
    minutes: 0,
  });

  const formatTime = (hours: number, minutes: number) => {
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}`;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const displayTime = formatTime(estimations.hours, estimations.minutes);

    console.log({
      task: estimations.task,
      displayTime, // like "02:05"
      totalMinutes: estimations.hours * 60 + estimations.minutes,
      // totalSeconds: (estimations.hours * 60 + estimations.minutes) * 60,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="task" className="form-label">
          Add Task
        </label>
        <input
          onChange={(event) =>
            setEstimations({ ...estimations, task: event.target.value })
          }
          id="task"
          type="text"
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Add Estimation Time</label>
        <div className="d-flex gap-2">
          <input
            type="number"
            className="form-control"
            onChange={(e) =>
              setEstimations({
                ...estimations,
                hours: parseInt(e.target.value) || 0,
              })
            }
            min="0"
          />
          <input
            type="number"
            className="form-control"
            onChange={(e) =>
              setEstimations({
                ...estimations,
                minutes: parseInt(e.target.value) || 0,
              })
            }
            min="0"
            max="59"
          />
        </div>
      </div>

      <button className="btn btn-primary">Submit</button>

      {/* Display real-time preview */}
      <div className="mt-3">
        <strong>Preview Time:</strong>{" "}
        {formatTime(estimations.hours, estimations.minutes)}
      </div>
    </form>
  );
};

export default EstimateAdd;
