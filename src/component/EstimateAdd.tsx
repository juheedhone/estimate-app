import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

interface Props {
  onSubmit: (data: EstimateAdd) => void;
}

const schema = z.object({
  task: z.string().min(3, "Task must be at least 3 characters").max(50),
  hour: z.number({ invalid_type_error: "Hour is required" }).min(0),
  minutes: z
    .number({ invalid_type_error: "Minutes is required" })
    .min(0)
    .max(59),
});

type EstimateAdd = z.infer<typeof schema>;

const EstimateAdd = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<EstimateAdd>({
    resolver: zodResolver(schema),
    defaultValues: { task: "", hour: 0, minutes: 0 },
  });

  const watchedHour = useWatch({ control, name: "hour" });
  const watchedMinutes = useWatch({ control, name: "minutes" });

  const formatTime = (h: number, m: number) =>
    `${String(h || 0).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}`;

  const onSubmitHandler = (data: EstimateAdd) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="mb-4">
      <div className="mb-3">
        <label className="form-label">Add Task</label>
        <input
          {...register("task")}
          className={`form-control ${errors.task ? "is-invalid" : ""}`}
          type="text"
          placeholder="Task Name"
        />
        {errors.task && (
          <div className="invalid-feedback">{errors.task.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Estimation Time</label>
        <div className="d-flex gap-2">
          <input
            {...register("hour", { valueAsNumber: true })}
            type="number"
            min="0"
            className={`form-control ${errors.hour ? "is-invalid" : ""}`}
            placeholder="Hours"
          />
          <input
            {...register("minutes", { valueAsNumber: true })}
            type="number"
            min="0"
            max="59"
            className={`form-control ${errors.minutes ? "is-invalid" : ""}`}
            placeholder="Minutes"
          />
        </div>
        {errors.hour && <p className="text-danger">{errors.hour.message}</p>}
        {errors.minutes && (
          <p className="text-danger">{errors.minutes.message}</p>
        )}
      </div>

      <button className="btn btn-primary" type="submit">
        Submit
      </button>

      <div className="mt-3">
        <strong>Preview Time:</strong> {formatTime(watchedHour, watchedMinutes)}
      </div>
    </form>
  );
};

export default EstimateAdd;
