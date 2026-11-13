---
title: Entorno de desarrollo
description: Las herramientas para compilar la aplicación del panel, las vías Docker y devcontainer, y lo que debe saber un fork sobre la firma.
sourceCommit: 396e908e6370b88a9fd555abcb67b0816c4cd6f4
---

No necesitas compilar ha-paneld para utilizarlo: al instalar un panel se descarga una versión firmada. Esta página es para colaboradores y quienes mantienen un fork. Para una visita guiada al código fuente, consulta el [recorrido por el código en DeepWiki](https://deepwiki.com/panel-assistant/android).

## Herramientas

La aplicación del panel es una aplicación Android escrita en Kotlin y compilada con Gradle. Necesita **JDK 17** y un SDK de Android con **plataforma 37.0, Build-Tools 36.0.0, NDK 27.0.12077973 y CMake 3.22.1** (CMake y el NDK compilan el controlador nativo del LED). El wrapper de Gradle fija su versión y las versiones de las dependencias están en [`gradle/libs.versions.toml`](https://github.com/panel-assistant/android/blob/main/gradle/libs.versions.toml).

Con esas herramientas instaladas localmente:

```sh
./gradlew :app:assembleDebug      # debug APK -> app/build/outputs/apk/debug/
./gradlew :app:assembleRelease    # release APK (unsigned unless signing configured)
```

## Docker

Si prefieres instalar únicamente Docker, [`tools/build/`](https://github.com/panel-assistant/android/tree/main/tools/build) crea una imagen Docker y ejecuta Gradle dentro de ella. Su Dockerfile enumera los paquetes del SDK incluidos en la imagen. El APK se guarda en tu árbol de trabajo, la imagen se almacena en caché tras la primera compilación y las cachés de Gradle persisten en un volumen Docker con nombre.

```sh
./tools/build/build.sh                       # debug APK -> app/build/outputs/apk/debug/
./tools/build/build.sh :app:assembleRelease  # any Gradle task(s) instead
```

Si ejecutas el script desde un contenedor que se comunica con un servicio Docker externo, lee la nota sobre `HOST_WORKDIR` en `build.sh`.

## Devcontainer

[`.devcontainer/`](https://github.com/panel-assistant/android/tree/main/.devcontainer) fija las mismas herramientas Android para VS Code, así que el SDK y el NDK nunca se instalan en tu equipo. Abre el repositorio en VS Code, elige **Reabrir en contenedor** y ejecuta los comandos Gradle anteriores. El JDK del devcontainer es posterior a JDK 17, así que considera la compilación con JDK 17 como referencia para el comportamiento relacionado con la versión de Java.

## El auxiliar root

Gradle compila y verifica automáticamente ambos auxiliares root específicos de cada ABI antes de compilar la aplicación. La aplicación y los auxiliares incorporan la misma identidad, derivada de todos los archivos fuente, cabeceras y definiciones de comandos del auxiliar, de modo que una compilación local no pueda depender silenciosamente de código privilegiado obsoleto.

## Medir el rendimiento del panel de control desde un ordenador

La propia página de estado del panel cubre el rendimiento para el uso cotidiano; consulta [Rendimiento](/es/manage/performance/). Para registrar una comparación de un panel de control con y sin filtro de entidades, medida desde fuera del panel, el repositorio incluye un script recolector.

Si el panel de control sin filtrar sobrecarga su WebView, sus cifras pueden dejar de actualizarse. Un script recolector en un equipo consulta en cambio la interfaz de rendimiento de la app, parte de la API REST obsoleta (consulta la [referencia de control](/es/reference/api/#la-api-rest-está-obsoleta)). Así sigue observándose la CPU total y, con root o auxiliar, un sondeo nativo del hilo del renderizador Chromium. También registra la antigüedad del último lote de mediciones del navegador: más de 15 segundos se considera bloqueado, no actual.

El recolector no cambia la configuración. Nunca activa, desactiva ni reescribe el filtro; su primera petición puede crear una clave privada de instalación en el estado interno de la app. Selecciona la misma vista y carga para ambas ejecuciones, cambia el filtro en la interfaz web, espera a la recarga y ejecuta un comando desde una copia del [repositorio de ha-paneld](https://github.com/panel-assistant/android) para cada estado:

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect filtered --label filtered --output filtered.json
```

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect unfiltered --label unfiltered --pair-with filtered.json --output unfiltered.json
```

Compara los resultados:

```bash
python3 tools/measure-dashboard-performance.py compare filtered.json unfiltered.json --output comparison.json
```

Cada ejecución dura tres minutos por defecto, con 30 segundos de calentamiento y consultas cada 10 segundos. `--pair-with` reutiliza un ID opaco del primer resultado para rechazar otro panel físico, otra configuración de Home Assistant o panel de control, o cambios de ajustes que afecten a la medición, sin registrar sus valores privados. No detecta una vista distinta elegida manualmente dentro del mismo panel de control: conserva la misma vista y carga.

Rechaza una ejecución si no está activo el modo esperado, cambia la revisión del filtro o generación del renderizador, cambia la compilación o configuración durante la recogida, se pierde el filtrado o conserva menos de tres muestras generales, tres de CPU total o tres de CPU nativa del renderizador. Escribe igualmente el resultado rechazado con los motivos exactos y nunca sobrescribe una salida existente.

El JSON omite URL e ID del panel, URL de Home Assistant y ruta del panel de control, IDs de entidades, nombres de procesos y hash del filtro. El panel calcula huellas opacas con una clave aleatoria privada de instalación de 256 bits que nunca sale de él; son únicas para cada pareja de comparación, por lo que no enlazan mediciones separadas ni permiten adivinar el nombre del panel. Si no puede guardar la clave, rechaza la medición. El recuento sin filtrar es el último sincronizado del catálogo, no uno en vivo recuperado del WebView sobrecargado; se indica no disponible si el catálogo está vacío. Los contadores de red y navegador se normalizan a los intervalos observados para que una consulta perdida no sesgue la comparación. Los tiempos y tasas del navegador obsoletos se omiten del resumen, mientras siguen recogiéndose CPU, memoria, red y renderizador desde la app.

## Firma

No necesitas configurar la firma para compilar y ejecutar ha-paneld. Un checkout sin configuración de firma utiliza el `debug.keystore` incluido para las compilaciones de depuración. Si `keystore.properties` proporciona una configuración de firma, las compilaciones de depuración utilizan esa clave. Las versiones oficiales se firman con la clave privada de publicación del proyecto, que nunca está en el repositorio.

Android rechaza actualizar una aplicación instalada con un APK firmado con otra clave. Por tanto, pasar de una versión oficial a tu propia clave de publicación o a una compilación de depuración requiere desinstalar primero. Antes, haz una copia de seguridad `.hpb` completa y cifrada desde **Instalar → Copia de seguridad** y comprueba que el archivo se ha guardado; de lo contrario, la desinstalación elimina los perfiles, el estado aprendido y el historial. Panel Assistant convierte la aplicación del panel en administrador del dispositivo y Android no permite desinstalar un administrador, así que primero retira ese permiso. Elimina la aplicación mediante la opción **Quitar de este panel**, en **Configurar** en Home Assistant, o retira la administración del dispositivo y desinstala por ADB:

```sh
adb shell am broadcast --include-stopped-packages -n io.panelassistant.android/io.panelassistant.android.platform.ReleaseDeviceAdminReceiver
adb shell pm uninstall io.panelassistant.android
```

Si `pm uninstall` sigue respondiendo `DELETE_FAILED_DEVICE_POLICY_MANAGER`, espera un segundo y vuelve a ejecutarlo. Instala la otra compilación y restaura la copia desde **Instalar → Restaurar**. Consulta [Actualizaciones y recuperación](/es/manage/updates-and-recovery/).

Para firmar tus compilaciones de forma coherente, copia [`keystore.properties.example`](https://github.com/panel-assistant/android/blob/main/keystore.properties.example) a `keystore.properties` y rellénalo; con ese archivo presente, `assembleRelease` firma con la clave de publicación. Un fork que publica versiones etiquetadas mediante GitHub Actions proporciona la misma clave mediante secretos del repositorio.

```sh
keytool -genkeypair -storetype PKCS12 -keystore release.jks -alias ha-paneld \
  -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=ha-paneld"
```

:::danger
Nunca incluyas `keystore.properties` ni el archivo `.jks` en un commit (ambos están en gitignore). Guarda una copia del almacén de claves y de su contraseña: si los pierdes, nunca podrás publicar una actualización sobre tus propias compilaciones instaladas.
:::
