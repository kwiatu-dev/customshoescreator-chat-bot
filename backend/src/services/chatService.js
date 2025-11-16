import { ChatOpenAI } from '@langchain/openai'
import { ChatOllama } from '@langchain/ollama'
import { PromptTemplate } from '@langchain/core/prompts'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { z } from 'zod'
import { Client } from 'langsmith'
import { LangChainTracer } from '@langchain/core/tracers/tracer_langchain'

const langsmithConfig = {
  apiKey: 'YOUR_LANGSMITH_API_KEY', // Twój klucz API
  apiUrl: 'https://api.smith.langchain.com', // Domyślny adres, zmień jeśli używasz self-hosted
  projectName: 'nazwa-twojego-projektu-vue', // Opcjonalnie: nazwa projektu
}

const langsmithClient = new Client(langsmithConfig)

const tracer = new LangChainTracer({
  client: langsmithClient,
})

const llm = new ChatOpenAI({
  model: 'gpt-3.5-turbo',
  apiKey: OPENAI_API_KEY,
  streaming: true,
})

// const llm = new ChatOllama({
//   model: 'gpt-oss:latest',
//   temperature: 0,
// })

const prompt = new PromptTemplate({
  inputVariables: ['topic'],
  template: 'Opisz temat w maksymalnie trzech zadaniach. Temat: {topic}',
})

const chain = prompt.pipe(llm).pipe(new StringOutputParser())
//const result = chain.invoke({ topic: 'uczenie maszynowe' })

//result.then(r => console.log(r))

// for await (const chunk of stream) {
//   console.log(chunk)
// }