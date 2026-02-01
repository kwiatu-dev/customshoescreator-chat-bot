import * as z from "zod"
import { PROJECT_STATUSES, PROJECT_TYPES, PROJECT_SORTABLE_FIELDS } from "../../constants/project_constants.js";

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

export const listProjectsSchema = z.object({
  search: z.string().optional().describe("General search string for finding projects by keywords."),

  start_start: z.string().optional().describe("Filter projects starting ON or AFTER this date. Format: YYYY-MM-DD."),
  start_end: z.string().optional().describe("Filter projects starting ON or BEFORE this date. Format: YYYY-MM-DD."),
  
  deadline_start: z.string().optional().describe("Filter projects with deadline ON or AFTER this date. Format: YYYY-MM-DD."),
  deadline_end: z.string().optional().describe("Filter projects with deadline ON or BEFORE this date. Format: YYYY-MM-DD."),
  
  end_start: z.string().optional().describe("Filter projects ended ON or AFTER this date. Format: YYYY-MM-DD."),
  end_end: z.string().optional().describe("Filter projects ended ON or BEFORE this date. Format: YYYY-MM-DD."),

  price_start: z.number().optional().describe("Lower limit of the project price range (Price From). Filter projects with price >= this value."),
  price_end: z.number().optional().describe("Upper limit of the project price range (Price To). Filter projects with price <= this value."),
  
  visualization_start: z.number().optional().describe("Lower limit of the visualization cost range (Visualization Cost From). Filter projects with visualization >= this value."),
  visualization_end: z.number().optional().describe("Upper limit of the visualization cost range (Visualization Cost To). Filter projects with visualization <= this value."),

  status_reference: z.enum(PROJECT_STATUSES).optional().describe("Filter projects strictly by this specific status."),
  type_reference: z.enum(PROJECT_TYPES).optional().describe("Filter projects strictly by this specific category/type."),
  user_reference: z.email().optional().describe("Filter projects to show only those created by the user with this email address."),

  deleted: z.boolean().optional().describe("If true, includes deleted projects. If false or omitted, usually shows active projects."),
  created_by_user: z.boolean().optional().describe("If true, filters to show only projects created by the current user."),
  after_deadline: z.boolean().optional().describe("If true, filters to show only projects that are past their deadline."),

  sort: z.array(
    z.object({
      field: z.enum(PROJECT_SORTABLE_FIELDS).describe("Field to sort by."),
      direction: z.enum(['asc', 'desc']).describe("Sort direction: 'asc' for ascending, 'desc' for descending."),
    })
  ).optional().describe("List of sorting criteria. Order matters.")
});