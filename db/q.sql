SELECT 
    p.project_id, 
    SUM((er.salary / 1900) * ep.hours_worked) AS project_salary_costs, 
    p.budget, 
    ROUND((SUM((er.salary / 1900) * ep.hours_worked) / p.budget) * 100, 2) AS cost_fraction
FROM projects p
INNER JOIN employee_projects ep ON p.project_id = ep.project_id
INNER JOIN employees_realistic er ON ep.employee_id = er.employee_id
GROUP BY p.project_id