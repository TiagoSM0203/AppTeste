// Sistema de Gerenciamento de Pedidos e Itinerário
class SistemaPedidos {
    constructor() {
        this.pedidos = this.carregarPedidos();
        this.inicializarEventos();
        this.atualizarListaPedidos();
        this.atualizarSelecaoPedidos();
    }

    // Carrega pedidos do localStorage
    carregarPedidos() {
        const pedidosStorage = localStorage.getItem('pedidos');
        return pedidosStorage ? JSON.parse(pedidosStorage) : [];
    }

    // Salva pedidos no localStorage
    salvarPedidos() {
        localStorage.setItem('pedidos', JSON.stringify(this.pedidos));
    }

    // Inicializa todos os eventos da aplicação
    inicializarEventos() {
        // Evento para adicionar produto no formulário
        document.getElementById('adicionar-produto').addEventListener('click', () => {
            this.adicionarCampoProduto();
        });

        // Evento para salvar pedido
        document.getElementById('pedido-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarPedido();
        });

        // Evento para gerar itinerário
        document.getElementById('gerar-itinerario').addEventListener('click', () => {
            this.gerarItinerario();
        });
    }

    // Adiciona um novo campo de produto no formulário
    adicionarCampoProduto() {
        const container = document.getElementById('produtos-container');
        const novoProduto = document.createElement('div');
        novoProduto.className = 'produto-item';
        novoProduto.innerHTML = `
            <label>Produto:</label>
            <input type="text" class="produto-nome" placeholder="5L Detergente Neutro" required>
            <label>Quantidade:</label>
            <input type="number" class="produto-quantidade" placeholder="5" min="1" required>
            <button type="button" class="remover-produto">Remover</button>
        `;
        
        // Adiciona evento para remover produto
        novoProduto.querySelector('.remover-produto').addEventListener('click', () => {
            novoProduto.remove();
        });
        
        container.appendChild(novoProduto);
    }

    // Extrai código do pedido e nome do cliente
    extrairCodigoCliente(codigoClienteStr) {
        const partes = codigoClienteStr.split(' - ');
        if (partes.length !== 2) {
            throw new Error('Formato inválido. Use: "123 - Nome do Cliente"');
        }
        return {
            codigo: partes[0].trim(),
            cliente: partes[1].trim()
        };
    }

    // Coleta produtos do formulário
    coletarProdutos() {
        const produtoItems = document.querySelectorAll('.produto-item');
        const produtos = [];
        
        produtoItems.forEach(item => {
            const nome = item.querySelector('.produto-nome').value.trim();
            const quantidade = parseInt(item.querySelector('.produto-quantidade').value);
            
            if (nome && quantidade > 0) {
                produtos.push({ nome, quantidade });
            }
        });
        
        return produtos;
    }

    // Salva um novo pedido
    salvarPedido() {
        try {
            const codigoClienteInput = document.getElementById('codigo-cliente').value.trim();
            const { codigo, cliente } = this.extrairCodigoCliente(codigoClienteInput);
            const produtos = this.coletarProdutos();

            if (produtos.length === 0) {
                alert('Adicione pelo menos um produto ao pedido!');
                return;
            }

            // Verifica se já existe pedido com o mesmo código
            if (this.pedidos.some(p => p.codigo === codigo)) {
                alert('Já existe um pedido com este código!');
                return;
            }

            const novoPedido = {
                id: Date.now(),
                codigo: codigo,
                cliente: cliente,
                produtos: produtos,
                data_criacao: new Date().toISOString()
            };

            this.pedidos.push(novoPedido);
            this.salvarPedidos();
            this.limparFormulario();
            this.atualizarListaPedidos();
            this.atualizarSelecaoPedidos();
            
            alert('Pedido salvo com sucesso!');
        } catch (error) {
            alert('Erro: ' + error.message);
        }
    }

    // Limpa o formulário após salvar
    limparFormulario() {
        document.getElementById('pedido-form').reset();
        
        // Remove produtos extras, mantendo apenas o primeiro
        const container = document.getElementById('produtos-container');
        const produtoItems = container.querySelectorAll('.produto-item');
        for (let i = 1; i < produtoItems.length; i++) {
            produtoItems[i].remove();
        }
    }

    // Atualiza a lista de pedidos cadastrados
    atualizarListaPedidos() {
        const container = document.getElementById('lista-pedidos');
        
        if (this.pedidos.length === 0) {
            container.innerHTML = '<p>Nenhum pedido cadastrado.</p>';
            return;
        }

        let html = '<h3>Pedidos:</h3>';
        this.pedidos.forEach(pedido => {
            html += `
                <div style="border: 1px solid #ccc; padding: 10px; margin: 5px 0;">
                    <strong>${pedido.codigo} - ${pedido.cliente}</strong><br>
                    <small>Data: ${new Date(pedido.data_criacao).toLocaleString('pt-BR')}</small><br>
                    <strong>Produtos:</strong>
                    <ul>
                        ${pedido.produtos.map(p => `<li>${p.nome} - ${p.quantidade} unidades</li>`).join('')}
                    </ul>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    // Atualiza a lista de seleção de pedidos para o itinerário
    atualizarSelecaoPedidos() {
        const container = document.getElementById('selecao-pedidos');
        
        if (this.pedidos.length === 0) {
            container.innerHTML = '<p>Nenhum pedido disponível para seleção.</p>';
            return;
        }

        let html = '';
        this.pedidos.forEach(pedido => {
            html += `
                <div>
                    <input type="checkbox" id="pedido-${pedido.id}" value="${pedido.id}">
                    <label for="pedido-${pedido.id}">
                        ${pedido.codigo} - ${pedido.cliente} 
                        (${pedido.produtos.length} produto${pedido.produtos.length > 1 ? 's' : ''})
                    </label>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    // Coleta pedidos selecionados
    obterPedidosSelecionados() {
        const checkboxes = document.querySelectorAll('#selecao-pedidos input[type="checkbox"]:checked');
        const idsSelecionados = Array.from(checkboxes).map(cb => parseInt(cb.value));
        return this.pedidos.filter(pedido => idsSelecionados.includes(pedido.id));
    }

    // Consolida produtos de múltiplos pedidos
    consolidarProdutos(pedidosSelecionados) {
        const produtosConsolidados = {};
        
        pedidosSelecionados.forEach(pedido => {
            pedido.produtos.forEach(produto => {
                if (produtosConsolidados[produto.nome]) {
                    produtosConsolidados[produto.nome] += produto.quantidade;
                } else {
                    produtosConsolidados[produto.nome] = produto.quantidade;
                }
            });
        });
        
        return produtosConsolidados;
    }

    // Gera o itinerário de expedição
    gerarItinerario() {
        const pedidosSelecionados = this.obterPedidosSelecionados();
        
        if (pedidosSelecionados.length === 0) {
            alert('Selecione pelo menos um pedido para gerar o itinerário!');
            return;
        }

        const container = document.getElementById('resultado-itinerario');
        let html = '<h3>Itinerário de Expedição:</h3>';
        
        // Lista detalhada dos pedidos
        pedidosSelecionados.forEach((pedido, index) => {
            html += `
                <div style="margin-bottom: 15px;">
                    <strong>${index + 1}. ${pedido.codigo} - ${pedido.cliente}:</strong>
                    <ul>
                        ${pedido.produtos.map(p => `<li>${p.nome} - ${p.quantidade} unidades</li>`).join('')}
                    </ul>
                </div>
            `;
        });
        
        // Produtos consolidados
        const produtosConsolidados = this.consolidarProdutos(pedidosSelecionados);
        html += '<hr><h3>Produtos que saíram hoje:</h3><ul>';
        
        Object.entries(produtosConsolidados).forEach(([produto, quantidade]) => {
            html += `<li><strong>${quantidade} ${produto}</strong></li>`;
        });
        
        html += '</ul>';
        
        // Botão para exportar
        html += `
            <hr>
            <button onclick="sistema.exportarItinerario()">Exportar Itinerário como Texto</button>
        `;
        
        container.innerHTML = html;
    }

    // Exporta o itinerário como texto
    exportarItinerario() {
        const pedidosSelecionados = this.obterPedidosSelecionados();
        
        if (pedidosSelecionados.length === 0) {
            alert('Nenhum pedido selecionado!');
            return;
        }

        let texto = 'ITINERÁRIO DE EXPEDIÇÃO\n';
        texto += '========================\n\n';
        texto += `Data: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
        
        // Pedidos detalhados
        texto += 'PEDIDOS:\n';
        pedidosSelecionados.forEach((pedido, index) => {
            texto += `${index + 1}. ${pedido.codigo} - ${pedido.cliente}:\n`;
            pedido.produtos.forEach(produto => {
                texto += `   - ${produto.nome} - ${produto.quantidade} unidades\n`;
            });
            texto += '\n';
        });
        
        // Produtos consolidados
        const produtosConsolidados = this.consolidarProdutos(pedidosSelecionados);
        texto += 'PRODUTOS QUE SAÍRAM HOJE:\n';
        Object.entries(produtosConsolidados).forEach(([produto, quantidade]) => {
            texto += `- ${quantidade} ${produto}\n`;
        });
        
        // Cria e baixa o arquivo
        const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `itinerario_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Inicializa o sistema quando a página carrega
let sistema;
document.addEventListener('DOMContentLoaded', () => {
    sistema = new SistemaPedidos();
});