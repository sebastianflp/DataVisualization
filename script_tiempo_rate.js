Promise.all([
    // d3.json('http://localhost:3000/api/v1/employees/linea_de_tiempo'),
    // d3.json('http://localhost:3000/api/v1/employees/total_pop/black'),
    // d3.json('http://localhost:3000/api/v1/employees/total_pop/white'),
    // d3.json('http://localhost:3000/api/v1/employees/total_pop/total'),
    // d3.json('http://localhost:3000/api/v1/employees/total_pop/hispanic')
    d3.csv('https://raw.githubusercontent.com/sebastianflp/DataVisualization/main/tiempo_1.csv'),
    d3.csv('https://raw.githubusercontent.com/sebastianflp/DataVisualization/main/population.csv'),
    ])
    .then(d => {
        time_line_rate(d[0],
            d[1][0].population,
            d[1][1].population,
            d[1][2].population,
            d[1][3].population)
    });
function time_line_rate(data, black_pop, white_pop, total_pop, hisp_pop) {
    d3.select('#btn-iniciar_time_rate')
        .style('position', 'absolute')
        .style('left', '180px')
        .style('top', (75 + 620) + 'px')
    d3.select('#btn-reiniciar_time_rate')
        .style('position', 'absolute')
        .style('left', '180px')
        .style('top', (123 + 620) + 'px')

    const color_total = '#169d4e';
    const color_black = '#c61b1b';
    const color_white = '#234ed7';
    const color_hisp = '#f39117';

    let lista_fechas = [];
    data.forEach(function (dict) {
        lista_fechas.push(dict.n);
        dict.n = (dict.n / total_pop) * (1000000 / 7);
        dict.n_black = (dict.n_black / black_pop) * (1000000 / 7);
        dict.n_white = (dict.n_white / white_pop) * (1000000 / 7);
        dict.n_hisp = (dict.n_hisp / hisp_pop) * (1000000 / 7);
    });

    let total = 0;
    lista_fechas.forEach(function (number) {
        total += number;
    });
    let n_rate = data.length;

    const ancho = window.screen.width - 50 * 2 - 15 * 2;
    const alto = 620;

    const ancho_g = ancho / 1.2;
    const alto_g = alto / 1.2;

    d3.select('#time_rate').attr('height', alto).attr('width', ancho);

    d3.select('#time_rate')
        .append('text')
        .text('Ratio anual de asesinatos cada 1 Mill. habs.')
        .style('font-size', '20px')
        .attr('transform', 'translate(' +
            75 +
            ', ' +
            500 +
            ') rotate(-90)');

    d3.select('#time_rate')
        .append('rect')
        .attr('class', 'grafico_time_rate')
        .attr('height', alto_g)
        .attr('width', ancho_g)
        .attr('fill', '#ffffff')
        .attr('transform', 'translate('
            + (ancho - ancho_g) / 2
            + ','
            + (alto - alto_g) / 2
            + ')');

    let max_val = 8

    let eje_y_rate = [max_val, max_val * 3 / 4, max_val / 2, max_val / 4, 0];

    let escala_y = d3.scaleLinear()
        .domain([0, max_val])
        .range([alto_g, 0]);

    let escala_x = d3.scaleTime()
        .domain([new Date('2013-01-01 00:00:00'), new Date('2020-12-31 00:00:00')])
        .range([0, ancho_g]);

    let eje_y_4 = d3.axisLeft()
        .scale(escala_y)
        .tickSize(-ancho_g)
        .tickValues(eje_y_rate);

    d3.select("#time_rate")
        .append("g") //es parte de un grupo
        .attr("id", "eje_y_4")
        .style('font-size', '20px')
        .attr("transform", "translate(" + (ancho - ancho_g) / 2 + "," + (alto - alto_g) / 2 + ")")
        .call(eje_y_4);

    const format = d3.timeFormat("%m-%Y");

    let eje_x_rate = [
        new Date('2013-01-01 00:00:00'),
        new Date('2014-01-01 00:00:00'),
        new Date('2015-01-01 00:00:00'),
        new Date('2016-01-01 00:00:00'),
        new Date('2017-01-01 00:00:00'),
        new Date('2018-01-01 00:00:00'),
        new Date('2019-01-01 00:00:00'),
        new Date('2020-01-01 00:00:00'),
        new Date('2021-01-01 00:00:00')
    ];

    let eje_x_4 = d3.axisBottom()
        .scale(escala_x)
        .ticks(...[10, format])
        .tickValues(eje_x_rate);

    d3.select("#time_rate")
        .append("g") //es parte de un grupo
        .attr("id", "eje_x_4")
        .attr("transform", "translate(" + (ancho - ancho_g) / 2 + "," + ((alto - alto_g) / 2 + alto_g) + ")")
        .style("font-size", "20px")
        .style('margin-top', '15px')
        .call(eje_x_4);

    let linea_grafico_rate = d3.line()
        .x(function (d) {
            return escala_x(new Date(d.fecha));
        })
        .y(function (d) {
            return escala_y(d.n);
        });

    let linea_grafico_black_rate = d3.line()
        .x(function (d) {
            return escala_x(new Date(d.fecha));
        })
        .y(function (d) {
            return escala_y(d.n_black);
        });

    let linea_grafico_white_rate = d3.line()
        .x(function (d) {
            return escala_x(new Date(d.fecha));
        })
        .y(function (d) {
            return escala_y(d.n_white);
        });

    let linea_grafico_hisp_rate = d3.line()
        .x(function (d) {
            return escala_x(new Date(d.fecha));
        })
        .y(function (d) {
            return escala_y(d.n_hisp);
        });

    function iniciar_grafico_rate() {
        const l_rate = length(linea_grafico_rate(data));
        const l_black_rate = length(linea_grafico_black_rate(data));
        const l_white_rate = length(linea_grafico_white_rate(data));
        const l_hisp_rate = length(linea_grafico_hisp_rate(data));

        d3.select("#time_rate")
            .append("path")
            .datum(data)
            .attr('class', 'path-line_time_rate')
            .attr("fill", "none")
            .attr("stroke", function () {
                return color_total;
            })
            .attr("stroke-width", "2.5px")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-opacity", 1)
            .attr('stroke-dasharray', `0,${l_rate}`)
            .attr("transform", "translate(" + (ancho - ancho_g) / 2 + "," + (alto - alto_g) / 2 + ")")
            .attr("d", linea_grafico_rate(data))
            .transition()
            .duration(10000)
            .ease(d3.easeLinear)
            .attr("stroke-dasharray", `${l_rate},${l_rate}`);

        d3.select("#time_rate")
            .append("path")
            .datum(data)
            .attr('class', 'path-line_time_black_rate')
            .attr("fill", "none")
            .attr("stroke", function () {
                return color_black;
            })
            .attr("stroke-width", "2.5px")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-opacity", 1)
            .attr('stroke-dasharray', `0,${l_black_rate}`)
            .attr("transform", "translate(" + (ancho - ancho_g) / 2 + "," + (alto - alto_g) / 2 + ")")
            .attr("d", linea_grafico_black_rate(data))
            .transition()
            .duration(10000)
            .ease(d3.easeLinear)
            .attr("stroke-dasharray", `${l_black_rate},${l_black_rate}`);

        d3.select("#time_rate")
            .append("path")
            .datum(data)
            .attr('class', 'path-line_time_white_rate')
            .attr("fill", "none")
            .attr("stroke", function () {
                return color_white;
            })
            .attr("stroke-width", "2.5px")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-opacity", 1)
            .attr('stroke-dasharray', `0,${l_white_rate}`)
            .attr("transform", "translate(" + (ancho - ancho_g) / 2 + "," + (alto - alto_g) / 2 + ")")
            .attr("d", linea_grafico_white_rate(data))
            .transition()
            .duration(10000)
            .ease(d3.easeLinear)
            .attr("stroke-dasharray", `${l_white_rate},${l_white_rate}`);

        d3.select("#time_rate")
            .append("path")
            .datum(data)
            .attr('class', 'path-line_time_hisp_rate')
            .attr("fill", "none")
            .attr("stroke", function () {
                return color_hisp;
            })
            .attr("stroke-width", "2.5px")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-opacity", 1)
            .attr('stroke-dasharray', `0,${l_hisp_rate}`)
            .attr("transform", "translate(" + (ancho - ancho_g) / 2 + "," + (alto - alto_g) / 2 + ")")
            .attr("d", linea_grafico_hisp_rate(data))
            .transition()
            // .duration(100)
            .duration(10000)
            .ease(d3.easeLinear)
            .attr("stroke-dasharray", `${l_hisp_rate},${l_hisp_rate}`)
            .on('end', function () {
                animaciones();

                //
                const y = 62;
                const tam_letra = 15;
                const delta = 5;
                let grupo_rate = d3.select('#time_rate')
                    .append('g')
                    .attr('class', 'reporte-fijo_rate')
                    .style('opacity', 0);
                grupo_rate.append('rect')
                    .attr('height', 110)
                    .attr('width', 130)
                    .attr('x', 450)
                    .attr('y', y)
                    .attr('stroke', 'black')
                    .attr('stroke-opacity', 0.5)
                    .attr('fill', 'grey')
                    .style('opacity', 0.1)
                grupo_rate.append('text')
                    .text('Puntos finales:')
                    .style('font-size', '15px')
                    .style('font-family', 'Verdana')
                    .attr('transform', 'translate(455, ' + (y + tam_letra + delta) + ')');
                grupo_rate.append('text')
                    .text('Black: ' + Intl.NumberFormat('de-DE').format(data[n_rate-1].n_black))
                    .style('font-size', '15px')
                    .style('font-family', 'Verdana')
                    .attr('transform', 'translate(455, ' + (y + (tam_letra + delta) * 2) + ')');
                grupo_rate.append('text')
                    .text('Hisp: ' + Intl.NumberFormat('de-DE').format(data[n_rate-1].n_hisp))
                    .style('font-size', '15px')
                    .style('font-family', 'Verdana')
                    .attr('transform', 'translate(455, ' + (y + (tam_letra + delta) * 3) + ')');
                grupo_rate.append('text')
                    .text('Total: ' + Intl.NumberFormat('de-DE').format(data[n_rate-1].n))
                    .style('font-size', '15px')
                    .style('font-family', 'Verdana')
                    .attr('transform', 'translate(455, ' + (y + (tam_letra + delta) * 4) + ')');
                grupo_rate.append('text')
                    .text('White: ' + Intl.NumberFormat('de-DE').format(data[n_rate-1].n_white))
                    .style('font-size', '15px')
                    .style('font-family', 'Verdana')
                    .attr('transform', 'translate(455, ' + (y + (tam_letra + delta) * 5) + ')');
                //
                grupo_rate.transition().duration(750).style('opacity', 1);
            });
    }

    d3.select('#btn-iniciar_time_rate').on('click', function () {
        // console.log('hola');
        iniciar_grafico_rate();
    });
    d3.select('#btn-reiniciar_time_rate').on('click', function () {
        d3.select('.path-line_time_rate')
            .transition().duration(1000)
            .style('opacity', 0)
            .on('end', function () {
                d3.select('.path-line_time_rate').remove();
            });
        d3.select('.path-line_time_black_rate')
            .transition().duration(1000)
            .style('opacity', 0)
            .on('end', function () {
                d3.select('.path-line_time_black_rate').remove();
            });
        d3.select('.path-line_time_white_rate')
            .transition().duration(1000)
            .style('opacity', 0)
            .on('end', function () {
                d3.select('.path-line_time_white_rate').remove();
                iniciar_grafico_rate();
            });
        d3.select('.path-line_time_hisp_rate')
            .transition().duration(1000)
            .style('opacity', 0)
            .on('end', function () {
                d3.select('.path-line_time_hisp_rate').remove();
                iniciar_grafico_rate();
            });
    });

    function length(path) {
        return d3.create("svg:path").attr("d", path).node().getTotalLength();
    }

    /* Agrega la leyenda */
    let fillScale = d3.scaleOrdinal()
        .domain(["Total", "Gente blanca", "Gente negra", "Hispanos"])
        .range([color_total, color_white, color_black, color_hisp])
    // Agrega leyenda
    let legendA = d3.legendColor().scale(fillScale)
    d3.select("#time_rate")
        .append("g")
        .style("font-size", '16px')
        .attr("transform", "translate(" + (ancho / 2 / 2 / 2 + 100) + ", 75)")
        .call(legendA);



    function animaciones () {
        let base = new Date(data[0].fecha);

        let limite_ancho_der = escala_x(new Date('2020-09-27')) + (ancho - ancho_g) / 2;

        d3.select('.grafico_time_rate')
            .on('mouseenter', function (d) {
                if (d3.select('.linea_hover_rate')._groups[0][0] === null) {
                    if ((d.x - 50) < limite_ancho_der) {
                        d3.select('#time_rate')
                            .append('line')
                            .attr('class', 'linea_hover_rate')
                            .attr('x1', function () {
                                return d.x - 51;
                            })
                            .attr('y1', (alto - alto_g) / 2)
                            .attr('x2', function () {
                                return d.x - 51;
                            })
                            .attr('y2', (alto - alto_g) / 2 + alto_g)
                            .attr('stroke', 'grey');
                    }
                }
            })
            .on('mousemove', function (d) {
                d3.select('.linea_hover_rate')
                    .transition().duration(1)
                    .attr('x1', function () {
                        return d.x - 51;
                    })
                    .attr('x2', function () {
                        return d.x - 51;
                    });

                if (d3.select('.linea_hover_rate')._groups[0][0] === null) {
                    if ((d.x - 50) < limite_ancho_der) {
                        d3.select('#time_rate')
                            .append('line')
                            .attr('class', 'linea_hover_rate')
                            .attr('x1', function () {
                                return d.x - 51;
                            })
                            .attr('y1', (alto - alto_g) / 2)
                            .attr('x2', function () {
                                return d.x - 51;
                            })
                            .attr('y2', (alto - alto_g) / 2 + alto_g)
                            .attr('stroke', 'grey');
                    }
                } else if ((d.x - 51) > limite_ancho_der) {
                    d3.select('.linea_hover_rate')
                        .transition().duration(100)
                        .style('opacity', 0)
                        .on('end', function () {
                            d3.select('.linea_hover_rate').remove();
                        });
                }
            })
            .on('mouseleave', function (d) {
                if ((d.x - 51) < ((ancho - ancho_g) / 2)) {
                    d3.select('.linea_hover_rate')
                        .transition().duration(250)
                        .style('opacity', 0)
                        .on('end', function () {
                            d3.select('.linea_hover_rate').remove();
                        });
                }
            });
    }
}

