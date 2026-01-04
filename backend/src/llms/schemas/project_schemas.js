import * as z from "zod"
import { PROJECT_STATUSES, PROJECT_TYPES } from "../../constants/project_constants.js";

export const addProjectSchema = z.object({
  title: z.string().optional().describe("The title of the project (max 50 characters)."),
  remarks: z.string().optional().describe("Remarks or notes about the project."),
  price: z.number().optional().describe("The total price/value of the project."),
  
  start: z.string().optional().describe("Planned start date of the order in YYYY-MM-DD format."),
  deadline: z.string().optional().describe("Deadline date of the project in YYYY-MM-DD format."),
  visualization: z.number().optional().describe("Cost or value associated with visualization."),

  user_reference: z.email().optional().describe("The email address of the user creating the project."),
  client_reference: z.email().optional().describe("The email address of the client associated with the project."),
  
  status_reference: z.enum(PROJECT_STATUSES).optional().describe("The status of the project. Must be one of the provided values."),
  type_reference: z.enum(PROJECT_TYPES).optional().describe("The type/category of the project. Must be one of the provided values."),
});