const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
let buttonModal =document.querySelectorAll("modalBtn")

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                    
                    <button  class="type ${pokemon.type}" data-number="${pokemon.number}" data-name="${pokemon.name}" class="modalBtn" >details</button>
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>

    `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
    attachModalEvents();
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

function attachModalEvents() {
  const modalButtons = document.querySelectorAll('.pokemon .type[data-number][data-name]'); // Seleciona apenas os botões de detalhe
  modalButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const pokemonNumber = event.target.getAttribute('data-number');
      const pokemonName = event.target.getAttribute('data-name');
      
      // Preenche a modal com o número e o nome do Pokémon
      document.getElementById('modal-number').textContent = `Número: #${pokemonNumber}`;
      document.getElementById('modal-name').textContent = `Nome: ${pokemonName}`;
      
      // Exibe a modal
      document.getElementById('pokemon-modal').style.display = 'block';
    });
  });
}

// Chame a função para configurar os eventos após o carregamento de novos Pokémon
loadPokemonItens(offset, limit);
attachModalEvents(); // Garante que a cada carregamento os botões tenham eventos

// Fecha a modal quando o usuário clicar no "X"
document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('pokemon-modal').style.display = 'none';
});

// Fecha a modal se o usuário clicar fora da modal
window.addEventListener('click', (event) => {
  if (event.target === document.getElementById('pokemon-modal')) {
      document.getElementById('pokemon-modal').style.display = 'none';
  }
});

