// d3.json('http://localhost:3000/api/v1/employees/linea_de_tiempo')
d3.csv('data/tiempo_1.csv')
    .then(function (d) {
        // time_line(d.resultados);
        time_line(d);
    });
function time_line(data) {
    // console.log(data)
    d3.select('#btn-iniciar_time')
        .style('position', 'absolute')
        .style('left', '180px')
        .style('top', '75px')
    d3.select('#btn-reiniciar_time')
        .style('position', 'absolute')
        .style('left', '180px')
        .style('top', '123px')

    const color_total = '#169d4e';
    const color_black = '#c61b1b';
    const color_white = '#234ed7';
    const color_hisp = '#f39117';

    let lista_fechas = [];
    data.forEach(function (dict) {
        lista_fechas.push(dict.n);
    });
    let total = 0;
    lista_fechas.forEach(function (number) {
        total += number;
    });
    let n = data.length;

    const ancho = window.screen.width - 50 * 2 - 15 * 2;
    const alto = 620;

    const ancho_g = ancho / 1.2;
    const alto_g = alto / 1.2;

    d3.select('#time').attr('height', alto).attr('width', ancho);

    d3.select('#time')
        .append('text')
        .text('Cantidad de asesinatos por policías')
        .style('font-size', '20px')
        .attr('transform', 'translate(' +
            30 +
            ',' +
            460 +
            ') rotate(-90)');

    d3.select('#time')
        .append('rect')
        .attr('class', 'grafico_time')
        .attr('height', alto_g)
        .attr('width', ancho_g)
        .attr('fill', '#ffffff')
        .attr('transform', 'translate('
            + (ancho - ancho_g) / 2
            + ','
            + (alto - alto_g) / 2
            + ')');

    let max_val = 100 * (Math.round(data[n - 1].n / 100) + 1);
    // let max_date = new Date(data[n - 1].fecha);

    let eje_y = [max_val, max_val * 3 / 4, max_val / 2, max_val / 4, 0];

    let escala_y = d3.scaleLinear()
        .domain([0, max_val])
        .range([alto_g, 0]);

    let escala_x = d3.scaleTime()
        .domain([new Date('2013-01-01 00:00:00'), new Date('2020-12-31 00:00:00')])
        .range([0, ancho_g]);

    let eje_y_3 = d3.axisLeft()
        .scale(escala_y)
        .tickSize(-ancho_g)
        .tickValues(eje_y);

    d3.select("#time")
        .append("g") //es parte de un grupo
        .attr("id", "eje_y_3")
        .style('font-size', '20px')
        .attr("transform", "translate(" + (ancho - ancho_g) / 2 + "," + (alto - alto_g) / 2 + ")")
        .call(eje_y_3);

    const format = d3.timeFormat("%m-%Y");
    const format2 = d3.timeFormat("%s");
    const format3 = d3.timeFormat("%d-%m-%Y");

    let eje_x = [
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

    let eje_x_3 = d3.axisBottom()
        .scale(escala_x)
        .ticks(...[10, format])
        .tickValues(eje_x);

    d3.select("#time")
        .append("g") //es parte de un grupo
        .attr("id", "eje_x_3")
        .attr("transform", "translate(" + (ancho - ancho_g) / 2 + "," + ((alto - alto_g) / 2 + alto_g) + ")")
        .style("font-size", "20px")
        .style('margin-top', '15px')
        .call(eje_x_3);

    let linea_grafico = d3.line()
        .x(function (d) {
            return escala_x(new Date(d.fecha));
        })
        .y(function (d) {
            return escala_y(d.n);
        });

    let linea_grafico_black = d3.line()
        .x(function (d) {
            return escala_x(new Date(d.fecha));
        })
        .y(function (d) {
            return escala_y(d.n_black);
        });
    let linea_grafico_white = d3.line()
        .x(function (d) {
            return escala_x(new Date(d.fecha));
        })
        .y(function (d) {
            return escala_y(d.n_white);
        });
    let linea_grafico_hisp = d3.line()
        .x(function (d) {
            return escala_x(new Date(d.fecha));
        })
        .y(function (d) {
            return escala_y(d.n_hisp);
        });

    function iniciar_grafico() {
        const l = length(linea_grafico(data));
        const l_black = length(linea_grafico_black(data));
        const l_white = length(linea_grafico_white(data));
        const l_hisp = length(linea_grafico_hisp(data));

        d3.select("#time")
            .append("path")
            .datum(data)
            .attr('class', 'path-line_time')
            .attr("fill", "none")
            .attr("stroke", function () {
                return color_total;
            })
            .attr("stroke-width", "2.5px")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-opacity", 1)
            .attr('stroke-dasharray', `0,${l}`)
            .attr("transform", "translate(" + (ancho - ancho_g) / 2 + "," + (alto - alto_g) / 2 + ")")
            .attr("d", linea_grafico(data))
            .transition()
            .duration(10000)
            .ease(d3.easeLinear)
            .attr("stroke-dasharray", `${l},${l}`);

        d3.select("#time")
            .append("path")
            .datum(data)
            .attr('class', 'path-line_time_black')
            .attr("fill", "none")
            .attr("stroke", function () {
                return color_black;
            })
            .attr("stroke-width", "2.5px")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-opacity", 1)
            .attr('stroke-dasharray', `0,${l_black}`)
            .attr("transform", "translate(" + (ancho - ancho_g) / 2 + "," + (alto - alto_g) / 2 + ")")
            .attr("d", linea_grafico_black(data))
            .transition()
            .duration(10000)
            .ease(d3.easeLinear)
            .attr("stroke-dasharray", `${l_black},${l_black}`);

        d3.select("#time")
            .append("path")
            .datum(data)
            .attr('class', 'path-line_time_white')
            .attr("fill", "none")
            .attr("stroke", function () {
                return color_white;
            })
            .attr("stroke-width", "2.5px")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-opacity", 1)
            .attr('stroke-dasharray', `0,${l_white}`)
            .attr("transform", "translate(" + (ancho - ancho_g) / 2 + "," + (alto - alto_g) / 2 + ")")
            .attr("d", linea_grafico_white(data))
            .transition()
            .duration(10000)
            .ease(d3.easeLinear)
            .attr("stroke-dasharray", `${l_white},${l_white}`);

        d3.select("#time")
            .append("path")
            .datum(data)
            .attr('class', 'path-line_time_hisp')
            .attr("fill", "none")
            .attr("stroke", function () {
                return color_hisp;
            })
            .attr("stroke-width", "2.5px")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-opacity", 1)
            .attr('stroke-dasharray', `0,${l_hisp}`)
            .attr("transform", "translate(" + (ancho - ancho_g) / 2 + "," + (alto - alto_g) / 2 + ")")
            .attr("d", linea_grafico_hisp(data))
            .transition()
            .duration(10000)
            // .duration(100)
            .ease(d3.easeLinear)
            .attr("stroke-dasharray", `${l_hisp},${l_hisp}`)
            .on('end', function () {
                animaciones();


                //
                const y = 62;
                const tam_letra = 15;
                const delta = 5;
                let grupo = d3.select('#time')
                    .append('g')
                    .attr('class', 'reporte-fijo')
                    .style('opacity', 0);
                grupo.append('rect')
                    .attr('height', 110)
                    .attr('width', 130)
                    .attr('x', 450)
                    .attr('y', y)
                    .attr('stroke', 'black')
                    .attr('stroke-opacity', 0.5)
                    .attr('fill', 'grey')
                    .style('opacity', 0.1)
                grupo.append('text')
                    .text('Puntos finales:')
                    .style('font-size', '15px')
                    .style('font-family', 'Verdana')
                    .attr('transform', 'translate(455, ' + (y + tam_letra + delta) + ')');
                grupo.append('text')
                    .text('Total: ' + Intl.NumberFormat('de-DE').format(data[n-1].n))
                    .style('font-size', '15px')
                    .style('font-family', 'Verdana')
                    .attr('transform', 'translate(455, ' + (y + (tam_letra + delta) * 2) + ')');
                grupo.append('text')
                    .text('White: ' + Intl.NumberFormat('de-DE').format(data[n-1].n_white))
                    .style('font-size', '15px')
                    .style('font-family', 'Verdana')
                    .attr('transform', 'translate(455, ' + (y + (tam_letra + delta) * 3) + ')');
                grupo.append('text')
                    .text('Black: ' + Intl.NumberFormat('de-DE').format(data[n-1].n_black))
                    .style('font-size', '15px')
                    .style('font-family', 'Verdana')
                    .attr('transform', 'translate(455, ' + (y + (tam_letra + delta) * 4) + ')');
                grupo.append('text')
                    .text('Hisp: ' + Intl.NumberFormat('de-DE').format(data[n-1].n_hisp))
                    .style('font-size', '15px')
                    .style('font-family', 'Verdana')
                    .attr('transform', 'translate(455, ' + (y + (tam_letra + delta) * 5) + ')');
                //
                grupo.transition().duration(750).style('opacity', 1);
            });
    }

    d3.select('#btn-iniciar_time').on('click', function () {
        iniciar_grafico();
    });
    d3.select('#btn-reiniciar_time').on('click', function () {
        d3.select('.path-line_time')
            .transition().duration(1000)
            .style('opacity', 0)
            .on('end', function () {
                d3.select('.path-line_time').remove();
            });
        d3.select('.path-line_time_black')
            .transition().duration(1000)
            .style('opacity', 0)
            .on('end', function () {
                d3.select('.path-line_time_black').remove();
            });
        d3.select('.path-line_time_white')
            .transition().duration(1000)
            .style('opacity', 0)
            .on('end', function () {
                d3.select('.path-line_time_white').remove();
                iniciar_grafico();
            });
        d3.select('.path-line_time_hisp')
            .transition().duration(1000)
            .style('opacity', 0)
            .on('end', function () {
                d3.select('.path-line_time_hisp').remove();
                iniciar_grafico();
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
    d3.select("#time")
        .append("g")
        .style("font-size", '16px')
        .attr("transform", "translate(" + (ancho / 2 / 2 / 2 + 100) + ", 75)")
        .call(legendA);



    function animaciones () {
        let base = new Date(data[0].fecha);

        let limite_ancho_der = escala_x(new Date('2020-09-27')) + (ancho - ancho_g) / 2;
        console.log(limite_ancho_der);

        d3.select('.grafico_time')
            .on('mouseenter', function (d) {
                if (d3.select('.linea_hover')._groups[0][0] === null) {
                    if ((d.x - 50) < limite_ancho_der) {
                        d3.select('#time')
                            .append('line')
                            .attr('class', 'linea_hover')
                            .attr('x1', function () {
                                return d.x - 51;
                            })
                            .attr('y1', (alto - alto_g) / 2)
                            .attr('x2', function () {
                                return d.x - 51;
                            })
                            .attr('y2', (alto - alto_g) / 2 + alto_g)
                            .attr('stroke', 'grey')
                        ;
                        // d3.select('#time')
                        //     .append('rect')
                        //     .attr('class', 'reporte-movil')
                        //     .attr('height', 50)
                        //     .attr('width', 50)
                        //     .attr('fill', 'red')
                        //     .style('opacity', 0.5)
                        //     .attr('x', d.x - 50)
                        //     .attr('y', alto_g / 2);
                    }
                }
            })
            .on('mousemove', function (d) {
                d3.select('.linea_hover')
                    .transition().duration(1)
                    .attr('x1', function () {
                        return d.x - 51;
                    })
                    .attr('x2', function () {
                        return d.x - 51;
                    });
                // d3.select('.reporte-movil')
                //     .transition().duration(1)
                //     .attr('x', function () {
                //         return d.x - 51;
                //     })
                //     .attr('y', function () {
                //         return alto_g / 2   ;
                //     });

                if (d3.select('.linea_hover')._groups[0][0] === null) {
                    if ((d.x - 50) < limite_ancho_der) {
                        d3.select('#time')
                            .append('line')
                            .attr('class', 'linea_hover')
                            .attr('x1', function () {
                                return d.x - 51;
                            })
                            .attr('y1', (alto - alto_g) / 2)
                            .attr('x2', function () {
                                return d.x - 51;
                            })
                            .attr('y2', (alto - alto_g) / 2 + alto_g)
                            .attr('stroke', 'grey');
                        // d3.select('#time')
                        //     .append('rect')
                        //     .attr('class', 'reporte-movil')
                        //     .attr('height', 50)
                        //     .attr('width', 50)
                        //     .attr('fill', 'red')
                        //     .style('opacity', 0.5)
                        //     .attr('x', d.x - 50)
                        //     .attr('y', alto_g / 2);
                    }
                } else if ((d.x - 51) > limite_ancho_der) {
                    d3.select('.linea_hover')
                        .transition().duration(100)
                        .style('opacity', 0)
                        .on('end', function () {
                            d3.select('.linea_hover').remove();
                        });
                    // d3.select('.reporte-movil')
                    //     .transition().duration(100)
                    //     .style('opacity', 0)
                    //     .on('end', function () {
                    //         d3.select('.reporte-movil').remove();
                    //     });
                }
            })
            .on('mouseleave', function (d) {
                if ((d.x - 51) < ((ancho - ancho_g) / 2)) {
                    d3.select('.linea_hover')
                        .transition().duration(250)
                        .style('opacity', 0)
                        .on('end', function () {
                            d3.select('.linea_hover').remove();
                        });
                    // d3.select('.reporte-movil')
                    //     .transition().duration(250)
                    //     .style('opacity', 0)
                    //     .on('end', function () {
                    //         d3.select('.reporte-movil').remove();
                    //     });
                }
            });
    }

}

