import { tool } from "@langchain/core/tools";
import { addProjectSchema } from "../schemas/project_schemas.js";
import { OPEN_FORM_AND_PREFILL_WITH_DATA } from "../../constants/ai.js";

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