import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

interface Props {
  onSubmit: (data: EstimateAdd) => void;
}

const schema = z.object({
  task: z.string().min(3).max(50),
  hour: z.number({ invalid_type_error: "hour is required" }),
  minutes: z.number({ invalid_type_error: "minutes is required" }),
});

type EstimateAdd = z.infer<typeof schema>;

const EstimateAdd = ({onSubmit}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EstimateAdd>({
    resolver: zodResolver(schema),
  });

  const formatTime = (hours: number, minutes: number) => {
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label htmlFor="task" className="form-label">
          Add Task
        </label>
        <input
          {...register("task")}
          id="task"
          type="text"
          className="form-control"
        />
        {errors.task && <p className="text-danger">{errors.task.message}</p>}
      </div>

      <div className="mb-3">
        <label className="form-label">Add Estimation Time</label>
        <div className="d-flex gap-2">
          <input
            {...register("hour", { valueAsNumber: true })}
            type="number"
            className="form-control"
            min="0"
          />
          {errors.hour && <p className="text-danger">{errors.hour.message}</p>}
          <input
            {...register("minutes", { valueAsNumber: true })}
            type="number"
            className="form-control"
            min="0"
            max="59"
          />
          {errors.minutes && (
            <p className="text-danger">{errors.minutes.message}</p>
          )}
        </div>
      </div>

      <button className="btn btn-primary">Submit</button>

      {/* Display real-time preview */}
      <div className="mt-3">
        {/* <strong>Preview Time:</strong> {formatTime(hours, minutes)} */}
      </div>
    </form>
  );
};

export default EstimateAdd;
