---
title: Palabras de activación personalizadas
description: Entrenar tu propia palabra de activación con microWakeWord, importarla en un panel, distribuirla a varios paneles y ajustarla.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Las cuatro palabras de activación incluidas son modelos de [microWakeWord](https://github.com/kahrendt/microWakeWord), y el [asistente de voz](/es/manage/voice-assistant/) de un panel puede importar cualquier modelo entrenado del mismo modo. Esta página explica cómo entrenar uno, el formato de su manifiesto, cómo importarlo y cómo probarlo una vez instalado.

## Entrenar un modelo

microWakeWord es un proyecto independiente de código abierto con licencia Apache-2.0, creado por Kevin Ahrendt; su [cuaderno de entrenamiento](https://github.com/kahrendt/microWakeWord/blob/main/notebooks/basic_training_notebook.ipynb) explica todo el proceso y es la referencia canónica. En líneas generales:

1. **Elige una frase y genera muestras sintéticas.** Estableces la frase objetivo y el cuaderno utiliza [piper-sample-generator](https://github.com/rhasspy/piper-sample-generator) para sintetizar miles de ejemplos hablados con distintas voces.
2. **Amplía las muestras.** El cuaderno añade efectos al audio sintético (ecualización, distorsión, cambios de tono, convolución con respuestas impulsionales de habitaciones y mezcla con ruido de fondo y música de conjuntos públicos de audio), para que el modelo no aprenda únicamente a reconocer una grabación limpia.
3. **Entrena.** El modelo se entrena durante un número configurable de pasos y después se convierte de un modelo sin procesamiento continuo al formato continuo que ejecuta el panel. El propio cuaderno indica que entrenar en Google Colab es viable, pero sensiblemente más lento que con una GPU local.
4. **Exporta.** El modelo entrenado se exporta como un archivo TensorFlow Lite cuantizado y de procesamiento continuo. Este es el archivo `.tflite` que importarás.

No necesitas nada de esto si ya existe un modelo para tu frase: el repositorio [`esphome/micro-wake-word-models`](https://github.com/esphome/micro-wake-word-models) (también Apache-2.0) publica modelos entrenados por nombre de archivo en `models/v2/`; se importan exactamente igual que un modelo entrenado por ti.

## Escribir el manifiesto

Cada palabra necesita un pequeño manifiesto JSON junto a su archivo `.tflite`, en el formato de versión 2 de microWakeWord. Es el mismo formato que utilizan el componente `micro_wake_word` de ESPHome y el repositorio `esphome/micro-wake-word-models`, así que un manifiesto de cualquiera de ellos funciona sin cambios. Campos obligatorios:

- `"type"`: siempre `"micro"`.
- `"model"`: el nombre del archivo `.tflite` (sin barras).
- `"micro"`: un objeto con `probability_cutoff` (de 0 a 1), `feature_step_size` (un entero positivo; los modelos actuales utilizan `10`) y `sliding_window_size` (un entero positivo).

Campos opcionales: `wake_word` (la frase mostrada en la interfaz; si se omite, se utiliza el identificador de la palabra), `author`, `website`, `trained_languages`, `version` y `micro.tensor_arena_size`.

Este es el manifiesto incluido de Hey Jarvis, como ejemplo de la estructura:

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

### Elegir `probability_cutoff` y `sliding_window_size`

Ambos equilibran las activaciones falsas y las no detectadas; ninguno tiene un único valor correcto para todos los modelos:

- **`probability_cutoff`** es el umbral de confianza que el modelo debe superar para comunicar una detección. Al aumentarlo, el panel se activa menos con sonidos parecidos a tu frase, pero también es más probable que no detecte una pronunciación real más baja o informal. Reducirlo produce el efecto contrario. Los modelos incluidos utilizan valores cercanos a `0.97`; el propio cuaderno recomienda ajustar el umbral tras observar el comportamiento real del modelo entrenado, en lugar de suponer que un número determinado le servirá.
- **`sliding_window_size`** controla cuántas ventanas de detección consecutivas se promedian antes de activar el panel. Una ventana menor reacciona más rápido, pero es más vulnerable a un pico aislado de ruido; una mayor lo suaviza a cambio de una activación ligeramente más lenta.

Empieza por los valores que sugieran la documentación de tu modelo o la ejecución del cuaderno, impórtalo y ajústalo con el registro de detecciones cercanas al umbral descrito en [Pruebas y ajustes](#pruebas-y-ajustes).

## Importar el modelo

### Desde la página Configurar del panel

En la tarjeta **Voz**, el selector de palabras de activación tiene un control de **importación**. Elige el manifiesto `.json` y el archivo `.tflite` del modelo y pulsa **Importar palabra de activación entrenada**. El panel valida el modelo con su propio motor de detección antes de aceptarlo; si lo rechaza, no se instala nada y, si ya había un modelo importado con el mismo nombre, se conserva el anterior. Los manifiestos están limitados a 16 KB y los modelos a 2 MB.

El identificador de la palabra se deriva del nombre del archivo `.tflite`, convertido a minúsculas y reducido a letras, dígitos y guiones bajos (debe empezar por una letra). No puede reutilizar el identificador de una palabra incluida, e importar un modelo con un nombre ya utilizado sustituye al modelo anterior.

Importar hace que la palabra esté disponible; no la activa. Para utilizarla en un panel, márcala en **Palabras de activación** y elige su flujo en **Flujos de palabra de activación**. A partir de entonces también aparece en el selector de palabras de activación de Home Assistant para ese panel.

### En varios paneles

El lugar donde abres Configurar determina si la importación se comparte:

- **Directamente en la página Configurar del propio panel:** el modelo importado permanece en ese panel. No se comparte con otros.
- **Dentro de la barra lateral de Panel Assistant en Home Assistant:** cuando el panel seleccionado valida e instala el modelo, Panel Assistant conserva una copia compartida y la instala en todos los demás paneles con micrófono, incluidos los que se conecten más adelante.

Importar un modelo más reciente con el mismo identificador mediante la barra lateral sustituye la copia compartida y puede actualizar los paneles que tengan una copia compartida anterior. Si otro panel importó independientemente un modelo distinto con ese identificador, lo conserva; Panel Assistant genera una [reparación de palabra de activación](/es/home-assistant/repairs/#wake-word-kept) en lugar de sobrescribirlo. Un panel que rechaza un modelo compartido también recibe una [reparación con el motivo](/es/home-assistant/repairs/#wake-word-refused).

Compartir hace que el modelo se pueda seleccionar en cada panel; elige la palabra y el flujo por separado en cada uno para activarlo.

## Pruebas y ajustes

Utiliza **Visitar** en la página del dispositivo del panel en Home Assistant y abre **Registros** (por ejemplo, `http://<panel>:8888/logs` con el puerto predeterminado); después pronuncia la palabra y observa el registro. Una palabra oída que no llegó a activarse aparece como una detección cercana al umbral, en una línea como `wake word my_wake_word heard at 0.86, short of its cutoff`, con la puntuación máxima de ese intento. Si esas puntuaciones quedan justo por debajo de `probability_cutoff`, normalmente basta con reducir un poco el umbral o aumentar la **Sensibilidad de activación** en la tarjeta Voz; si la frase nunca aparece como detección cercana al umbral, el propio modelo no la está reconociendo y el siguiente paso más útil es volver a entrenarlo con más muestras o muestras más variadas.
