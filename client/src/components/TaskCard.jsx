function TaskCard({
    task,
}) {

    const today = new Date();

    const deadline =
        new Date(task.deadline);



    const isOverdue =
        deadline < today &&
        task.status !== "Completed";



    return (
        <div
            className={`p-5 rounded-xl shadow-sm border-l-8 bg-white
            ${task.priority === "High"
                ? "border-red-500"
                : task.priority === "Medium"
                    ? "border-yellow-500"
                    : "border-green-500"
            }
            `}
        >

            <div className="flex justify-between items-start">

                <h2 className="text-xl font-bold">

                    {task.title}

                </h2>



                <span
                    className={`px-3 py-1 rounded-full text-sm
                    ${task.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                    }
                    `}
                >

                    {task.priority}

                </span>

            </div>



            <p className="text-gray-600 mt-4">

                {task.description}

            </p>



            <div className="mt-5 space-y-2">

                <p>

                    Status:
                    {" "}
                    <strong>{task.status}</strong>

                </p>



                <p>

                    Deadline:
                    {" "}
                    {new Date(
                        task.deadline
                    ).toLocaleDateString()}

                </p>



                {
                    isOverdue && (

                        <p className="text-red-600 font-bold">

                            Overdue Task

                        </p>

                    )
                }

            </div>

        </div>
    );
}

export default TaskCard;