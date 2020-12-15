d3.json('http://localhost:3000/api/v1/employees/agnos')
    .then(function (d) {
        callFunction(d.resultados, 0);
    });
function callFunction (data, index) {
    // const data2 = data[index]
    let total = [];
    let black = [];
    let white = []
    let hisp = [];
    let isla = [];
    let desc = [];
    let asian = [];
    let nativo = [];
    let year = [];
    for (let i = 0; i < data.length; i++) {
        total.push(data[i].n);
        black.push(data[i].black);
        hisp.push(data[i].hisp);
        desc.push(data[i].desconocida);
        isla.push(data[i].isla);
        asian.push(data[i].asian);
        nativo.push(data[i].nativo);
        year.push(data[i].year);
        white.push(data[i].white);
    }
    let completa = []
    completa.push(total, black, white, hisp, nativo, isla, asian, desc)
    // const data2 = completa[index]
    // v_lineas(data2, year)
    v_lineas(completa, year)
}
function v_lineas (data_v1, years) {
    let data = data_v1[0]
    const ancho = 1000;
    const alto = 600;

    const ancho_g = ancho / 1.2;
    const alto_g = alto / 1.5;

    d3.select('#lineas').attr('height', alto).attr('width', ancho);

    const myColor = ['#011dc6',
                    '#ee0000',
                    '#ff8e50',
                    '#926a54',
                    '#6c3798',
                    '#00b6ff',
                    '#0a8a00',
                    '#000000']

    const maximo = Math.max(...data);

    let miEscalaX = d3.scaleLinear().domain([2012, 2021]).range([0, ancho_g]);
    let miEscalaY = d3.scaleLinear().domain([0, maximo + 20]).range([alto_g, 0]);

    let xMiEje = d3.axisBottom()
        .scale(miEscalaX)
        .tickSize(10)
        .tickValues(years);

    d3.select("#lineas")
        .append("g") //es parte de un grupo
        .attr("id", "xMiEje")
        .attr("transform", "translate(" + (ancho - ancho_g) / 2 + "," + ((alto - alto_g) / 2 + alto_g) + ")")
        .style("font-size", "20px")
        .style('margin-top', '15px')
        // .style("font-family", "Libre Caslon Text")
        .call(xMiEje);

    let yMiEje = d3.axisLeft()
        .scale(miEscalaY)
        .tickSize(-ancho_g);

    d3.select("#lineas")
        .append("g") //es parte de un grupo
        .attr("id", "yMiEje")
        .style('font-size', '20px')
        .attr("transform", "translate(" + (ancho - ancho_g) / 2 + "," + (alto - alto_g) / 2 + ")")
        .call(yMiEje);



    let graphLine = d3.line()
        .x(function (d, i) {
            return miEscalaX(years[i]);
        })
        .y(function (d) {
            return miEscalaY(d);
        });

    graphLine.curve(d3.curveLinear);

    d3.select("#lineas")
        .append("path")
        .attr('class', 'path-line')
        .attr("d", graphLine(data))
        .attr("fill", "none")
        .attr("stroke", function () {
            return myColor[0];
        })
        .attr("stroke-width", "5px")
        .attr("stroke-opacity", 0.5)
        .attr("transform", "translate(" + (ancho - ancho_g) / 2 + "," + (alto - alto_g) / 2 + ")")
    ;
    d3.select("#lineas")
        .selectAll("circle .points")
        .data(data).enter()
        .append("circle")
        .attr("class", "points")
        .attr('id', function (d, i) {
            return 'p-' + i;
        })
        .attr("r", 8)
        .attr("cx", function (d, i) {
            return miEscalaX(years[i]);
        })
        .attr("cy", function (d) {
            return miEscalaY(d);
        })
        .style("fill", function (d, i) {
            return myColor[0];
        })
        .attr("transform", "translate(" + (ancho - ancho_g) / 2 + "," + (alto - alto_g) / 2 + ")")
        .on('mouseover', sobrePunto)
        .on('mouseout', quitaNro)
    ;

    function update_graph (index) {
        data = data_v1[index];
        const maximo = Math.max(...data);
        let miEscalaY = d3.scaleLinear().domain([0, maximo + 20]).range([alto_g, 0]);
        let yMiEje = d3.axisLeft()
            .scale(miEscalaY)
            .tickSize(-ancho_g)
        ;
        d3.select("#yMiEje")
            .transition().duration(1000)
            .call(yMiEje);

        graphLine = d3.line()
            .x(function (d, i) {
                return miEscalaX(years[i]);
            })
            .y(function (d) {
                return miEscalaY(d);
            });
        //
        // graphLine.curve(d3.curveLinear);

        d3.select(".path-line")
            .transition().duration(1000)
            .attr('stroke', myColor[index])
            .attr('stroke-opacity', 0.5)
            .attr("d", graphLine(data));

        for (let i = 0; i<data.length; i++) {
            d3.select('#p-' + i)
                .transition().duration(1000)
                .style('fill', myColor[index])
                .attr('cy', miEscalaY(data[i]))
        }
        return miEscalaY;
    }

    d3.select('#seleccion').on('change', function (d) {
        const valor = d3.select(this).property('value');
        miEscalaY = update_graph(valor);
    });

    function sobrePunto (evento) {
        let indice = d3.select(this).property('id');
        indice = indice.substring(2);
        // data = data_v1[indice];
        console.log(indice);
        console.log(data);
        d3.select('#lineas')
            .append('rect')
            .attr('id', 'r-' + indice)
            .attr('x', function () {
                return (ancho - ancho_g) / 2 + miEscalaX(years[indice]) - 15-5;
            })
            .attr('y', function () {
                return (alto - alto_g) / 2 + miEscalaY(data[indice]) - 13 - 25;
            })
            .attr('rx', 5)
            .attr('height', 30)
            .attr('width', function () {
                if (data[indice] > 999) {
                    return 65;
                } else if (data[indice] > 99) {
                    return 52;
                } else {
                    return 40;
                }
            })
            .style('fill', '#ffffff')
            .style('opacity', 0.6)
            .style('stroke', '#000000')
            .style('stroke-width', 0.5);
        d3.select('#lineas')
            .append('text')
            .attr('id', 't-' + indice)
            .attr('x', function () {
                return (ancho - ancho_g) / 2 + miEscalaX(years[indice]) - 15;
            })
            .attr('y', function () {
                return (alto - alto_g) / 2 + miEscalaY(data[indice]) - 13;
            })
            .style('font-size', 25)
            .text(function () {
                return data[indice];
            })
        ;
    }

    function quitaNro (evento) {
        let indice = d3.select(this).property('id');
        indice = indice.substring(2);
        d3.select('#t-' + indice).remove()
        d3.select('#r-' + indice).remove()
    }
}

