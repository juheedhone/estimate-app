import { useState, type FormEvent } from "react";

const EstimateAdd = () => {
  const [estimations, setEstimations] = useState({
    task: "",
    time: 0,
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    console.log(estimations);
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
        <label htmlFor="time" className="form-label">
          Add Estimation Time
        </label>
        <input
          onChange={(event) =>
            setEstimations({
              ...estimations,
              time: parseInt(event.target.value),
            })
          }
          id="time"
          type="number"
          className="form-control"
        />
      </div>
      <button className="btn btn-primary mb-3">Submit</button>
    </form>
  );
};

export default EstimateAdd;
