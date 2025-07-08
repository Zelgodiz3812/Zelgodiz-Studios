#include "ApplicationManager.h"
#include "../agent/AgentEnvironment.h"
#include "../ui/MainWindow.h"

ApplicationManager::ApplicationManager() {
    // Initialize the agent environment
    agentEnvironment = new AgentEnvironment();
    mainWindow = new MainWindow();
}

ApplicationManager::~ApplicationManager() {
    delete agentEnvironment;
    delete mainWindow;
}

void ApplicationManager::start() {
    // Start the main application window
    mainWindow->show();
}

void ApplicationManager::stop() {
    // Logic to stop the application
    mainWindow->close();
}

void ApplicationManager::runAgentCode(const std::string& code) {
    // Execute code in the agent environment
    agentEnvironment->executeCode(code);
}