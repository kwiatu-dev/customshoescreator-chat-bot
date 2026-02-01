import { tool } from "@langchain/core/tools";
import { addProjectSchema, listProjectsSchema } from "../schemas/project_schemas.js";
import { OPEN_FORM_AND_PREFILL_WITH_DATA, SEARCHING_FOR_PROJECTS } from "../../constants/ai.js";
import { findUserByEmail } from "../../services/userService.js";
import { findProjectStatusByName, findProjectTypeByName } from "../../services/projectService.js";

export const addProject = tool(
  async (input) => {
    const content = OPEN_FORM_AND_PREFILL_WITH_DATA()

    const artifact = {
      actions: ['REDIRECT_TO_ROUTE', 'PREFILL_FORM'],
      payload: {
        redirect: {
            route: 'projects.create',
            params: null, 
        },
        prefill_with_data: {
            ...input,
        } 
      }
    };
    
    return [ content, artifact ]
  },
  {
    name: "add_project",
    description: "Call this tool when the user intends to create or add a new project. Extract project details from the conversation.",
    schema: addProjectSchema,
    returnDirect: true,
    responseFormat: 'content_and_artifact'
  }
);

export const listProjects = tool(
  async (input, config) => {
    const content = SEARCHING_FOR_PROJECTS();
    const authUser = config.configurable?.authUser;

    const rawParams = {
      search: input.search,
      
      start_start: input.start_start,
      start_end: input.start_end,
      deadline_start: input.deadline_start,
      deadline_end: input.deadline_end,
      end_start: input.end_start,
      end_end: input.end_end,
      
      price_start: input.price_start,
      price_end: input.price_end,
      visualization_start: input.visualization_start,
      visualization_end: input.visualization_end,
      
      status_id: null,
      type_id: null,
      created_by_user_id: null,
      
      deleted: input.deleted,
      created_by_user: input.created_by_user,
      after_deadline: input.after_deadline,
    };

    try {
      const [status, type, user] = await Promise.all([
        input.status_reference ? findProjectStatusByName(input.status_reference, authUser.token) : Promise.resolve(null),
        input.type_reference ? findProjectTypeByName(input.type_reference, authUser.token) : Promise.resolve(null),
        input.user_reference ? findUserByEmail(input.user_reference, authUser.token) : Promise.resolve(null),
      ]);

      rawParams.status_id = status ? status.id : null;
      rawParams.type_id = type ? type.id : null;
      rawParams.created_by_user_id = user ? user.id : null;
    } 
    catch (err) {
      // If any error occurs during fetching, we simply leave the IDs as null
    }

    if (input.sort && Array.isArray(input.sort)) {
      input.sort.forEach((sortItem) => {
        rawParams[sortItem.field] = sortItem.direction;
      });
    }

    const params = Object.fromEntries(
      Object.entries(rawParams).filter(([_, v]) => v != null && v !== '')
    );

    const artifact = {
      actions: ['REDIRECT_TO_ROUTE'], 
      payload: {
        redirect: {
            route: 'projects.index', 
            params: params,
        },
      }
    };
    
    return [ content, artifact ];
  },
  {
    name: "list_projects",
    description: "Call this tool when the user wants to list, search, filter, or sort projects. Use this for queries like 'Show me active projects', 'List projects created last month', or 'Show projects sorted by price'.",
    schema: listProjectsSchema,
    returnDirect: true,
    responseFormat: 'content_and_artifact'
  }
);