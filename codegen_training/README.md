# CodeGen Training

This folder contains everything you need to train your own small code generation model from scratch using only free and open-source tools.

## Steps

1. Add your code samples (in plain text) to the `data/` folder. Each file can contain code snippets in any language you want the model to learn.
2. Install the requirements: `pip install -r requirements.txt`
3. Run the training script: `python train_codegen.py`

The script will train a small model and save it to `codegen_training/model/` for use in your app.
