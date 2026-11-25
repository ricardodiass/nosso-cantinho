# Nosso Cantinho ❤️

Site romântico estático feito com HTML, CSS e JavaScript puro (ES Modules). Não utiliza backend, banco de dados, framework ou dependências de instalação.

## Requisitos

- Navegador moderno.
- Python 3 para executar um servidor local simples (já costuma estar disponível em distribuições Linux).
- Conexão com a internet para carregar as fontes do Google Fonts e o vídeo incorporado do YouTube. Sem conexão, o site utiliza fontes alternativas, mas o vídeo não será reproduzido.

## Executar localmente no Ubuntu

No terminal, dentro da pasta do projeto:

```bash
python3 -m http.server 8000
```

Abra no navegador:

```text
http://localhost:8000
```

Para encerrar o servidor, volte ao terminal e pressione `Ctrl + C`.

> Não abra `index.html` diretamente com `file://`. Os módulos JavaScript precisam ser servidos por HTTP/HTTPS.

## Personalização

As informações ficam centralizadas em `js/data/site-data.js`.

1. Troque `herName` e `myName` pelos nomes de vocês.
2. Configure `relationshipStart` com a data e hora do início do namoro, no formato `YYYY-MM-DDTHH:mm:ss`. Exemplo: `2024-01-01T00:00:00`. O horário é interpretado no fuso local do navegador.
3. Substitua os textos da carta e da declaração final.
4. Adicione acontecimentos em `timeline`, motivos em `reasons`, fotografias em `gallery` e mensagens em `surprises`.
5. Coloque as fotos em `assets/images/` e informe seus caminhos relativos ao projeto.
6. Coloque o áudio em `assets/audio/` e preencha `music.file`. Use somente arquivos que você tenha direito de utilizar.

Os exemplos de motivos e sonhos em `site-data.js` são editáveis. A linha do tempo e a galeria começam vazias para não inventar acontecimentos nem fotografias.

### Exemplo de acontecimento

```javascript
{
  id: "primeiro-encontro",
  date: "15/03/2024",
  title: "Nosso primeiro encontro",
  description: "Conte aqui como foi esse dia.",
  photo: "assets/images/timeline/primeiro-encontro.jpg",
  placeholder: false,
}
```

### Exemplo de foto na galeria

```javascript
{
  id: "momento-001",
  src: "assets/images/gallery/foto-001.jpg",
  caption: "Uma lembrança especial",
  date: "15/03/2024",
  ratio: "4 / 5",
}
```

Também é possível inserir uma frase entre fotografias:

```javascript
{ quote: "Você é meu lugar favorito." },
```

## Armazenamento dos sonhos

Os sonhos adicionados ou marcados como realizados são salvos no `localStorage` do navegador. Isso significa que os dados ficam naquele navegador e dispositivo; não há sincronização automática entre aparelhos. Limpar os dados do navegador pode apagar essa lista.

## Compatibilidade com celular

O layout utiliza abordagem responsiva, menu recolhível em telas menores, alvos de toque maiores, galeria em colunas adaptáveis, navegação por botões e gesto horizontal na visualização ampliada, além de respeito à preferência do sistema por movimento reduzido.

Teste em largura de celular usando as ferramentas de desenvolvedor do navegador e, principalmente, em um aparelho real.

## Publicar gratuitamente no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie os arquivos deste projeto para a branch `main`.
3. No repositório, acesse **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/ (root)` e salve.
6. Aguarde a publicação indicada pelo GitHub Pages. O endereço ficará no formato `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

O site está marcado com `noindex` para desencorajar indexação por mecanismos de busca. Isso não restringe o acesso nem torna o site privado. Qualquer pessoa com o endereço poderá acessá-lo; não publique informações sensíveis.

## Verificações básicas

Para verificar a sintaxe dos módulos JavaScript com Node.js:

```bash
find js -name '*.js' -print0 | while IFS= read -r -d '' file; do node --check "$file" || exit 1; done
```
