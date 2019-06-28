import {
    maxi,
    compteur,
    maxiData
} from "./utils.js";
export default class SimpleBarChart {
    constructor(elId, titreChart, titreY, opts) {
        this._elId = elId;
        this._titreY = titreY;
        this._titreChart = titreChart;
        this._width = opts && opts.width ? opts.width : 1200;
        this._height = opts && opts.height ? opts.height : 600;
        this._barPadding = opts && opts.barPadding ? opts.barPadding : 2;
        this._colorStart = opts && opts.colorStart ? opts.colorStart : "white";
        this._colorEnd = opts && opts.colorEnd ? opts.colorEnd : "black";
    }

    get width() {
        return this._width;
    }

    set width(width) {
        this._width = width;
    }

    get height() {
        return this._height
    }

    set height(height) {
        this._height = height;
    }

    get titreY() {
        return this._titreY;
    }

    set titreY(titreY) {
        this._titreY = titreY;
    }

    get titreChart() {
        return this._titreChart;
    }

    set titreChart(titreChart) {
        this._titreChart = titreChart;
    }

    get colorStart() {
        return this._colorStart;
    }

    set colorStart(colorStart) {
        this._colorStart = colorStart;
    }

    get colorEnd() {
        return this._colorEnd;
    }

    set colorEnd(colorEnd) {
        this._colorEnd = colorEnd;
    }

    get barPadding() {
        return this._barPadding;
    }

    set barPadding(barPadding) {
        this._barPadding = barPadding;
    }

    get elId() {
        return this._elId;
    }
    set elId(elId) {
        this._elId = elId;
    }


    // Methode permettant l'affichage d'un bar chart depuis un fichier Json local
    drawChartJson() {
        // w: largeur | h: hauteur
        let w = this.width;
        let h = this.height;
        let barPadding = this.barPadding;
        let elId = this.elId;
        let colorStart = this.colorStart;
        let colorEnd = this.colorEnd;
        let titreY = this.titreY;
        let titreChart = this.titreChart;

        d3.json("donne.json?p=" + Math.random()).then(function (res) {

            const padding = {
                left: 150,
                right: 100,
                top: 100,
                bottom: 20
            }
            let maxData = maxi(res);
            let chartHeight = h - padding.top - padding.bottom;
            let index = 0;
            let date = new Date();
            const finChrono = date.getFullYear();
            const debutChrono = finChrono - res.data.length + 1;

            // Création de l'element a selectionné dans le Dom s'il n'existe pas
            if (!document.getElementById(elId)) {
                let div = document.createElement("div");
                div.setAttribute("id", elId);
                document.body.appendChild(div);
            }
            // document.getElementById(elId).innerHTML = "<br>";
            // Création de l'élément SVG
            let svg = d3.select(document.getElementById(elId))
                .append("svg")
                .attr("width", w)
                .attr("height", h);

            //Info donnée
            let tooltip = d3.select(document.getElementById(elId)).append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            let widthScale = d3.scaleLinear()
                .domain([0, maxData + maxData / 10])
                .range([0, w - padding.left - padding.right]);

            let yScale = d3.scaleBand()
                .range([0, chartHeight])
                .domain(res.data[index].map(d => d.name))

            //Axe des Abscisses
            let axis = d3.axisBottom()
                .tickSize(-h)
                .ticks(5)
                .scale(widthScale);



            let color = d3.scaleLinear()
                .domain([0, maxData])
                .range([colorStart, colorEnd]);

            svg.selectAll('rect')
                .data(res.data[index])
                .enter()
                .append('rect');



            const interval = d3.interval(() => {
                if (index >= res.data.length) {
                    interval.stop()
                }

                svg
                    .selectAll('rect')
                    .data(res.data[index])
                    .attr('x', (d, i) => {
                        return 0
                    })
                    .attr('y', (d, i) => {
                        if (index == 0) {
                            return i * (chartHeight / res.data[index].length) + 2
                        }
                        for (let j = 0; j < res.data[index - 1].length; j++) {
                            if (res.data[index - 1][j].name == d.name) {
                                return j * (chartHeight / res.data[index].length) + 2
                            }
                        }
                        return chartHeight
                    })
                    .attr('height', (d) => {
                        return chartHeight / res.data[index].length - 2
                    })
                    .attr('fill', (d) => {

                        return color(d.value)
                    })
                    .attr('transform', "translate(" + (padding.left) + "," + padding.top + ")")

                    .on("mouseover", (d, i) => {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html("" + d.value)
                            .style("left", (d3.event.pageX + 10) + "px")
                            .style("top", (d3.event.pageY - 50) + "px");
                    })
                    .on("mouseout", (d) => {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    })
                    .transition()
                    .duration(300)
                    .delay((d, i) => {
                        return i * 50
                    })
                    .attr('y', (d, i) => {
                        return i * (chartHeight / res.data[index].length) + 2
                    })
                    .attr('width', (d) => {
                        return widthScale(d.value)
                    })
                    .attr("stroke", (d) => {
                        if (d > (9 * maxData / 10)) {
                            return "red"
                        } else {
                            return "black"
                        }
                    })
                    .attr("stroke-width", "2")
                    .attr("rx", 8);


                svg
                    .selectAll('text')
                    .data(res.data[index])
                    .text((d, i) => {
                        return d.name
                    });



                index++
            }, 2000)


            // Ajout de l'echelle des ordonnées
            svg.append('g')
                .attr('transform', "translate(" + padding.left + "," + padding.top + ")")
                .call(d3.axisLeft(yScale))
                .selectAll("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", "15px")
                .attr("font-weight", "bold");

            // Ajout de l'echelle des abscisses
            svg.append("g")
                .attr("transform", "translate(" + padding.left + "," + (h - padding.bottom) + ")")
                .call(axis)
                .selectAll("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", "15px")
                .attr("font-weight", "bold");


            // Ajout du titre de l'axe des y
            svg.append("text")
                .attr('transform', "translate(40,420),rotate(-90)")
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("font-weight", "bold")
                .text(titreY);

            // // Ajout titre du bar chart
            svg.append("text")
                .attr('transform', "translate(" + (w /4) + "," + padding.top / 2 + ")")
                .attr("font-family", "sans-serif")
                .attr("font-size", "25px")
                .attr("font-weight", "bold")
                .text(titreChart);


            //Ajout du compteur d'année
            svg.append("text")
                .attr("id", "compteur")
                .attr('transform', "translate(" + (w - padding.right) + "," + h / 2 + ")")
                .attr("font-family", "sans-serif")
                .attr("font-size", "35px")
                .attr("font-weight", "bold")
                .text(() => {
                    if(counter){
                        clearInterval(counter);
                       
                    }
                      counter=compteur(debutChrono,finChrono);
                });

        })

    }


    // Methode permettant l'affichage d'un bar chart depuis un fichier Js local
    drawChartJs() {
        // w: largeur | h: hauteur
        let w = this.width;
        let h = this.height;
        let barPadding = this.barPadding;
        let elId = this.elId;
        let colorStart = this.colorStart;
        let colorEnd = this.colorEnd;
        let titreY = this.titreY;
        let titreChart = this.titreChart;
        const data = [
            [
                {
                    "couleur": "red",
                    "value": 300,
                    "name": "France"
                },
                {
                    "couleur": "blue",
                    "value": 280,
                    "name": "Japon"
                },
                {
                    "couleur": "pink",
                    "value": 200,
                    "name": "Espagne"
                },
                {
                    "couleur": "black",
                    "value": 170,
                    "name": "Italie"
                },
                {
                    "couleur": "orange",
                    "value": 160,
                    "name": "Norvège"
                },
                {
                    "couleur": "peru",
                    "value": 160,
                    "name": "Allemagne"
                },
                {
                    "couleur": "green",
                    "value": 150,
                    "name": "Chine"
                },
                {
                    "couleur": "yellow",
                    "value": 90,
                    "name": "USA"
                }
            ],
            [
                {
                    "couleur": "red",
                    "value": 410,
                    "name": "France"
                },
                {
                    "couleur": "yellow",
                    "value": 350,
                    "name": "USA"
                },
                {
                    "couleur": "pink",
                    "value": 300,
                    "name": "Espagne"
                },
                {
                    "couleur": "black",
                    "value": 200,
                    "name": "Italie"
                },
                {
                    "couleur": "orange",
                    "value": 190,
                    "name": "Norvège"
                },
                {
                    "couleur": "peru",
                    "value": 180,
                    "name": "Allemagne"
                },
                {
                    "couleur": "green",
                    "value": 110,
                    "name": "Chine"
                },
                {
                    "couleur": "blue",
                    "value": 50,
                    "name": "Japon"
                }
            ],
            [
                {
                "couleur": "pink",
                "value": 200,
                "name": "Espagne"
                },
                {
                    "couleur": "black",
                    "value": 170,
                    "name": "Italie"
                },
                {
                    "couleur": "orange",
                    "value": 160,
                    "name": "Norvège"
                },
                {
                    "couleur": "peru",
                    "value": 160,
                    "name": "Allemagne"
                },
                {
                    "couleur": "green",
                    "value": 100,
                    "name": "Chine"
                },
                {
                    "couleur": "yellow",
                    "value": 90,
                    "name": "USA"
                },
    
                {
                    "couleur": "red",
                    "value": 70,
                    "name": "France"
                },
                {
                    "couleur": "blue",
                    "value": 20,
                    "name": "Japon"
                }
            ],
            [
                {
                    "couleur": "blue",
                    "value": 500,
                    "name": "Japon"
                },
                {
                    "couleur": "yellow",
                    "value": 400,
                    "name": "USA"
                },
                {
                    "couleur": "pink",
                    "value": 400,
                    "name": "Espagne"
                },
                {
                    "couleur": "black",
                    "value": 370,
                    "name": "Italie"
                },
                {
                    "couleur": "orange",
                    "value": 260,
                    "name": "Norvège"
                },
                {
                    "couleur": "peru",
                    "value": 160,
                    "name": "Allemagne"
                },
                {
                    "couleur": "red",
                    "value": 150,
                    "name": "France"
                },
                {
                    "couleur": "green",
                    "value": 50,
                    "name": "Chine"
                }
            ],
            [
                {
                    "couleur": "blue",
                    "value": 850,
                    "name": "Japon"
                },
                {
                    "couleur": "yellow",
                    "value": 650,
                    "name": "USA"
                },
                {
                    "couleur": "pink",
                    "value": 600,
                    "name": "Espagne"
                },
                {
                    "couleur": "black",
                    "value": 570,
                    "name": "Italie"
                },
                {
                    "couleur": "orange",
                    "value": 460,
                    "name": "Norvège"
                },
                {
                    "couleur": "peru",
                    "value": 360,
                    "name": "Allemagne"
                },
                {
                    "couleur": "red",
                    "value": 250,
                    "name": "France"
                },
                {
                    "couleur": "green",
                    "value": 100,
                    "name": "Chine"
                }
            ],
            [
                {
                    "couleur": "blue",
                    "value": 1900,
                    "name": "Japon"
                },
                {
                    "couleur": "yellow",
                    "value": 1700,
                    "name": "USA"
                },
                {
                    "couleur": "red",
                    "value": 1500,
                    "name": "France"
                },
                {
                    "couleur": "pink",
                    "value": 1200,
                    "name": "Espagne"
                },
                {
                    "couleur": "black",
                    "value": 1170,
                    "name": "Italie"
                },
                {
                    "couleur": "orange",
                    "value": 960,
                    "name": "Norvège"
                },
                {
                    "couleur": "peru",
                    "value": 860,
                    "name": "Allemagne"
                },
                {
                    "couleur": "green",
                    "value": 700,
                    "name": "Chine"
                }
            ],
            [
                {
                    "couleur": "blue",
                    "value": 2000,
                    "name": "Japon"
                },
                {
                    "couleur": "yellow",
                    "value": 1500,
                    "name": "USA"
                },
                {
                    "couleur": "red",
                    "value": 1300,
                    "name": "France"
                },
                {
                    "couleur": "pink",
                    "value": 1200,
                    "name": "Espagne"
                },
                {
                    "couleur": "black",
                    "value": 1100,
                    "name": "Italie"
                },
                {
                    "couleur": "orange",
                    "value": 1060,
                    "name": "Norvège"
                },
                {
                    "couleur": "peru",
                    "value": 1000,
                    "name": "Allemagne"
                },
                {
                    "couleur": "green",
                    "value": 900,
                    "name": "Chine"
                }
            ],
            [
                {
                    "couleur": "blue",
                    "value": 2500,
                    "name": "Japon"
                },
                {
                    "couleur": "yellow",
                    "value": 2000,
                    "name": "USA"
                },
                {
                    "couleur": "red",
                    "value": 1800,
                    "name": "France"
                },
                {
                    "couleur": "pink",
                    "value": 1600,
                    "name": "Espagne"
                },
                {
                    "couleur": "black",
                    "value": 1500,
                    "name": "Italie"
                },
                {
                    "couleur": "peru",
                    "value": 1400,
                    "name": "Allemagne"
                },
                {
                    "couleur": "orange",
                    "value": 1200,
                    "name": "Norvège"
                },
               
                {
                    "couleur": "green",
                    "value": 990,
                    "name": "Chine"
                }
            ]
        ]
        
        let maxData = maxiData(data);
        const padding = {
            left: 150,
            right: 100,
            top: 100,
            bottom: 20
        }
        let chartHeight = h - padding.top - padding.bottom;
        let index = 0;
        let date = new Date();
        const finChrono = date.getFullYear();
        const debutChrono = finChrono - data.length + 1;

        

        // Création de l'element a selectionné dans le Dom s'il n'existe pas
        if (!document.getElementById(elId)) {
            let div = document.createElement("div");
            div.setAttribute("id", elId);
            document.body.appendChild(div);
        }
        // document.getElementById(elId).innerHTML = "<br>";
        // Création de l'élément SVG
        let svg = d3.select(document.getElementById(elId))
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        //Info donnée
        let tooltip = d3.select(document.getElementById(elId)).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        let widthScale = d3.scaleLinear()
            .domain([0, maxData + maxData / 10])
            .range([0, w - padding.left - padding.right]);

        let yScale = d3.scaleBand()
            .range([0, chartHeight])
            .domain(data[index].map(d => d.name))

        //Axe des Abscisses
        let axis = d3.axisBottom()
            .tickSize(-h)
            .ticks(5)
            .scale(widthScale);



        let color = d3.scaleLinear()
            .domain([0, maxData])
            .range([colorStart, colorEnd]);

        svg.selectAll('rect')
            .data(data[index])
            .enter()
            .append('rect');



        const interval = d3.interval(() => {
            if (index >= data.length) {
                interval.stop()
            }

            svg
                .selectAll('rect')
                .data(data[index])
                .attr('x', (d, i) => {
                    return 0
                })
                .attr('y', (d, i) => {
                    if (index == 0) {
                        return i * (chartHeight / data[index].length) + 2
                    }
                    for (let j = 0; j < data[index - 1].length; j++) {
                        if (data[index - 1][j].name == d.name) {
                            return j * (chartHeight / data[index].length) + 2
                        }
                    }
                    return chartHeight
                })
                .attr('height', (d) => {
                    return chartHeight / data[index].length - 2
                })
                .attr('fill', (d) => {

                    return color(d.value)
                })
                .attr('transform', "translate(" + (padding.left) + "," + padding.top + ")")

                .on("mouseover", (d, i) => {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html("" + d.value)
                        .style("left", (d3.event.pageX + 10) + "px")
                        .style("top", (d3.event.pageY - 50) + "px");
                })
                .on("mouseout", (d) => {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .transition()
                .duration(300)
                .delay((d, i) => {
                    return i * 50
                })
                .attr('y', (d, i) => {
                    return i * (chartHeight / data[index].length) + 2
                })
                .attr('width', (d) => {
                    return widthScale(d.value)
                })
                .attr("stroke", (d) => {
                    if (d > (9 * maxData / 10)) {
                        return "red"
                    } else {
                        return "black"
                    }
                })
                .attr("stroke-width", "2")
                .attr("rx", 8);


            svg
                .selectAll('text')
                .data(data[index])
                .text((d, i) => {
                    return d.name
                });



            index++
        }, 2000)


        // Ajout de l'echelle des ordonnées
        svg.append('g')
            .attr('transform', "translate(" + padding.left + "," + padding.top + ")")
            .call(d3.axisLeft(yScale))
            .selectAll("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", "15px")
            .attr("font-weight", "bold");

        // Ajout de l'echelle des abscisses
        svg.append("g")
            .attr("transform", "translate(" + padding.left + "," + (h - padding.bottom) + ")")
            .call(axis)
            .selectAll("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", "15px")
            .attr("font-weight", "bold");


        // Ajout du titre de l'axe des y
        svg.append("text")
            .attr('transform', "translate(40,420),rotate(-90)")
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .attr("font-weight", "bold")
            .text(titreY);

        // // Ajout titre du bar chart
        svg.append("text")
            .attr('transform', "translate(" + (w / 4) + "," + padding.top / 2 + ")")
            .attr("font-family", "sans-serif")
            .attr("font-size", "25px")
            .attr("font-weight", "bold")
            .text(titreChart);

        
        //Ajout du compteur d'année
        svg.append("text")
            .attr("id", "compteur")
            .attr('transform', "translate(" + (w - padding.right) + "," + h / 2 + ")")
            .attr("font-family", "sans-serif")
            .attr("font-size", "35px")
            .attr("font-weight", "bold")    
            .text(() => {
                if(counter){
                    clearInterval(counter);
                   
                }
                  counter=compteur(debutChrono,finChrono);
            });
    }


    // Methode permettant l'affichage d'un bar chart depuis une Url
    drawChartUrl(url) {
        // w: largeur | h: hauteur
        let w = this.width;
        let h = this.height;
        let barPadding = this.barPadding;
        let elId = this.elId;
        let colorStart = this.colorStart;
        let colorEnd = this.colorEnd;
        let titreY = this.titreY;
        let titreChart = this.titreChart;

        // Lien test
        // https://raw.githubusercontent.com/Dev1fo/data/master/donne.json
        d3.json(url).then(function (res) {

            const padding = {
                left: 150,
                right: 100,
                top: 100,
                bottom: 20
            }
            let maxData = maxi(res);
            let chartHeight = h - padding.top - padding.bottom;
            let index = 0;
            let date = new Date();
            const finChrono = date.getFullYear();
            const debutChrono = finChrono - res.data.length + 1;

            // Création de l'element a selectionné dans le Dom s'il n'existe pas
            if (!document.getElementById(elId)) {
                let div = document.createElement("div");
                div.setAttribute("id", elId);
                document.body.appendChild(div);
            }
            // document.getElementById(elId).innerHTML = "<br>";
            // Création de l'élément SVG
            let svg = d3.select(document.getElementById(elId))
                .append("svg")
                .attr("width", w)
                .attr("height", h);

            //Info donnée
            let tooltip = d3.select(document.getElementById(elId)).append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            let widthScale = d3.scaleLinear()
                .domain([0, maxData + maxData / 10])
                .range([0, w - padding.left - padding.right]);

            let yScale = d3.scaleBand()
                .range([0, chartHeight])
                .domain(res.data[index].map(d => d.name))

            //Axe des Abscisses
            let axis = d3.axisBottom()
                .tickSize(-h)
                .ticks(5)
                .scale(widthScale);



            let color = d3.scaleLinear()
                .domain([0, maxData])
                .range([colorStart, colorEnd]);

            svg.selectAll('rect')
                .data(res.data[index])
                .enter()
                .append('rect');



            const interval = d3.interval(() => {
                if (index >= res.data.length) {
                    interval.stop()
                }

                svg
                    .selectAll('rect')
                    .data(res.data[index])
                    .attr('x', (d, i) => {
                        return 0
                    })
                    .attr('y', (d, i) => {
                        if (index == 0) {
                            return i * (chartHeight / res.data[index].length) + 2
                        }
                        for (let j = 0; j < res.data[index - 1].length; j++) {
                            if (res.data[index - 1][j].name == d.name) {
                                return j * (chartHeight / res.data[index].length) + 2
                            }
                        }
                        return chartHeight
                    })
                    .attr('height', (d) => {
                        return chartHeight / res.data[index].length - 2
                    })
                    .attr('fill', (d) => {

                        return color(d.value)
                    })
                    .attr('transform', "translate(" + (padding.left) + "," + padding.top + ")")

                    .on("mouseover", (d, i) => {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html("" + d.value)
                            .style("left", (d3.event.pageX + 10) + "px")
                            .style("top", (d3.event.pageY - 50) + "px");
                    })
                    .on("mouseout", (d) => {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    })
                    .transition()
                    .duration(300)
                    .delay((d, i) => {
                        return i * 50
                    })
                    .attr('y', (d, i) => {
                        return i * (chartHeight / res.data[index].length) + 2
                    })
                    .attr('width', (d) => {
                        return widthScale(d.value)
                    })
                    .attr("stroke", (d) => {
                        if (d > (9 * maxData / 10)) {
                            return "red"
                        } else {
                            return "black"
                        }
                    })
                    .attr("stroke-width", "2")
                    .attr("rx", 8);


                svg
                    .selectAll('text')
                    .data(res.data[index])
                    .text((d, i) => {
                        return d.name
                    });



                index++
            }, 2000)


            // Ajout de l'echelle des ordonnées
            svg.append('g')
                .attr('transform', "translate(" + padding.left + "," + padding.top + ")")
                .call(d3.axisLeft(yScale))
                .selectAll("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", "15px")
                .attr("font-weight", "bold");

            // Ajout de l'echelle des abscisses
            svg.append("g")
                .attr("transform", "translate(" + padding.left + "," + (h - padding.bottom) + ")")
                .call(axis)
                .selectAll("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", "15px")
                .attr("font-weight", "bold");


            // Ajout du titre de l'axe des y
            svg.append("text")
                .attr('transform', "translate(40,420),rotate(-90)")
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("font-weight", "bold")
                .text(titreY);

            // // Ajout titre du bar chart
            svg.append("text")
                .attr('transform', "translate(" + (w /4) + "," + padding.top / 2 + ")")
                .attr("font-family", "sans-serif")
                .attr("font-size", "25px")
                .attr("font-weight", "bold")
                .text(titreChart);


            //Ajout du compteur d'année
            svg.append("text")
                .attr("id", "compteur")
                .attr('transform', "translate(" + (w - padding.right) + "," + h / 2 + ")")
                .attr("font-family", "sans-serif")
                .attr("font-size", "35px")
                .attr("font-weight", "bold")
                .text(() => {
                    if(counter){
                        clearInterval(counter);
                       
                    }
                      counter=compteur(debutChrono,finChrono);
                });

        })

    }

    updateColor(colorStart, colorEnd) {
        this.colorStart = colorStart;
        this.colorEnd = colorEnd;
        if (document.getElementById(this.elId)) {
            document.getElementById(this._elId).innerHTML = "";
        }

    }

    resizeChart(width, height) {
        this.width = width;
        this.height = height;

        if (document.getElementById(this.elId)) {
            document.getElementById(this._elId).innerHTML = "";
        }
    }

}