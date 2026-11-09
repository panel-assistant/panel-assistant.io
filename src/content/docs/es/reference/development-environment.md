---
title: Entorno de desarrollo
description: Las herramientas para compilar la aplicación del panel, las vías Docker y devcontainer, y lo que debe saber un fork sobre la firma.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
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

## Firma

No necesitas configurar la firma para compilar y ejecutar ha-paneld. Un checkout sin configuración de firma utiliza el `debug.keystore` incluido para las compilaciones de depuración. Si `keystore.properties` proporciona una configuración de firma, las compilaciones de depuración utilizan esa clave. Las versiones oficiales se firman con la clave privada de publicación del proyecto, que nunca está en el repositorio.

Android rechaza actualizar una aplicación instalada con un APK firmado con otra clave. Por tanto, pasar de una versión oficial a tu propia clave de publicación o a una compilación de depuración requiere desinstalar primero. Antes, haz una copia de seguridad `.hpb` completa y cifrada desde **Instalar → Copia de seguridad** y comprueba que el archivo se ha guardado; de lo contrario, la desinstalación elimina los perfiles, el estado aprendido y el historial. Panel Assistant convierte la aplicación del panel en administrador del dispositivo y Android no permite desinstalar un administrador, así que primero retira ese permiso. Elimina la aplicación mediante la opción **Eliminar Panel Assistant de este panel** (**Eliminar de este panel** en la versión 1.0.0-rc2, aún no publicada), en **Configurar** en Home Assistant, o retira la administración del dispositivo y desinstala por ADB:

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
