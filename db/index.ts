import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle("file:db/company_database.db");

import {
  sqliteTable,
  integer,
  text,
  real,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const customers = sqliteTable("customers", {
  customerId: integer("customer_id").primaryKey({ autoIncrement: true }),
  customerName: text("customer_name").notNull(),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
});

export const departments = sqliteTable("departments", {
  departmentId: integer("department_id").primaryKey({ autoIncrement: true }),
  departmentName: text("department_name").notNull(),
  managerId: integer("manager_id"),
});

export const employeesRealistic = sqliteTable("employees_realistic", {
  employeeId: integer("employee_id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  departmentId: integer("department_id").references(
    () => departments.departmentId
  ),
  hireDate: text("hire_date").notNull(),
  salary: real("salary").notNull(),
  position: text("position").notNull(),
});

export const projects = sqliteTable("projects", {
  projectId: integer("project_id").primaryKey({ autoIncrement: true }),
  projectName: text("project_name").notNull(),
  departmentId: integer("department_id").references(
    () => departments.departmentId
  ),
  budget: real("budget").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
});

export const employeeProjects = sqliteTable(
  "employee_projects",
  {
    employeeId: integer("employee_id")
      .references(() => employeesRealistic.employeeId)
      .primaryKey(),
    projectId: integer("project_id")
      .references(() => projects.projectId)
      .primaryKey(),
    hoursWorked: real("hours_worked").notNull(),
  },
  (table) => [primaryKey({ columns: [table.employeeId, table.projectId] })]
);

export const orders = sqliteTable("orders", {
  orderId: integer("order_id").primaryKey({ autoIncrement: true }),
  customerId: integer("customer_id").references(() => customers.customerId),
  orderDate: text("order_date").notNull(),
  amount: real("amount").notNull(),
});

export const orderItems = sqliteTable("order_items", {
  orderItemId: integer("order_item_id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").references(() => orders.orderId),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
});
