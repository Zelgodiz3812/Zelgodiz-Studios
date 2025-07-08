#pragma once
#include <string>
#include "LlamaEngine.h"

// AgentBridge connects the C# frontend to the Zellie LLM engine
class AgentBridge {
public:
    AgentBridge(const std::string& modelPath);
    std::string queryZellie(const std::string& prompt);
private:
    ZellieEngine zellie;
};
