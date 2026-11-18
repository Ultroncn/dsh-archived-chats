<p align="center">
  <img src="assets/brand/archive-management-banner.png" alt="Archive Management: local-first archived-chat center for DeepSeek Harness" width="100%">
</p>

<div align="center">

<h1>Gerenciamento de conversas arquivadas</h1>

<p><strong>Encontre conversas antigas do DSH, gerencie arquivos e mantenha backups em ZIP.</strong></p>
<p><code>dsh-archived-chats</code></p>

<p><a href="README.md">简体中文</a> · <a href="README.en.md">English</a> · <a href="README.ja.md">日本語</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a> · <a href="README.ru.md">Русский</a> · <strong>Português (Brasil)</strong></p>

<p><a href="CHANGELOG.md">Changelog</a> · <a href="LICENSE">MIT License</a></p>

<p>
  <a href="https://www.npmjs.com/package/dsh-archived-chats"><img alt="Versão npm" src="https://img.shields.io/npm/v/dsh-archived-chats?style=flat&amp;label=Vers%C3%A3o%20npm"></a>
  <a href="#compatibilidade"><img alt="DSH compatível até 0.2.2-rc.3" src="https://img.shields.io/badge/DSH-compat%C3%ADvel%20at%C3%A9%200.2.2--rc.3-2563eb?style=flat"></a>
  <a href="https://www.npmjs.com/package/dsh-archived-chats"><img alt="Downloads no npm nos últimos 18 meses" title="Downloads no npm nos últimos 18 meses" src="https://img.shields.io/npm/d18m/dsh-archived-chats?style=flat&amp;label=Downloads%20no%20npm"></a>
  <a href="LICENSE"><img alt="Licença · MIT" src="https://img.shields.io/badge/Licen%C3%A7a-MIT-2ea44f?style=flat"></a>
  <a href="https://dsh-insights.com/p/Ultroncn/dsh-archived-chats/"><img alt="DSH Insights" src="https://dsh-insights.com/badge/Ultroncn/dsh-archived-chats.svg"></a>
</p>

<p><a href="https://awesome-dsh-plugin.com/p/Ultroncn/dsh-archived-chats/">Plugin market</a> · <a href="https://www.npmjs.com/package/dsh-archived-chats">npm</a> · <a href="https://github.com/Ultroncn/dsh-archived-chats/releases">Releases</a> · <a href="https://github.com/Ultroncn/dsh-archived-chats/discussions">Discussions</a> · <a href="https://github.com/Ultroncn/dsh-archived-chats/security/advisories/new">Private security report</a></p>

</div>

> Este plugin do DeepSeek Harness é mantido pela comunidade e não é um produto oficial da DeepSeek AI.

O Archive Management adiciona ao DeepSeek Harness ferramentas para buscar, organizar e fazer backup de conversas. Encontre uma solução anterior, confira o contexto, arquive conversas por espaço de trabalho ou salve um ZIP antes de excluir uma conversa.

- **Busca detalhada.** Pesquise títulos, mensagens e resultados de ferramentas em **Archived** ou **Unarchived**. Em **Archived**, a busca também inclui tags e notas. Os resultados mostram o turno correspondente em contexto, com um link direto para ele.
- **Organização de conversas.** Gerencie conversas arquivadas e não arquivadas, agrupadas por espaço de trabalho ou sem grupo. Use ações em lote, tags e notas.
- **Backups portáteis.** Exporte e importe arquivos ZIP com JSON e Markdown. A importação exibe uma prévia antes de gravar os dados e pula os IDs que já existem para evitar sobrescritas.
- **Origem e ramificações das conversas.** A visualização somente para leitura **Origins & Branches** mostra origens, ramificações e vínculos com subagentes em todos os espaços de trabalho, tanto para conversas arquivadas quanto para não arquivadas.

> Este guia se refere à versão 2.0.6. Essa versão remove os recursos anteriores de recuperação e permite repetir explicitamente as tarefas de exclusão permanente.

## Instalação

Encontre `dsh-archived-chats` no catálogo de plugins do DSH, confira se o autor é **Ultroncn** e instale o plugin. Reinicie quando o DSH solicitar e abra **Settings → Archive Management** (em chinês, **设置 → 归档管理**).

Você também pode instalar pelo terminal. `web` é um exemplo de perfil. Substitua pelo perfil do DSH que estiver em execução e use o mesmo perfil para atualizar e desinstalar.

```sh
dsh plugin --profile web add dsh-archived-chats@latest
```

Se a instalação retornar `ERR_PNPM_ADDING_TO_ROOT`, acrescente `-w` depois de `add`. Para atualizar, execute o comando abaixo.

```sh
dsh plugin --profile web update dsh-archived-chats
```

## Primeiros passos

1. Abra **Unarchived**, clique no título de uma conversa para ver a prévia e arquive a conversa que deseja guardar. Conversas novas e vazias ficam de fora. Se a conversa estiver em execução, confirme em **Stop and archive**.
2. Faça uma busca em **Archived**, abra um título ou trecho correspondente e edite as tags e notas na prévia.
3. Escolha **Select**, marque as conversas e selecione **Export selected**. Em janelas estreitas, essa opção fica no menu de três pontos. Confira o ZIP nos downloads do navegador.
4. Use **Unarchive** para retomar uma conversa. Antes de excluir uma conversa, decida se quer guardar um backup. A exclusão é permanente e irreversível.

Uma conversa sem diretório de trabalho permanece em **Archived** até que a lista principal oficial consiga acessá-la.

## Páginas e recursos

| Página | Recursos |
| --- | --- |
| **Archived** | Buscar, filtrar e visualizar conversas arquivadas, editar tags e notas, importar e exportar, desarquivar e confirmar a exclusão permanente. |
| **Unarchived** | Ver conversas por espaço de trabalho ou sem grupo, buscar no escopo escolhido, abrir prévias, arquivar e confirmar a exclusão permanente. |
| **Origins & Branches** | Consultar origens, ramificações e subagentes, em modo somente leitura, em todos os espaços de trabalho e estados de arquivamento. |
| **About** | Verificar atualizações automaticamente, identificar o Host e cópias locais do repositório, copiar detalhes da instalação e atualizar quando houver suporte do Host. |

A busca no conteúdo começa com dois caracteres e percorre o escopo selecionado em lotes. Ela mostra o progresso, as correspondências e as falhas, com as opções **Stop search** e **Retry unfinished**. **Archived** busca nas conversas arquivadas e **Unarchived** nas conversas não arquivadas. As duas páginas permitem buscar nas mensagens e abrir a prévia no turno correspondente. O arquivamento em lote segue as mesmas exclusões de sessões ocultas da lista. Veja o [guia do usuário](docs/USER_GUIDE.md) para saber mais sobre o escopo, os limites para logs longos e as operações disponíveis.

## Arquivamento e exclusão permanente

O plugin usa as operações oficiais do Host para arquivar e desarquivar. Excluir uma conversa, excluir as conversas selecionadas ou usar **Delete all** em um espaço de trabalho exige confirmação. A opção global **Delete all** também exige confirmação e abrange as conversas arquivadas de todos os espaços de trabalho. As ações em lote por espaço de trabalho e as globais abrangem todo o seu escopo, independentemente da busca e dos filtros ativos.

A exclusão permanente abrange os diretórios usados exclusivamente pelas sessões e os registros correspondentes das conversas selecionadas e de seus subagentes descendentes. Os diretórios e arquivos de projeto, os anexos compartilhados fora dos diretórios de sessão e os backups independentes são preservados.

Quando uma exclusão permanente falha, o plugin mostra um erro e preserva o estado interno das operações pendentes. A versão atual retira as ações anteriores de recuperação e os snapshots de proteção e mantém as tarefas de exclusão já confirmadas. Consulte o [escopo da exclusão e as opções para tentar novamente](docs/USER_GUIDE.md#permanent-deletion-and-retries).

## Backups e escopo dos dados

O ZIP de backup contém JSON, Markdown, tags, notas e referências aos anexos. Os arquivos anexados ficam fora do ZIP, e as conversas dos subagentes descendentes ficam fora da seleção automática. Use **Import backup** para conferir a prévia antes de restaurar. A importação pula os IDs existentes.

Antes de iniciar o download, o plugin valida se o ZIP gerado atende ao mesmo formato e aos mesmos limites da importação. O aviso indica que o download começou. Confira no navegador se o arquivo foi salvo.

## Mudanças de versão

Instalar uma versão anterior pode reativar as regras de limpeza daquela versão. Antes de voltar a uma versão anterior, faça um backup completo dos dados, verifique se há tarefas pendentes e confira a compatibilidade dos formatos.

## Compatibilidade

A faixa declarada de versões do DSH é `>=0.1.0-rc.7 || 0.2.2-rc.1 || 0.2.2-rc.2 || 0.2.2-rc.3`. Os recursos disponíveis dependem do que o Host oferece. Os testes de integração nativa cobrem os backends oficiais `0.1.7-rc.2`, `0.2.1-rc.2`, `0.2.1-rc.5`, `0.2.2-rc.1` e `0.2.2-rc.3`. A CI executa a matriz de versões do Host no macOS, Windows e Linux.

O arquivamento, o desarquivamento e o inventário usam recursos oficiais. A exclusão permanente coordena o ciclo de vida das sessões do Host com seus locais de armazenamento. Consulte [compatibilidade e limites](docs/USER_GUIDE.md#compatibility-and-limits).

## Capturas de tela

As [capturas de tela do README em inglês](README.en.md#screenshots) usam conversas de demonstração em um Host oficial isolado.

## Documentação e contato

[Guia do usuário](docs/USER_GUIDE.md) · [Arquitetura](docs/ARCHITECTURE.en.md) · [Histórico de versões](CHANGELOG.md) · [Suporte](SUPPORT.md) · [Guia de contribuição](CONTRIBUTING.md)

Use o [Discussions](https://github.com/Ultroncn/dsh-archived-chats/discussions) para dúvidas e sugestões. Ao relatar um bug, inclua as versões do plugin e do DSH, os passos mínimos para reproduzir o problema e as mensagens de erro sem dados sensíveis. Relate problemas de segurança [em particular](SECURITY.md). Se o plugin ajudou você a encontrar trabalhos anteriores, considere [dar uma estrela ao projeto](https://github.com/Ultroncn/dsh-archived-chats).

## Desenvolvimento e validação

[![CI](https://img.shields.io/github/actions/workflow/status/Ultroncn/dsh-archived-chats/ci.yml?branch=main&style=flat&label=CI)](https://github.com/Ultroncn/dsh-archived-chats/actions/workflows/ci.yml) [![Node.js 18 | 24](https://img.shields.io/badge/Node.js-18%20%7C%2024-339933?style=flat&logo=nodedotjs&logoColor=white)](https://github.com/Ultroncn/dsh-archived-chats/actions/workflows/ci.yml)

Consulte os [comandos de validação local e integração nativa](README.en.md#development-and-validation). As verificações nativas usam dados temporários isolados, e cada ambiente de testes deve executar os nove testes sem pular nenhum. Leia o [guia de contribuição](CONTRIBUTING.md) antes de contribuir.

## Desinstalação

```sh
dsh plugin --profile web remove dsh-archived-chats
```

A desinstalação do pacote preserva os dados do plugin e as conversas. Consulte [dados locais e desinstalação](docs/USER_GUIDE.md#local-data-and-uninstall).

[Licença MIT](LICENSE)
