let cardContainer = document.querySelector(".card-container");
let campoBusca = document.querySelector("#campo-busca");
let botaoBusca = document.querySelector("#botao-busca");

let dados = [];

async function buscarDados(){
    let resposta = await fetch("data.json");
    dados = await resposta.json()
    exibirMensagemInicial();
}

function exibirMensagemInicial() {
    cardContainer.innerHTML = `<p class="initial-message">Repositório de conhecimento inicializado. Execute uma busca para consultar os artefatos.</p>`;
}

buscarDados();

function realizarBusca() {
    let textoBusca = campoBusca.value.toLowerCase().trim();

    if (textoBusca === "") {
        exibirMensagemInicial();
        return;
    }

    let dadosFiltrados = dados.filter((dado) => {
        return dado.nome.toLowerCase().includes(textoBusca) ||
               dado.descricao.toLowerCase().includes(textoBusca);
    });
    renderizarCards(dadosFiltrados);
}

botaoBusca.addEventListener("click", realizarBusca);

campoBusca.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        realizarBusca();
    }
});

function renderizarCards(dados){
    cardContainer.innerHTML = "";
    if(dados.length === 0){
        cardContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        return;
    }

    for (let dado of dados){
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <p>${dado.ano}</p>
        <p>${dado.descricao}</p>
        <a href="${dado.link}" target="_blank">Saiba mais</a>
        `
        
        cardContainer.appendChild(article);
    }
    

}
