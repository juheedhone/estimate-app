import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

interface Props {
  onSubmit: (data: EstimateAdd) => void;
}

const schema = z.object({
  task: z.string().min(3, "Task must be at least 3 characters").max(50),
  hour: z
    .number({ invalid_type_error: "Hour must be a number" })
    .min(0)
    .optional()
    .or(z.nan()),
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
    defaultValues: { task: "" },
  });

  const watchedHour = useWatch({ control, name: "hour" });
  const watchedMinutes = useWatch({ control, name: "minutes" });

  const onSubmitHandler = (data: EstimateAdd) => {
    onSubmit({
      ...data,
      hour: isNaN(data.hour as number) ? 0 : (data.hour as number),
    });
    reset();
  };

  const formatTime = (h?: number, m?: number) =>
    `${String(h || 0).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}`;

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="bg-white p-4 rounded-lg shadow space-y-4"
    >
      <div>
        <label className="block font-semibold mb-1">Add Task</label>
        <input
          {...register("task")}
          className={`w-full border rounded px-3 py-2 ${
            errors.task ? "border-red-500" : "border-gray-300"
          }`}
          type="text"
          placeholder="Task Name"
        />
        {errors.task && (
          <p className="text-red-500 text-sm mt-1">{errors.task.message}</p>
        )}
      </div>

      <div>
        <label className="block font-semibold mb-1">Estimation Time</label>
        <div className="flex gap-2">
          <div className="w-1/2">
            <input
              {...register("hour", { valueAsNumber: true })}
              type="number"
              min="0"
              placeholder="Hours"
              className={`w-full border rounded px-3 py-2 ${
                errors.hour ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.hour && (
              <p className="text-red-500 text-sm mt-1">{errors.hour.message}</p>
            )}
          </div>

          <div className="w-1/2">
            <input
              {...register("minutes", { valueAsNumber: true })}
              type="number"
              min="0"
              max="59"
              placeholder="Minutes"
              className={`w-full border rounded px-3 py-2 ${
                errors.minutes ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.minutes && (
              <p className="text-red-500 text-sm mt-1">
                {errors.minutes.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Submit
      </button>

      <div className="mt-2 text-gray-600 text-sm">
        <strong>Preview Time:</strong> {formatTime(watchedHour, watchedMinutes)}
      </div>
    </form>
  );
};

export default EstimateAdd;
