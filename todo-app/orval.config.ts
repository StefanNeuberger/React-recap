import { defineConfig } from 'orval'

export default defineConfig({
  todoApi: {
    input: './openapi.json',
    output: {
      target: './src/api/generated/todoClient.ts',
      schemas: './src/api/generated/model',
      client: 'react-query',
      clean: true,
      prettier: true,
      mode: 'single',
    },
  },
})


