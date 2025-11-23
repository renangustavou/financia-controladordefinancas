let cardContainer = document.querySelector(".card-container");
let campoBusca = document.querySelector("#campo-busca");
let searchTitle = document.querySelector(".search-title");

let dados = [];
let rawValue = "000"; // Armazena o valor bruto como string de dígitos

async function buscarDados() {
    try {
        let resposta = await fetch("data.json");
        dados = await resposta.json();
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        cardContainer.innerHTML = "<p>Erro ao carregar os dados. Tente novamente mais tarde.</p>";
    }
}

buscarDados();
realizarBusca(); // Realiza uma busca inicial com o valor 0,00

function formatCurrency(value) {
    let intPart = value.slice(0, -2).padStart(1, '0');
    let decimalPart = value.slice(-2);
    return `${intPart},${decimalPart}`;
}

function updateFieldValue() {
    campoBusca.value = formatCurrency(rawValue);
    realizarBusca();
}

campoBusca.addEventListener("keydown", (event) => {
    event.preventDefault(); // Impede a inserção de caracteres diretamente

    if (event.key >= '0' && event.key <= '9') {
        if (rawValue.length < 10) { // Limita o número de dígitos
            rawValue += event.key;
            if (rawValue.length > 3 && rawValue.startsWith('0')) {
                rawValue = rawValue.substring(1); // Remove zero à esquerda
            }
        }
    } else if (event.key === "Backspace") {
        if (rawValue.length > 3) {
            rawValue = rawValue.slice(0, -1);
        } else {
            rawValue = "0" + rawValue.slice(0, -1);
            if (rawValue.length < 3) {
                rawValue = "0" + rawValue;
            }
        }
    }
    
    updateFieldValue();
});


function realizarBusca() {
    let valorNumerico = parseFloat(campoBusca.value.replace(',', '.'));

    if (isNaN(valorNumerico)) {
        renderizarCards([]);
        return;
    }

    let itensSelecionados = encontrarItens(valorNumerico);
    renderizarCards(itensSelecionados);
}

function encontrarItens(orcamento) {
    let itensDentroDoOrcamento = dados.filter(item => item.valor <= orcamento);
    return itensDentroDoOrcamento.sort((a, b) => b.valor - a.valor);
}

function renderizarCards(dadosFiltrados) {
    cardContainer.innerHTML = "";
    if (dadosFiltrados.length === 0 && parseFloat(campoBusca.value.replace(',', '.')) > 0) {
        cardContainer.innerHTML = "<p>Nenhum resultado encontrado para este orçamento.</p>";
    } else if (dadosFiltrados.length === 0) {
        // Não mostra mensagem se o orçamento for 0,00 e não houver itens
    }

    for (let dado of dadosFiltrados) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
        <h2>${dado.emoji}</h2>
        <p class="lazer-valor">R$ ${dado.valor.toFixed(2).replace('.', ',')}</p>
        <p class="lazer-nome">${dado.lazer}</p>
        
        `;
        cardContainer.appendChild(article);
    }
}
