# train_codegen.py
# Train a small code generation model from scratch using Hugging Face Transformers
# Free, open-source, and local only

import os
from datasets import load_dataset, Dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, Trainer, TrainingArguments, DataCollatorForLanguageModeling
import torch

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
MODEL_OUT = os.path.join(os.path.dirname(__file__), "model")
MODEL_NAME = "distilgpt2"  # Small, open-source, and FOSS

# 1. Load your code data
def load_code_data(data_dir):
    code_samples = []
    for fname in os.listdir(data_dir):
        with open(os.path.join(data_dir, fname), "r", encoding="utf-8") as f:
            code = f.read()
            code_samples.append({"text": code})
    return Dataset.from_list(code_samples)

def main():
    # Load or create dataset
    dataset = load_code_data(DATA_DIR)
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

    def tokenize_function(examples):
        return tokenizer(examples["text"], truncation=True, padding="max_length", max_length=128)

    tokenized = dataset.map(tokenize_function, batched=True)

    data_collator = DataCollatorForLanguageModeling(
        tokenizer=tokenizer, mlm=False
    )

    training_args = TrainingArguments(
        output_dir=MODEL_OUT,
        overwrite_output_dir=True,
        num_train_epochs=1,
        per_device_train_batch_size=2,
        save_steps=10,
        save_total_limit=2,
        logging_steps=5,
        fp16=torch.cuda.is_available(),
        report_to=[],
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized,
        data_collator=data_collator,
    )

    trainer.train()
    trainer.save_model(MODEL_OUT)
    tokenizer.save_pretrained(MODEL_OUT)
    print(f"Model saved to {MODEL_OUT}")

if __name__ == "__main__":
    main()
