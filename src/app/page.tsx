import { DataTable } from "@/components/data-table";
import { db, employeeProjects, employeesRealistic, projects } from "../../db";
import { sql, eq } from "drizzle-orm";

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

  console.log(result);

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <DataTable data={result} />
    </div>
  );
}
