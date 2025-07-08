#pragma once
#include <string>

// Zellie: Zelgodiz's native local LLM engine
class ZellieEngine {
public:
    ZellieEngine(const std::string& modelPath);
    ~ZellieEngine();
    std::string infer(const std::string& prompt);
private:
    void* ctx; // Internal context for Zellie model
};
