import { DataTable } from "@/components/data-table";
import { db, employeeProjects, employeesRealistic, projects } from "../../db";
import { sql, eq } from "drizzle-orm";
import { ModeToggle } from "@/components/mode-toggle";

export default async function Home() {
  const result = await db
    .select({
      projectId: projects.projectId,
      projectSalaryCosts: sql<number>`
      SUM((${employeesRealistic.salary} / 1900) * ${employeeProjects.hoursWorked})
    `,
      budget: projects.budget,
      costFraction: sql<number>`
      ROUND(
        (SUM((${employeesRealistic.salary} / 1900) * ${employeeProjects.hoursWorked}) / ${projects.budget}) * 100,
        2
      )
    `,
    })
    .from(projects)
    .innerJoin(
      employeeProjects,
      eq(projects.projectId, employeeProjects.projectId)
    )
    .innerJoin(
      employeesRealistic,
      eq(employeeProjects.employeeId, employeesRealistic.employeeId)
    )
    .groupBy(projects.projectId);

  return (
    <div className="flex p-4 flex-col gap-2 items-center justify-center max-w-2xl mx-auto w-full min-h-screen">
      <div className="w-full flex flex-row-reverse">
        <ModeToggle />
      </div>
      <DataTable data={result} />
    </div>
  );
}
