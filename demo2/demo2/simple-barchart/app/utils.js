// Pour le tableau de donnée depuis un fichier Json
export function maxi(res) {
    let tmp = 0;
    for (let i = 0; i < res.data.length; i++) {
        // on force à convertir les données en json en entier
        for (let j = 0; j < res.data[i].length; j++) {

            if (tmp < parseInt(res.data[i][j].value)) {
                tmp = res.data[i][j].value;
            }
        }
    }
    return tmp;
}
// Pour le tableau de donnée depuis un fichier js
export function maxiData(data) {
    let tmp = 0;

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (tmp < data[i][j].value) {
                tmp = data[i][j].value;
            }
        }
    }
    return tmp;
}

export function compteur(start, end) {
    
        let i = start;
        let timer = setInterval(function () {

            document.querySelector("#compteur").textContent = i++;
            if (i > end) {
                clearInterval(timer);
                d3.select("#compteur").attr("fill", "green");
            }

        }, 2000);
        return timer;
    
}