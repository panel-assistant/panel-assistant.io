---
title: Cómo funciona
description: Qué pone Panel Assistant en un panel, qué se queda en Home Assistant y por qué puede ser completamente de código abierto.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

Panel Assistant tiene dos partes. Una está en Home Assistant y es lo que ves y usas. La otra está en cada panel y es lo que hace que el panel sea rápido.

## En Home Assistant: la integración

La integración es lo que instalas a través de HACS. En ella se añaden los paneles, cada panel aparece como un dispositivo con su propio estado y diagnóstico, y los administradores pueden elegir un panel en la barra lateral de Panel Assistant y utilizar su propia interfaz web dentro de Home Assistant.

También es el instalador. Dale la dirección de un panel nuevo, o conecta un panel nuevo a tu portátil, y comprueba qué hay, instala la app del panel, la inicia y solo entonces crea el dispositivo. Si un panel ya está ejecutando la app, lo adopta en su lugar.

## En el panel: la app

Un panel de pared es un pequeño ordenador Android, y la razón por la que la mayoría parecen lentos es el software que traían. Panel Assistant sustituye la parte de ese software que importa por su propia app, que hace tres cosas.

- **Muestra tu panel de control.** La aplicación carga por sí misma tu panel de control existente de Home Assistant. Con el filtrado de entidades habilitado, aprende qué entidades utiliza el panel de control y solicita a Home Assistant solo esas. En un panel económico, eso marca gran parte de la diferencia entre tener retrasos y no tenerlos.
- **Controla el hardware del panel.** La pantalla, su brillo y suspensión, los LED, botones, relés, sensores de proximidad y luz y cualquier otro elemento del modelo se controlan directamente y aparecen en Home Assistant como entidades del dispositivo del panel. Cada modelo se describe mediante un perfil de hardware: texto sin formato que puedes leer, editar y validar en tu navegador, en el panel, sin herramientas de desarrollo. Un panel ARM Android compatible que el proyecto nunca haya encontrado empieza con el perfil conservador Generic, que le proporciona el panel de control, los sensores, el brillo, el audio y la navegación que puede ofrecer cualquier dispositivo Android, y obtiene el resto a medida que se completa su perfil. El panel en funcionamiento comprueba cada capacidad declarada antes de utilizarla, por lo que una función ausente se muestra bloqueada y con una explicación, en lugar de quedar averiada; si un perfil falla al iniciar, se vuelve al último que funcionó.
- **Se comporta como un electrodoméstico.** La app sustituye el lanzador del fabricante, ofrece navegación en pantalla a un panel sin botones, sirve su propia página de estado en tu red y se recupera por sí sola cuando algo va mal, de modo que puedes instalar un panel una vez y dejarlo funcionando sin intervenir.

Esa app se denomina ha-paneld. El nombre viene de su historia como un asistente en segundo plano del que dependía otro software de paneles de control, y desde entonces ha crecido hasta abarcar toda la parte del producto que se ejecuta en el panel. Encontrarás el nombre en la documentación de referencia y en la propia página de estado del panel, y conviene conocerlo para que nada te sorprenda, pero nunca tienes que escribirlo ni pensar en él para usar Panel Assistant.

## Por qué puede ser de código abierto

La mayoría de los fabricantes de paneles distribuyen su soporte de hardware como bibliotecas cerradas que solo su propia app tiene permiso para usar. ha-paneld no las usa. Controla directamente el hardware de cada panel mediante sus propios perfiles por modelo, algo que ha requerido mucho trabajo y que es la razón por la que el proyecto cuenta con soporte de hardware. También es la razón por la que todo puede ofrecerse gratuitamente: no contiene código del fabricante, así que nada impide que sea gratuito y de código abierto bajo licencias permisivas, para paneles de cualquier marca.

Por la misma razón, el soporte de hardware es donde el proyecto más necesita ayuda. Cada panel que se comunica con el proyecto, funcione o no, mejora el siguiente perfil. Consulta [Elegir un panel](/es/install/supported-panels/) para ver el estado actual del soporte.

## Dónde están las piezas

| Pieza                       | Qué es                                                                                       | Dónde                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Panel Assistant             | La integración de Home Assistant: instalador, dispositivos y la página de todos los paneles. | [panel-assistant/ha-integration](https://github.com/panel-assistant/ha-integration) |
| ha-paneld                   | La app del panel: panel de control, hardware, lanzador y página de estado.                   | [panel-assistant/android](https://github.com/panel-assistant/android)               |
| Perfiles de hardware        | Las descripciones por modelo que indican a la app qué tiene un panel y cómo controlarlo.     | [Referencia de hardware](/es/hardware/)                                             |
| Documentación de referencia | La API, los perfiles de hardware y el modelo de seguridad en detalle.                        | [Referencia](/es/reference/api/)                                                    |

## Qué no es

Está pensado para paneles de pared dedicados. Las tabletas y los teléfonos pueden ejecutarlo, pero cualquier dispositivo con batería necesita un cable, y el diseño presupone un panel alimentado por la red eléctrica que se configura una vez y se deja funcionando sin intervenir. No es una herramienta para crear paneles de control; muestra los que ya tienes. Y no está terminado: el rumbo es ofrecer soporte universal de hardware y gestionar todos los paneles sin intervención.
