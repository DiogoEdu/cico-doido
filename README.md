# Ciço Doido

Assistente web em português com conversa por texto, comandos por voz, chamada “Ciço Doido”, tarefas locais e configurações de voz e personalidade.

## Executar

Requer Node.js 22.13 ou superior (Vite 8 também suporta Node 20.19).

```sh
npm ci
npm run dev
```

Para verificar TypeScript e gerar a versão de produção:

```sh
npm run build
npm run preview
```

## Hospedar no Cloudflare Pages

Conecte este repositório ao Cloudflare Pages. Use `npm run build` como comando de compilação e `dist` como diretório de saída. Configure Node.js 22. Não há servidor, login do ChatGPT ou chave necessários para os comandos locais. O repositório por si só não publica o site; a integração do Cloudflare deve ser configurada na conta do proprietário.

## Onde editar

- `src/App.tsx`: painel, comandos e configurações.
- `src/styles.css`: identidade visual e versão móvel.
- `src/main.tsx`: inicialização do React.
- `public/favicon.svg`: ícone.

## Funcionalidades

- Comandos: ajuda, data, horário, adicionar tarefa, listar tarefas e preparar pesquisa no Google.
- Lista de tarefas: adicionar, concluir, reabrir e excluir.
- Voz: selecionar uma voz oferecida pelo aparelho, ajustar velocidade e tom, ouvir amostra e silenciar.
- Personalidades: calmo, animado, brincalhão, profissional, firme e direto. Alteram o texto dos comandos locais. Não representam uma IA conectada.
- Preferências e tarefas salvas no navegador; sem sincronização entre aparelhos.

## Limitações atuais

A inteligência artificial ainda **não está conectada**. Perguntas livres recebem uma mensagem explicando essa condição. O reconhecimento de voz depende do navegador e de HTTPS (ou localhost). Alguns navegadores enviam o áudio ao seu serviço de reconhecimento. A escuta exige página aberta e autorização do microfone; não substitui Siri/Alexa com tela bloqueada. As vozes são as disponíveis no dispositivo, e os controles de tom podem variar por voz. Não há notificações com o site fechado, ações em contas externas, memória de IA ou login independente por e-mail nesta versão.

## Próximas etapas

1. Conectar IA no servidor, com chave secreta fora do código e do navegador.
2. Criar login por e-mail/senha e sincronizar tarefas/preferências em banco com acesso por usuário.
3. Adicionar memória revisável, registro de ações e confirmação de ações externas.
4. Se necessário, criar aplicativo para recursos em segundo plano.

Não coloque chaves, senhas ou dados de clientes no repositório. Arquivos `.env*` estão ignorados.

Desenvolvido para Diogo Eduardo da Luz Ferreira — Luz Vante.

## Conversa e histórico

A conversa usa `/api/chat` com Workers AI, configurado pelo binding `AI` em `wrangler.jsonc`. O histórico das últimas 100 mensagens fica no navegador (localStorage), sem sincronização entre dispositivos. Os botões permitem pesquisar, apagar o histórico, ouvir novamente, pedir revisão da resposta escolhida e salvar a resposta como tarefa. A revisão envia o contexto até aquela resposta, sem usar mensagens posteriores. A IA pode fornecer uma nova resposta corrigida; não altera mensagens antigas nem o próprio código.

## Voz natural masculina (opcional)

O endpoint `/api/speech` gera MP3 em português com as opções Onyx e Echo. A voz é sintetizada por IA. Sem a credencial, essas opções ficam desativadas e o app continua oferecendo as vozes masculinas compatíveis do navegador.

Para ativar, configure `OPENAI_API_KEY` como **segredo** do ambiente de produção no projeto Cloudflare Pages e faça uma nova implantação. Use uma chave da API OpenAI com créditos disponíveis. Não coloque a chave no GitHub, no código do frontend, nem em variável com prefixo `VITE_`. O uso de áudio é cobrado pela API e não está incluído no ChatGPT Plus. Defina limites de gasto na conta da API. A chave permanece no servidor.

Teste em Configurações → Voz masculina → Onyx/Echo → Ouvir amostra. O navegador pode exigir um clique para liberar reprodução; nesse caso use Ouvir novamente. Velocidade funciona nos dois modos; o controle de tom funciona apenas na voz local. Parar áudio cancela reprodução e geração pendente.

## Lembretes e alarmes

Em Minhas tarefas, escolha data/hora e repetição (uma vez, diária ou semanal). Clique em **Ativar alertas e testar som**: a permissão de notificação é solicitada somente nesse clique e o sinal sonoro do alarme é liberado. A tela mostra avisos mesmo sem permissão. O som respeita o alto-falante do aplicativo; a fala depende de uma voz disponível.

Com a página aberta e o aparelho acordado, o relógio verifica vencimentos a cada segundo. Ao voltar à página ou reabrir o site, verifica também lembretes vencidos que não foram avisados. O navegador pode atrasar verificações em abas inativas; não há garantia de precisão ao segundo. Sem a página aberta não existe disparo do Ciço: não foi configurado um serviço de push ou agendador remoto.

Os alertas ficam salvos até serem dispensados, concluídos ou adiados cinco minutos. A recorrência mantém o horário local e salta ocorrências antigas para evitar uma sequência de alertas atrasados. Concluir um alerta recorrente mantém a próxima ocorrência; marcar a tarefa como concluída interrompe a série. Web Locks reduz duplicação do disparo entre abas compatíveis.

Também é possível digitar `me lembre de estudar em 10 minutos`, `me lembre de estudar amanhã às 14:30` ou `alarme para estudar às 18:00`. Se o pedido não tiver um horário reconhecido, o app pede um horário em vez de prometer um aviso.

Use **Exportar para agenda** para baixar um arquivo `.ics`, importá-lo no calendário e configurar notificações no aplicativo de agenda. O Ciço não controla o disparo feito pelo calendário e alguns aplicativos podem ignorar o alarme importado.


## Editor de arte gratuito

O botão **criar tela da imagem** abre um editor local: envio de PNG/JPG/WebP (até 10 MB), remoção de fundo claro por luminosidade, traços pretos, ajuste manual de rotação, recorte e centralização com margem transparente. O PNG pode ser exportado com lado maior de 1600, 2400 ou 3600 pixels. As imagens não saem do aparelho; não usa API nem créditos. O comando `criar tela da imagem` no chat também abre a tela.

Não é o gerador de imagens do ChatGPT: não redesenha letras, recupera detalhes perdidos, corrige perspectiva nem alinha elementos internos individualmente. Ampliar o PNG não cria detalhe novo. Prefira imagens nítidas com traços escuros e fundo claro, ajuste a intensidade e confira a prévia. A referência é reduzida a no máximo 3000 pixels no lado maior para limitar o processamento no navegador.
