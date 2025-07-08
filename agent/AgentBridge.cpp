#include "AgentBridge.h"

AgentBridge::AgentBridge(const std::string& modelPath) : zellie(modelPath) {}

std::string AgentBridge::queryZellie(const std::string& prompt) {
    return zellie.infer(prompt);
}
