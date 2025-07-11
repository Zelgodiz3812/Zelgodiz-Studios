# Zelgodiz Studio (NodeFS Edition)

Zelgodiz Studio is a desktop IDE framework built with Electron, React, TypeScript, Vite, Monaco Editor, Xterm.js, and a local AI code generation agent powered by Transformers.js. This version has been configured to interact with your actual file system.

## Features

*   **VS Code-like Interface:** Familiar layout with a file explorer, tabbed editor, terminal panel, and AI interaction panel.
*   **Real File System Interaction:** Create, open, edit, save, and delete files and folders directly on your computer.
*   **Monaco Editor:** The powerful editor that powers VS Code, with support for multiple languages.
*   **Xterm.js Terminal:** An integrated terminal panel. (Currently with basic 'ls' and 'clear' example commands).
*   **Local AI Code Generation:** "Riley" agent using `@xenova/transformers` to run a local model for code suggestions (model files located in `codegen_training/model`).
*   **Command Palette:** Quick access to common commands (Ctrl+Shift+P or Cmd+Shift+P).
*   **Built with Modern Web Technologies:** Electron, React, Vite, TypeScript.

## Prerequisites

*   **Node.js:** Ensure you have Node.js installed (which includes npm). Version 18.x or higher is recommended. You can download it from [nodejs.org](https://nodejs.org/).
*   **Git:** For cloning the repository (if applicable).

## Project Structure Highlights

*   `electron.js`: Main Electron process script.
*   `preload.js`: Electron preload script, used here to expose application path info to the renderer.
*   `src/`: Contains the frontend React application code.
    *   `main.tsx`: React application entry point.
    *   `App.tsx`: Root React component.
    *   `VSCodeLayout.jsx`: Core UI layout and logic.
    *   `FileHandlerNodeFS.js`: Handles all file system operations using Node.js `fs` and `path`.
    *   `riley-core-agent.ts`: Logic for the "Riley" AI agent.
    *   `local-model.ts`: Loads and runs the local AI model using Transformers.js.
*   `codegen_training/model/`: Contains the files for the local AI code generation model.
*   `vite.config.ts`: Vite build configuration.
*   `package.json`: Project dependencies and scripts.

## Development Workflow

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install Dependencies:**
    Open your terminal in the project root and run:
    ```bash
    npm install
    ```

3.  **Run in Development Mode:**
    This command starts the Vite development server for the frontend and then launches Electron, which will load the UI from Vite.
    ```bash
    npm run app:dev
    ```
    *   Vite will typically serve on `http://localhost:5173`.
    *   Electron will open, and its DevTools might open automatically.
    *   Changes to frontend code should trigger Hot Module Replacement (HMR). Changes to Electron main process code (`electron.js`, `preload.js`) will require restarting the `npm run app:dev` command.

## Production Build and Run

1.  **Build and Package the Application:**
    This command first builds the frontend using Vite (output to `dist/` folder) and then packages the Electron application using `electron-builder`.
    ```bash
    npm run dist
    ```
    *   The packaged application (e.g., an installer for Windows, or an app bundle for macOS) will be found in a directory like `release/` or `out/` (this can vary based on `electron-builder` configuration and OS).

2.  **Run the Packaged Application:**
    Install the application using the generated installer/bundle and then run it like any other desktop application.

## Key File System Interactions

*   The application now directly reads from and writes to your computer's file system.
*   File operations are handled by `src/FileHandlerNodeFS.js`, which uses Node.js `fs` and `path` modules.
*   The AI model for code generation is loaded from the `codegen_training/model/` directory within the application's structure. This path is resolved at runtime to ensure it works correctly in both development and packaged modes.

## Troubleshooting

*   **Vite dev server port conflict:** If `http://localhost:5173` is in use, Vite might start on a different port. If so, update `viteDevServerUrl` in `electron.js` or configure Vite to use a specific port in `vite.config.ts`.
*   **AI Model Loading Issues:**
    *   Ensure the `codegen_training/model/` directory exists at the project root and contains the necessary model files.
    *   Check the console logs in Electron's DevTools for messages from `[LocalModel]` regarding path resolution and model loading status.
*   **Permissions:** When interacting with the file system, the application is bound by the permissions of the user running it.

## Future Considerations (Post-MVP)

*   **Enhanced Security:** Refactor to use `contextIsolation: true` and `nodeIntegration: false` in Electron, moving all Node.js operations to the main process and communicating via IPC. This is a modern Electron best practice.
*   **Robust Terminal:** Implement a more complete terminal shell experience.
*   **Full Command Palette Implementation:** Complete all commands in the command palette.
*   **Settings Management:** Add a persistent settings system.
*   **Error Handling:** Improve global error handling and user feedback.
*   **Recursive Directory Deletion:** Enhance `FileHandlerNodeFS.deleteFile` to safely delete non-empty directories.
---

This README provides a good overview for users and developers.
