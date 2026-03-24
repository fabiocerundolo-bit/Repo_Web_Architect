const btnTest = document.getElementById("btnTest");
const risultato = document.getElementById("risultato");
const elLettera = document.getElementById("lettera");

const PAROLASEGRETA = "CASA";
let parolaMostrata = [];

function inizializzaGioco(){
    let parolaGhost = "";

    PAROLASEGRETA.split("").forEach(lettera => {
        parolaGhost += "_ ";
        parolaMostrata.push("_");
    })
    // parolaGhost = PAROLASEGRETA.split("").fill("_").join(" ");
    risultato.innerHTML += `<h2 class='txtCenter'> ${parolaGhost} </h2>`
}

/**
 * 
 * @param {String} lettera 
 */
function controllaLettera(lettera){
    lettera = lettera.toUpperCase();

    risultato.innerHTML = "";

    for(let i = 0; i < PAROLASEGRETA.length; i++){
        if(PAROLASEGRETA[i] === lettera && parolaMostrata[i] != lettera){
            parolaMostrata[i] = lettera;
            parolaMostrata.forEach(lettera => {
                risultato.innerHTML += `${lettera} `;
            });
        }
    }
}

btnTest.addEventListener("click", function(){
    controllaLettera(elLettera.value);
})




document.addEventListener("DOMContentLoaded", inizializzaGioco)