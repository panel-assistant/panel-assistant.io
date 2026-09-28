---
title: Custom wake words
description: Training your own wake word with microWakeWord, importing it on a panel, deploying it to several panels, and tuning it.
---

The four bundled wake words are [microWakeWord](https://github.com/kahrendt/microWakeWord) models, and a panel's [voice assistant](/manage/voice-assistant/) can import any model trained the same way. This page covers training one, its manifest format, importing it on the panel, and testing it once it is installed.

## Training a model

microWakeWord is a separate, Apache-2.0-licensed open-source project by Kevin Ahrendt; its [training notebook](https://github.com/kahrendt/microWakeWord/blob/main/notebooks/basic_training_notebook.ipynb) walks through the whole process and is the canonical reference. In outline:

1. **Pick a phrase and generate synthetic samples.** You set the target phrase, and the notebook uses [piper-sample-generator](https://github.com/rhasspy/piper-sample-generator) to synthesize thousands of spoken examples of it in different voices.
2. **Augment the samples.** The notebook layers effects onto the synthetic audio — equalization, distortion, pitch shifting, room-impulse convolution, and mixing in background noise and music from public audio datasets — so the model does not just learn to recognise one clean recording.
3. **Train.** The model trains for a configurable number of steps, then converts from a non-streaming model into the streaming form the panel actually runs. The notebook itself says training in Google Colab is workable but noticeably slower than a local GPU.
4. **Export.** The trained model is exported as a quantised, streaming TensorFlow Lite file — this is the `.tflite` file you will import.

You do not need any of this if a ready-made model already covers your phrase: the [`esphome/micro-wake-word-models`](https://github.com/esphome/micro-wake-word-models) repository (also Apache-2.0) publishes trained models by filename under `models/v2/`, and one of those imports exactly the way a model you trained yourself would.

## Writing the manifest

Each wake word needs a small JSON manifest alongside its `.tflite` file, in microWakeWord's version 2 format — the same format ESPHome's `micro_wake_word` component and the `esphome/micro-wake-word-models` repository use, so a manifest from either source works unchanged. Required fields:

- `"type"`: always `"micro"`.
- `"model"`: the `.tflite` file's name (no slashes).
- `"micro"`: an object with `probability_cutoff` (0 to 1), `feature_step_size` (a positive integer; current models use `10`) and `sliding_window_size` (a positive integer).

Optional fields: `wake_word` (the phrase shown in the UI; defaults to the wake word's id if omitted), `author`, `website`, `trained_languages`, `version` and `micro.tensor_arena_size`.

This is the bundled Hey Jarvis manifest, as an example of the shape:

```json
{
  "type": "micro",
  "wake_word": "Hey Jarvis",
  "author": "Kevin Ahrendt",
  "website": "https://www.kevinahrendt.com/",
  "model": "hey_jarvis.tflite",
  "trained_languages": ["en"],
  "version": 2,
  "micro": {
    "probability_cutoff": 0.97,
    "feature_step_size": 10,
    "sliding_window_size": 5,
    "tensor_arena_size": 22860,
    "minimum_esphome_version": "2024.7.0"
  }
}
```

### Choosing `probability_cutoff` and `sliding_window_size`

Both trade false wakes against missed wakes, and neither has one right value for every model:

- **`probability_cutoff`** is the confidence threshold the model has to clear to report a detection. Raise it and the panel wakes less often on things that only sound similar to your phrase, but it also becomes more likely to miss a real, quieter or more casual utterance of it. Lower it for the opposite trade. The bundled models sit around `0.97`; the training notebook's own advice is to adjust the cutoff after looking at how your trained model actually performs, rather than assuming one number will suit it.
- **`sliding_window_size`** controls how many consecutive detection windows are averaged before the panel commits to a wake. A smaller window reacts faster but is more exposed to a single noisy spike; a larger one smooths that out at the cost of a slightly slower wake.

Start from the values your model's own documentation or notebook run suggests, import it, and tune from there using the panel's own near-miss log described in [Testing and tuning](#testing-and-tuning).

## Importing the model

### From the panel's Configure page

On the **Voice** card, the wake words picker has an **import** control. Choose the model's `.json` manifest and its `.tflite` file, then press **Import trained wake word**. The panel validates the model with its own wake word engine before accepting it; if it refuses a model, nothing is installed, and if a model of the same name was already imported, that earlier model is left in place. Manifests are limited to 16 KB and models to 2 MB.

The wake word's id is derived from the manifest file's name, lower-cased and reduced to letters, digits and underscores (it must start with a letter). It cannot reuse the id of a bundled wake word, and importing a manifest under a name you have already used replaces that earlier model.

Once it is imported, tick it under **Wake words**, choose its pipeline under **Wake word pipelines**, and **Save**. It also appears in Home Assistant's own wake word selector for that panel from then on.

### With the HTTP API

An imported model lives on the one panel it was imported to. To use the same wake word on several panels, import it on each one — either through each panel's Configure page, or with the API:

```
POST http://<panel>:8888/api/v1/voice/wake-words
Content-Type: application/json

{"name": "<name>", "manifest": "<the .json file's text>", "model": "<the .tflite file, base64-encoded>"}
```

It answers `200` with `{"id", "wake_word"}` on success, `422` with `{"error"}` if the panel's wake word engine refuses the model, and `413` if the manifest or model is too large. `GET /api/v1/voice/wake-words` lists both the bundled and the imported wake words on a panel.

This imports one model into a list of panel addresses from a shell:

```sh
#!/usr/bin/env bash
set -euo pipefail

manifest_file="my_wake_word.json"
model_file="my_wake_word.tflite"
panels=(kitchen-panel.local landing-panel.local office-panel.local)

body=$(jq -n \
  --arg name "my_wake_word" \
  --rawfile manifest "$manifest_file" \
  --arg model "$(base64 -w0 "$model_file")" \
  '{name: $name, manifest: $manifest, model: $model}')

for panel in "${panels[@]}"; do
  echo "Importing onto $panel..."
  curl -fsS -X POST "http://$panel:8888/api/v1/voice/wake-words" \
    -H 'content-type: application/json' \
    -d "$body"
  echo
done
```

`base64 -w0` avoids line-wrapping the encoded model (use `base64 -b 0` in place of `-w0` on macOS/BSD). `jq -n --rawfile manifest ... --arg model ...` embeds the manifest's exact text and the base64 model safely as JSON strings, so neither needs manual escaping.

## Testing and tuning

Use **Test a wake word** on the Voice card, or just say it, and watch the panel's own log (`/logs` on the panel, or `GET /api/v1/diag`). A wake word that was heard but did not quite trigger still shows up there as a near miss, together with the highest score it reached. If those near-miss scores sit just under your `probability_cutoff`, lowering the cutoff slightly, or raising **Wake sensitivity** on the Voice card, is usually enough; if the phrase never shows up as a near miss at all, the model itself is not recognising it, and retraining with more or more varied samples is the more useful next step.
