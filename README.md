# P5.js Live Vibe Coding

An interactive app built with Vite, React, Firebase, and OpenAI API for generating and rendering p5.js sketches in real-time.

## Features

- **Chat with AI**: Describe your p5.js sketch idea in natural language.
- **Code Generation**: OpenAI GPT-4 generates the p5.js code based on your description.
- **Live Rendering**: The generated code is immediately rendered in the right panel.
- **State Storage**: Chat history and generated code are stored in Firebase Firestore.
- **Three-Panel Layout**: Full-width browser layout with chat, code display, and rendering panels.

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`:
   - `VITE_OPENAI_API_KEY`: Your OpenAI API key
   - Firebase config variables (API key, project ID, etc.)
4. Run the development server: `npm run dev`

## Usage

- Type a description of the p5.js sketch you want in the chat input (e.g., "Draw a bouncing ball").
- Press Enter or click Send.
- The AI generates the code, displays it in the middle panel, and renders it in the right panel.
- Chat history is persisted in Firebase.

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


## Instructions used to create the app

Let's build an app in vitejs with firebase for state storage and openai API for chat & code generation. This app allows the user to chat with an AI to generate p5js code that is then rendered right away.
This app should use the full width of the browser and have 3 panels:
- left panel for chat with the AI
- middle panel for the current code
- right panel for rendering with p5js