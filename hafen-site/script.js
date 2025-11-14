// script.js

// Variável global para armazenar os itens do carrinho
let carrinho = [];

// Função principal para gerenciar a navegação entre as seções
function navigateToSection(sectionId) {
    // 1. Esconder todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // 2. Mostrar a seção desejada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // 3. Atualizar o estado 'active' nos links de navegação
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active-link');
        } else {
            link.classList.remove('active-link');
        }
    });

    // Rolar para o topo da página para melhor experiência
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Adicionar event listeners aos links de navegação e botões
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Prevenir o comportamento padrão do link (navegação via URL)
            e.preventDefault(); 
            
            // Obter o ID da seção alvo
            const sectionId = link.getAttribute('data-section');
            
            // Navegar para a seção
            if (sectionId) {
                navigateToSection(sectionId);
            }
        });
    });

    // Adicionar event listener para o formulário de contato
    const formContato = document.querySelector('.form-contato');
    if (formContato) {
        formContato.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            this.reset();
            navigateToSection('hero');
        });
    }

    // Garantir que a seção inicial (hero) esteja ativa ao carregar
    navigateToSection('hero');
    
    // Inicializa a UI do carrinho
    atualizarCarrinhoUI();
});

// --- Funções de Carrinho ---

function atualizarCarrinhoUI() {
    const itensCarrinhoDiv = document.getElementById('itens-carrinho');
    const totalCarrinhoSpan = document.getElementById('total-carrinho');
    const cartCountSpan = document.getElementById('cart-count');
    let total = 0;
    let itemCount = 0;

    // Verificar se os elementos existem antes de manipular
    if (!itensCarrinhoDiv || !totalCarrinhoSpan || !cartCountSpan) {
        console.error('Elementos do carrinho não encontrados');
        return;
    }

    itensCarrinhoDiv.innerHTML = ''; // Limpa o conteúdo atual

    if (carrinho.length === 0) {
        itensCarrinhoDiv.innerHTML = '<p class="texto-corrido" style="text-align: center;">Seu carrinho está vazio.</p>';
    } else {
        carrinho.forEach((item, index) => {
            const itemTotal = item.preco * item.quantidade;
            total += itemTotal;
            itemCount += item.quantidade;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item-carrinho');
            itemDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 1rem 0;">
                    <p class="produto-nome" style="font-size: 16pt; margin: 0;">${item.nome}</p>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <p class="produto-preco" style="margin: 0;">R$ ${itemTotal.toFixed(2).replace('.', ',')}</p>
                        <button class="quantidade-btn" onclick="removerItem(${index})" style="width: 25px; height: 25px; font-size: 0.8rem;">X</button>
                    </div>
                </div>
                <p style="font-size: 12pt; color: var(--cinza-escuro); margin-top: 0.5rem;">Quantidade: ${item.quantidade}</p>
            `;
            itensCarrinhoDiv.appendChild(itemDiv);
        });
    }

    totalCarrinhoSpan.textContent = total.toFixed(2).replace('.', ',');
    cartCountSpan.textContent = itemCount;
}

function adicionarAoCarrinho(nome, preco, idProduto) {
    const inputId = `quantidade-${idProduto}`;
    const quantidadeInput = document.getElementById(inputId);
    
    // Verificar se o elemento existe
    if (!quantidadeInput) {
        console.error(`Elemento com ID ${inputId} não encontrado`);
        return;
    }
    
    // Garante que a quantidade seja pelo menos 1
    const quantidade = parseInt(quantidadeInput.value) || 1;

    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({ nome, preco, quantidade });
    }

    alert(`${quantidade}x ${nome} adicionado(s) ao carrinho!`);
    atualizarCarrinhoUI();
}

function adicionarAssinatura(nome, preco) {
    // Assinaturas são tratadas como um item único no carrinho para simplificar
    const itemExistente = carrinho.find(item => item.nome === nome && item.isSubscription);

    if (!itemExistente) {
        carrinho.push({ nome, preco, quantidade: 1, isSubscription: true });
        alert(`Assinatura ${nome} adicionada ao carrinho!`);
    } else {
        alert(`Você já tem a assinatura ${nome} no carrinho.`);
    }

    atualizarCarrinhoUI();
}

function removerItem(index) {
    if (index >= 0 && index < carrinho.length) {
        carrinho.splice(index, 1);
        atualizarCarrinhoUI();
    }
}

function aumentarQuantidade(idProduto) {
    const input = document.getElementById(`quantidade-${idProduto}`);
    if (input) {
        const currentValue = parseInt(input.value) || 0;
        input.value = currentValue + 1;
    }
}

function diminuirQuantidade(idProduto) {
    const input = document.getElementById(`quantidade-${idProduto}`);
    if (input) {
        const currentValue = parseInt(input.value) || 1;
        if (currentValue > 1) {
            input.value = currentValue - 1;
        }
    }
}

function calcularFrete() {
    const cepInput = document.getElementById('cep-frete');
    const resultadoDiv = document.getElementById('resultado-frete');
    
    // Verificar se os elementos existem
    if (!cepInput || !resultadoDiv) {
        console.error('Elementos de cálculo de frete não encontrados');
        return;
    }
    
    const cep = cepInput.value.replace(/\D/g, ''); // Remove não-dígitos
    
    if (cep.length === 8) {
        // Simulação de cálculo de frete baseado no CEP (apenas para demonstração)
        let valorFrete = 0;
        let prazo = '5-7 dias úteis';

        if (cep.startsWith('0') || cep.startsWith('1')) { // Exemplo: São Paulo
            valorFrete = 20.00;
            prazo = '2-3 dias úteis';
        } else if (cep.startsWith('9')) { // Exemplo: Sul
            valorFrete = 35.00;
            prazo = '4-6 dias úteis';
        } else {
            valorFrete = 25.00;
        }

        resultadoDiv.innerHTML = `Frete para ${cep}: R$ ${valorFrete.toFixed(2).replace('.', ',')} (${prazo})`;
    } else {
        resultadoDiv.innerHTML = 'Por favor, insira um CEP válido com 8 dígitos.';
    }
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio. Adicione itens antes de finalizar a compra.');
        return;
    }
    
    const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    alert(`Compra finalizada! Total: R$ ${total.toFixed(2).replace('.', ',')}. Redirecionando para o pagamento via PIX ou Mercado Pago... (Simulação)`);
    
    // Limpar carrinho após a compra (simulação)
    carrinho = [];
    atualizarCarrinhoUI();
    navigateToSection('hero'); // Volta para a página inicial
}

// Funções auxiliares para melhor experiência do usuário
function validarQuantidade(input) {
    const value = parseInt(input.value);
    if (isNaN(value) || value < 1) {
        input.value = 1;
    }
}

// Adicionar validação em tempo real para os inputs de quantidade
document.addEventListener('DOMContentLoaded', () => {
    const quantidadeInputs = document.querySelectorAll('.quantidade-input');
    quantidadeInputs.forEach(input => {
        input.addEventListener('change', function() {
            validarQuantidade(this);
        });
        
        input.addEventListener('blur', function() {
            validarQuantidade(this);
        });
    });
});
