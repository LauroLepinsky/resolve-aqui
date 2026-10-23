# Resolve Aqui

Plataforma digital cívica para participação cidadã e controle social sobre a prestação de serviços públicos municipais.

Protótipo desenvolvido na disciplina **Engenharia de Software III** do curso de Análise e Desenvolvimento de Sistemas da Fatec Itapetininga, por Gustavo Lepinsk Carvalho e Lauro Isaac Ferreira Lepinsky.

## O que o protótipo faz

- **Validação pela ouvidoria**: toda reclamação nova fica "Aguardando validação" e só aparece para os outros moradores depois de aprovada. A ouvidoria também pode recusar, informando o motivo.
- **Lista pública de reclamações**, com busca e filtros por bairro, categoria e situação, ordenada pelas mais recentes ou pelas mais apoiadas.
- **Cadastro e login** de munícipes.
- **Minhas reclamações**: o munícipe acompanha tudo o que enviou, inclusive as reclamações aguardando validação e as recusadas, com o motivo.
- **Registro de reclamação** com categoria, bairro, endereço, descrição, foto opcional (reduzida automaticamente antes de salvar) e local opcional marcado no mapa. O mapa abre no bairro escolhido e, ao clicar, o endereço aproximado do ponto é acrescentado à descrição. Ao escolher categoria e bairro, o sistema mostra reclamações parecidas já publicadas, para o morador apoiar a existente em vez de repetir.
- **Apoio público**: cada munícipe pode apoiar uma reclamação uma vez, e o total fica visível para todos.
- **Comentários** entre munícipes e respostas oficiais da ouvidoria.
- **Andamento** de cada reclamação (Aberta, Em análise, Em execução, Resolvida), com a data de cada etapa e a explicação da ouvidoria em cada mudança.
- **Perfil da ouvidoria**, que pode atualizar a situação das reclamações.
- **Painel público** com totais, tempo médio de resolução, reclamações por bairro e por categoria e as mais apoiadas.

## Mapa e localização

O mapa usa três serviços gratuitos, sem cadastro nem chave de acesso:

- **Leaflet**: biblioteca JavaScript que desenha o mapa, o zoom e o marcador.
- **OpenStreetMap**: fornece as imagens das ruas (mapa colaborativo, feito por voluntários).
- **Nominatim**: serviço de busca de endereços do OpenStreetMap. Quando o morador clica no mapa, devolve o endereço aproximado do ponto, que é acrescentado à descrição.

A posição de cada bairro fica no arquivo `js/bairros-mapa.js`, uma tabela fixa com latitude e longitude de 153 dos 163 bairros. Ela foi gerada uma única vez: cada bairro foi procurado pelo nome no Nominatim e, quando não encontrado, sua posição foi calculada a partir de ruas do bairro listadas no **ViaCEP** (base pública de CEPs dos Correios). Por ser uma tabela local, o mapa vai até o bairro escolhido na hora, sem consultar nenhum servidor. Os bairros sem posição conhecida abrem o mapa no centro da cidade, com um aviso para o morador aproximar manualmente.

Os serviços públicos do OpenStreetMap têm limites de uso (no máximo uma busca por segundo no Nominatim) e exigem o crédito "© colaboradores do OpenStreetMap", exibido no canto do mapa. Para uso em produção, com muitos acessos, seria necessário contratar um provedor de mapas ou hospedar um servidor próprio.

O mapa precisa que o site seja aberto por um endereço `http://` ou `https://` (Live Server, GitHub Pages ou Vercel). Abrindo o `index.html` direto pelo arquivo, o servidor do OpenStreetMap bloqueia as imagens.

## Tecnologias

- HTML, CSS e JavaScript, sem frameworks
- Mapa com Leaflet e OpenStreetMap, busca de endereços com Nominatim (todos gratuitos e sem chave de acesso)- Banco de dados relacional modelado em SQL (`database/schema.sql`)
- Versionamento no GitHub e hospedagem na Vercel

Nesta versão de protótipo, os dados ficam no `localStorage` do navegador, simulando as tabelas do banco. Assim o sistema roda como site estático, sem servidor. O arquivo `js/data.js` concentra todo o acesso aos dados, para que possa ser trocado por chamadas a uma API real sem mudar as páginas.

## Contas de demonstração

Senha de todas: `demo1234`

| E-mail            | Perfil                                                         |
| ----------------- | -------------------------------------------------------------- |
| `maria@demo.com`  | Munícipe                                                       |
| `jose@demo.com`   | Munícipe                                                       |
| `gestor@demo.com` | Ouvidoria (valida reclamações novas e altera a situação delas) |

Para apagar o que foi criado e voltar aos dados de exemplo, use o botão **Restaurar dados de demonstração** no rodapé.

## Como executar

Basta abrir o `index.html` no navegador. Para servir localmente:

```bash
npx serve .
```

## Publicar na Vercel

1. Em vercel.com, clique em **Add New > Project** e importe este repositório.
2. Em **Framework Preset**, escolha **Other**. Não é preciso comando de build.
3. Clique em **Deploy**.

## Estrutura

```
index.html        Lista pública de reclamações
nova.html         Registro de reclamação
reclamacao.html   Detalhe, apoio, comentários e andamento
entrar.html       Login e cadastro
painel.html       Painel com números gerais
validacao.html    Fila de validação da ouvidoria
minhas.html       Reclamações do usuário conectado
css/style.css     Estilos
js/data.js        Camada de dados (localStorage)
js/ui.js          Funções de interface compartilhadas
js/bairros-mapa.js  Posição de cada bairro no mapa
js/*.js           Script de cada página
database/schema.sql  Modelo do banco de dados
```

## Limitações conhecidas

- Os dados não são compartilhados entre navegadores, porque ficam salvos localmente.
- A autenticação é apenas demonstrativa e não deve ser usada em produção.
- A lista de bairros vem da base de CEPs dos Correios e pode não coincidir exatamente com a divisão oficial da prefeitura.
- As reclamações de demonstração são fictícias, embora usem nomes reais de ruas e bairros.
- As posições dos bairros e os endereços do mapa são aproximados. Dez bairros não têm posição conhecida e abrem o mapa no centro da cidade.
