<p align="center">
  <img src="assets/brand/archive-management-banner.png" alt="Archive Management: local-first archived-chat center for DeepSeek Harness" width="100%">
</p>

<div align="center">

<h1>Gestión de conversaciones archivadas</h1>

<p><strong>Encuentra conversaciones anteriores de DSH, gestiona los archivos y conserva copias ZIP.</strong></p>
<p><code>dsh-archived-chats</code></p>

<p><a href="README.md">简体中文</a> · <a href="README.en.md">English</a> · <a href="README.ja.md">日本語</a> · <strong>Español</strong> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a> · <a href="README.ru.md">Русский</a> · <a href="README.pt-BR.md">Português (Brasil)</a></p>

<p><a href="CHANGELOG.md">Changelog</a> · <a href="LICENSE">MIT License</a></p>

<p>
  <a href="https://www.npmjs.com/package/dsh-archived-chats"><img alt="Versión npm" src="https://img.shields.io/npm/v/dsh-archived-chats?style=flat&amp;label=Versi%C3%B3n%20npm"></a>
  <a href="#compatibilidad"><img alt="DSH compatible hasta 0.2.2-rc.3" src="https://img.shields.io/badge/DSH-compatible%20hasta%200.2.2--rc.3-2563eb?style=flat"></a>
  <a href="https://www.npmjs.com/package/dsh-archived-chats"><img alt="Descargas npm de los últimos 18 meses" title="Descargas npm de los últimos 18 meses" src="https://img.shields.io/npm/d18m/dsh-archived-chats?style=flat&amp;label=Descargas%20npm"></a>
  <a href="LICENSE"><img alt="Licencia · MIT" src="https://img.shields.io/badge/Licencia-MIT-2ea44f?style=flat"></a>
  <a href="https://dsh-insights.com/p/Ultroncn/dsh-archived-chats/"><img alt="DSH Insights" src="https://dsh-insights.com/badge/Ultroncn/dsh-archived-chats.svg"></a>
</p>

<p><a href="https://awesome-dsh-plugin.com/p/Ultroncn/dsh-archived-chats/">Plugin market</a> · <a href="https://www.npmjs.com/package/dsh-archived-chats">npm</a> · <a href="https://github.com/Ultroncn/dsh-archived-chats/releases">Releases</a> · <a href="https://github.com/Ultroncn/dsh-archived-chats/discussions">Discussions</a> · <a href="https://github.com/Ultroncn/dsh-archived-chats/security/advisories/new">Private security report</a></p>

</div>

> Este complemento de DeepSeek Harness lo mantiene la comunidad y no es un producto oficial de DeepSeek AI.

Archive Management añade a DeepSeek Harness herramientas para buscar, organizar y respaldar conversaciones. Encuentra una solución anterior, revisa su contexto, archiva chats por espacio de trabajo o guarda una copia ZIP antes de borrar una conversación.

- **Búsqueda en profundidad.** Busca en títulos, mensajes y resultados de herramientas desde **Archived** o **Unarchived**. En **Archived** también puedes buscar en etiquetas y notas. Los resultados muestran el turno coincidente en contexto y ofrecen un enlace directo para saltar a él.
- **Organización de chats.** Gestiona conversaciones archivadas y sin archivar, agrupadas por espacio de trabajo o sin agrupar. Puedes aplicar acciones en lote y usar etiquetas y notas.
- **Copias de seguridad portátiles.** Exporta e importa archivos ZIP con JSON y Markdown. La importación muestra una vista previa antes de escribir datos y omite los ID que ya existen para evitar sobrescrituras.
- **Origen y ramificaciones de las conversaciones.** La vista de solo lectura **Origins & Branches** muestra de dónde vienen los chats, sus ramificaciones y las relaciones con subagentes en todos los espacios de trabajo, tanto para chats archivados como sin archivar.

> Esta guía corresponde a la versión 2.0.6. Esta versión retira las funciones de recuperación anteriores y permite reintentar de forma explícita las tareas de eliminación permanente.

## Instalación

Busca `dsh-archived-chats` en el catálogo de plugins de DSH, comprueba que el autor sea **Ultroncn** e instálalo. Reinicia cuando DSH lo solicite y abre **Settings → Archive Management** (en chino, **设置 → 归档管理**).

También puedes instalarlo desde la terminal. `web` es un perfil de ejemplo. Sustitúyelo por el perfil de DSH que tengas en ejecución y usa ese mismo perfil para actualizar o desinstalar.

```sh
dsh plugin --profile web add dsh-archived-chats@latest
```

Si aparece `ERR_PNPM_ADDING_TO_ROOT` al instalar, añade `-w` después de `add`. Para actualizar, ejecuta el siguiente comando.

```sh
dsh plugin --profile web update dsh-archived-chats
```

## Primeros pasos

1. Abre **Unarchived**, haz clic en el título de un chat para previsualizarlo y archiva el que quieras guardar. Los chats nuevos vacíos quedan excluidos. Si el chat está en ejecución, debes confirmar **Stop and archive**.
2. Busca en **Archived**, abre un título o fragmento coincidente y edita las etiquetas y notas desde la vista previa.
3. Elige **Select**, marca los chats y elige **Export selected**. En ventanas estrechas, esta acción está en el menú de tres puntos. Comprueba el ZIP en las descargas del navegador.
4. Usa **Unarchive** para continuar una conversación. Antes de borrar un chat, decide si quieres guardar una copia. La eliminación es permanente e irreversible.

Un chat sin directorio de trabajo permanece en **Archived** hasta que la lista principal oficial pueda acceder a él.

## Páginas y funciones

| Página | Funciones |
| --- | --- |
| **Archived** | Buscar, filtrar y previsualizar chats archivados, gestionar etiquetas y notas, importar y exportar, desarchivar y confirmar la eliminación permanente. |
| **Unarchived** | Ver chats por espacio de trabajo o sin agrupar, buscar en el ámbito elegido, previsualizar, archivar y confirmar la eliminación permanente. |
| **Origins & Branches** | Consultar en modo de solo lectura orígenes, ramificaciones y subagentes de todos los espacios de trabajo y estados de archivo. |
| **About** | Comprobar automáticamente si hay actualizaciones, identificar el Host y las copias locales del repositorio, copiar datos de instalación y actualizar si el Host lo permite. |

La búsqueda de contenido comienza a partir de dos caracteres y recorre por lotes los chats del ámbito seleccionado. Muestra el progreso, las coincidencias y los fallos, con las opciones **Stop search** y **Retry unfinished**. **Archived** busca en chats archivados y **Unarchived** en chats sin archivar. Ambas páginas permiten buscar en los mensajes y abrir la vista previa en el turno coincidente. El archivado en lote aplica las mismas exclusiones de sesiones ocultas que la lista. La [guía de usuario](docs/USER_GUIDE.md) detalla el ámbito de búsqueda, los límites para registros largos y las operaciones disponibles.

## Archivo y eliminación permanente

Archivar y desarchivar usa las operaciones oficiales del Host. Eliminar un chat, eliminar los seleccionados y ejecutar **Delete all** en un espacio de trabajo requiere confirmación. La opción global **Delete all** también requiere confirmación y abarca los chats archivados de todos los espacios de trabajo. Las acciones masivas de espacio de trabajo y globales abarcan todo su ámbito, independientemente de la búsqueda o los filtros activos.

La eliminación permanente abarca los directorios de sesión de uso exclusivo y los registros correspondientes a los chats seleccionados y a sus subagentes descendientes. Se conservan los directorios y archivos de proyecto, los archivos adjuntos compartidos fuera de los directorios de sesión y las copias de seguridad independientes.

Si falla una eliminación permanente, el plugin muestra un error y conserva el estado interno de las operaciones pendientes. La versión actual retira las acciones de recuperación y las instantáneas de protección anteriores y conserva las tareas de eliminación ya confirmadas. Consulta el [alcance de la eliminación y los reintentos](docs/USER_GUIDE.md#permanent-deletion-and-retries).

## Copias de seguridad y alcance de los datos

El ZIP de respaldo contiene JSON, Markdown, etiquetas, notas y referencias a los archivos adjuntos. El contenido de los archivos adjuntos queda fuera del ZIP y los chats de subagentes descendientes quedan fuera de la selección automática. Abre **Import backup** para previsualizar la copia antes de restaurarla. La importación omite los ID existentes.

Antes de iniciar la descarga, el plugin comprueba que el ZIP generado cumple el mismo formato y los mismos límites que la importación. El aviso indica que la descarga se inició. Comprueba en el navegador que el archivo se haya guardado.

## Cambios de versión

Instalar una versión anterior puede reactivar sus reglas de limpieza. Antes de volver a una versión anterior, guarda una copia completa de los datos y revisa las tareas pendientes y la compatibilidad de formatos.

## Compatibilidad

El rango declarado de DSH es `>=0.1.0-rc.7 || 0.2.2-rc.1 || 0.2.2-rc.2 || 0.2.2-rc.3`. Las funciones disponibles dependen de las capacidades del Host. Las pruebas de integración nativa cubren los backends oficiales `0.1.7-rc.2`, `0.2.1-rc.2`, `0.2.1-rc.5`, `0.2.2-rc.1` y `0.2.2-rc.3`. La CI ejecuta la matriz de versiones del Host en macOS, Windows y Linux.

El archivado, el desarchivado y el inventario utilizan funciones oficiales. La eliminación permanente coordina el ciclo de vida de las sesiones del Host con sus ubicaciones de almacenamiento. Consulta [compatibilidad y límites](docs/USER_GUIDE.md#compatibility-and-limits).

## Capturas de pantalla

Las [capturas del README en inglés](README.en.md#screenshots) usan conversaciones de demostración en un Host oficial aislado.

## Documentación y contacto

[Guía de usuario](docs/USER_GUIDE.md) · [Arquitectura](docs/ARCHITECTURE.en.md) · [Historial de cambios](CHANGELOG.md) · [Soporte](SUPPORT.md) · [Guía de contribución](CONTRIBUTING.md)

Usa [Discussions](https://github.com/Ultroncn/dsh-archived-chats/discussions) para preguntas y sugerencias. Si informas de un fallo, incluye las versiones del plugin y de DSH, los pasos mínimos para reproducirlo y los mensajes de error sin datos sensibles. Comunica los problemas de seguridad [de forma privada](SECURITY.md). Si el plugin te ayudó a recuperar trabajo anterior, puedes [darle una estrella al proyecto](https://github.com/Ultroncn/dsh-archived-chats).

## Desarrollo y validación

[![CI](https://img.shields.io/github/actions/workflow/status/Ultroncn/dsh-archived-chats/ci.yml?branch=main&style=flat&label=CI)](https://github.com/Ultroncn/dsh-archived-chats/actions/workflows/ci.yml) [![Node.js 18 | 24](https://img.shields.io/badge/Node.js-18%20%7C%2024-339933?style=flat&logo=nodedotjs&logoColor=white)](https://github.com/Ultroncn/dsh-archived-chats/actions/workflows/ci.yml)

Consulta los [comandos de validación local e integración nativa](README.en.md#development-and-validation). Las comprobaciones nativas usan datos temporales aislados y cada entorno de pruebas debe ejecutar las nueve pruebas sin omitir ninguna. Lee la [guía de contribución](CONTRIBUTING.md) antes de contribuir.

## Desinstalación

```sh
dsh plugin --profile web remove dsh-archived-chats
```

Desinstalar el paquete conserva los datos del plugin y los chats. Consulta [datos locales y desinstalación](docs/USER_GUIDE.md#local-data-and-uninstall).

[Licencia MIT](LICENSE)
