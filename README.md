# Sistema de Pedidos e Itinerário

Sistema simples em HTML e JavaScript para cadastro de pedidos e geração de itinerário de expedição com consolidação de produtos.

## Funcionalidades

### 🧾 1. Cadastro de Pedidos
- Formulário para inserir código do pedido e nome do cliente no formato: `123 - Maria Lima`
- Adição de múltiplos produtos por pedido (nome do produto e quantidade)
- Validação de dados e prevenção de códigos duplicados
- Armazenamento local usando localStorage

### 🗃️ 2. Armazenamento dos Dados
Os dados são salvos no localStorage do navegador com a seguinte estrutura:
```json
{
  "id": 1234567890,
  "codigo": "123",
  "cliente": "Maria Lima",
  "produtos": [
    {"nome": "5L Detergente Limão", "quantidade": 10},
    {"nome": "5L Detergente Neutro", "quantidade": 5}
  ],
  "data_criacao": "2024-01-15T10:30:00.000Z"
}
```

### 📋 3. Geração de Itinerário
- Seleção de múltiplos pedidos via checkboxes
- Exibição detalhada dos pedidos selecionados
- **Consolidação automática dos produtos** somando as quantidades
- Exportação do itinerário em formato de texto

## Como Usar

1. **Abra o arquivo `index.html` no navegador**

2. **Cadastre um pedido:**
   - Digite o código e cliente: `123 - Maria Lima`
   - Adicione produtos: `5L Detergente Limão` - `10` unidades
   - Clique em "Adicionar Produto" para mais itens
   - Clique em "Salvar Pedido"

3. **Gere o itinerário:**
   - Selecione os pedidos desejados na seção "Gerar Itinerário"
   - Clique em "Gerar Itinerário"
   - Veja a consolidação automática dos produtos
   - Opcionalmente, exporte como arquivo de texto

## Exemplo de Resultado

```
Itinerário de Expedição:

1. 123 - Maria Lima:
   - 5L Detergente Limão - 10 unidades
   - 5L Detergente Neutro - 10 unidades

2. 124 - João da Serra:
   - 5L Detergente Limão - 10 unidades
   - 5L Detergente Neutro - 10 unidades

Produtos que saíram hoje:
- 20 5L Detergente Limão
- 20 5L Detergente Neutro
```

## Arquivos

- `index.html` - Interface do usuário
- `script.js` - Lógica da aplicação
- `README.md` - Documentação

## Tecnologias Utilizadas

- HTML5
- JavaScript ES6+ (Classes, LocalStorage)
- Sem dependências externas
- Sem estilização CSS (conforme solicitado)

## Funcionalidades Extras

- ✅ Validação de formato do código-cliente
- ✅ Prevenção de códigos duplicados
- ✅ Adição/remoção dinâmica de produtos
- ✅ Persistência de dados no navegador
- ✅ Exportação de itinerário como arquivo
- ✅ Consolidação automática de produtos
- ✅ Interface responsiva básica