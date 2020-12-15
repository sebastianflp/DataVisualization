// d3.json('http://localhost:3000/api/v1/employees/vc_pk_rate_city/poli_kill_total')
d3.csv('data/ratios_poli_kill_total.csv')
    .then(function (d) {
        // view_ratios(d.resultados);
        view_ratios(d);
    });

function view_ratios(data) {
    // console.log(data);
    let raza = 'poli_kill_total';

    const color_cv = '#8358c3';

    const color_total = '#169d4e';
    const color_black = '#c61b1b';
    const color_white = '#234ed7';
    const color_hisp = '#f39117';

    let color_k = color_total;

    const ancho = 1000;
    const alto = 700;

    const ancho_g = ancho / 1.2;
    const alto_g = alto / 1.48;

    let n = data.length;
    let sep = ancho_g / n / 4;

    let dx = (ancho_g - (sep * (n + 1))) / (n);

    let kills = [];
    let crime = [];
    data.forEach(function (d) {
        kills.push(d.poli_kill_total);
        crime.push(d.ratio_cv);
    })
    let max_k = 2 + Math.round(Math.max(...kills));
    let max_cv = 2 + Math.round(Math.max(...crime));

    let factor_k = alto_g / (max_k + (4 * max_k / max_cv));
    let factor_cv = alto_g / (max_cv + 4);

    d3.select('#ratios').attr('width', ancho).attr('height', alto);

    d3.select('#ratios')
        .append('rect')
        .attr('class', 'rect_intro-izq')
        .attr('x', (ancho - ancho_g) / 2 + ancho_g / 2)
        .attr('y', (alto - alto_g) / 2 - alto_g / 10)
        .attr('height', alto_g)
        .attr('width', ancho_g / 2)
        .attr('fill', color_k)
    ;

    d3.select('#ratios')
        .append('rect')
        .attr('class', 'rect_intro-der')
        .attr('x', (ancho - ancho_g) / 2)
        .attr('y', (alto - alto_g) / 2 - alto_g / 10)
        .attr('height', alto_g)
        .attr('width', ancho_g / 2)
        .attr('fill', color_cv)
    ;

    let i = 1;
    d3.select('#ratios').on('click', function () {
        if (i) {
            i = 0;
            mostrar_grafico();
        }
    });

    function mostrar_grafico () {
        d3.select('.rect_intro-izq')
            .transition().duration(1000)
            .attr('x', (ancho - ancho_g) / 2 - 40)
            .attr('width', 10)
        ;
        d3.select('.rect_intro-der')
            .transition().duration(1000)
            .attr('x', (ancho - ancho_g) / 2 + ancho_g + 40)
            .attr('width', 10)
            .on('end', function () {
                mostrar_grafico2()
            })
        ;

        function mostrar_grafico2 () {
            // Etiqueta del eje y izquierdo
            d3.select('#ratios')
                .append('text')
                .text('Prom. de asesinatos por policías por cada 1.000 habs.')
                .style('font-size', '20px')
                .attr('transform', 'translate('
                    + ((ancho - ancho_g) / 2 - 50)
                    + ', '
                    + ((alto - alto_g) / 2 + alto_g - alto_g / 10)
                    + ') rotate(-90)')
                .style('opacity', 0)
                .transition().duration(1000)
                .style('opacity', 1);

            // Etiqueta del eje y derecho
            d3.select('#ratios')
                .append('text')
                .text('Prom. de crímenes violentos por 1 Mill. habs.')
                .style('font-size', '20px')
                .attr('transform', 'translate('
                    + ((ancho - ancho_g) / 2 + ancho_g + 50 + 10)
                    + ', '
                    + ((alto - alto_g) / 2 + 40 - alto_g / 10)
                    + ') rotate(90)')
                .style('opacity', 0)
                .transition().duration(1000)
                .style('opacity', 1);

            // Agrega el rectángulo de fondo
            d3.select('#ratios')
                .append('rect')
                .attr('height', alto_g)
                .attr('width', ancho_g)
                .style('fill', 'white')
                .style('stroke', 'black')
                .style('stroke-width', '1px')
                .attr('transform', function () {
                    return "translate(" +
                        (ancho - ancho_g) / 2 + "," + ((alto - alto_g) / 2 - alto_g / 10)
                        + ")";
                })
                .style('opacity', 0)
                .transition().duration(1000)
                .style('opacity', 1);

            // Define los ejes y
            let eje_y_der = [max_cv, max_cv * 3 / 4, max_cv / 2, max_cv / 4, 0];
            let escala_y_der = d3.scaleLinear().domain([0, max_cv + 4]).range([alto_g, 0]);

            let eje_y_izq = [max_k, max_k * 3 / 4, max_k / 2, max_k / 4, 0];
            let escala_y_izq = d3.scaleLinear().domain([0, max_k + 4 * max_k / max_cv]).range([alto_g, 0]);

            let yMiEje_der = d3.axisRight()
                .scale(escala_y_der)
                .tickValues(eje_y_der);
            let yMiEje_izq = d3.axisLeft()
                .scale(escala_y_izq)
                .tickSize(-ancho_g)
                .tickValues(eje_y_izq);

            // Dibuja los ejes y
            d3.select("#ratios")
                .append("g")
                .attr("id", "yMiEje_der")
                .style('font-size', '20px')
                .attr("transform", "translate("
                    + ((ancho - ancho_g) / 2 + ancho_g)
                    + ","
                    + ((alto - alto_g) / 2 - alto_g / 10)
                    + ")")
                .call(yMiEje_der)
                .style('opacity', 0)
                .transition().duration(1000)
                .style('opacity', 1);
            d3.select("#ratios")
                .append("g")
                .attr("id", "yMiEje_izq")
                .style('font-size', '20px')
                .attr("transform", "translate("
                    + ((ancho - ancho_g) / 2)
                    + ","
                    + ((alto - alto_g) / 2 - alto_g / 10)
                    + ")")
                .call(yMiEje_izq)
                .style('opacity', 0)
                .transition().duration(1000)
                .style('opacity', 1);


            // Agrega las barras de crimenes violentos
            d3.select('#ratios')
                .selectAll('.barra')
                .data(data).enter()
                .append('rect')
                .attr('class', 'barra')
                .attr('id', function (d) {
                    return 'n-' + d.poli_kill_total;
                })
                .attr('value', function (d, i) {
                    return i;
                })
                .style('fill', function () {
                    return color_cv;
                })
                .attr('height', 0)
                .attr('width', 0)
                .attr('transform', function (d, i) {
                    return 'translate('
                        + ((ancho - ancho_g) / 2 + sep * (i + 1) + dx * i)
                        + ','
                        + ((alto - alto_g) / 2 - alto_g / 10)
                        + ')'
                })
                .transition().duration(1500)
                .attr('transform', function (d, i) {
                    return 'translate('
                        + ((ancho - ancho_g) / 2 + sep * (i + 1) + dx * i)
                        + ','
                        + ((alto - alto_g) / 2 + alto_g - factor_cv * parseFloat(d.ratio_cv) - dx / 2 - alto_g / 10)
                        + ')'
                })
                .attr('height', dx)
                .attr('width', dx)
                .on('end', function () {
                    d3.select(this)
                        .on('mouseover', mostrarReporte_cv)
                        .on('mouseout', quitarBorde);
                });


            // Agrega las barras de police killings
            d3.select('#ratios')
                .selectAll('.barra_k')
                .data(data).enter()
                .append('rect')
                .attr('class', 'barra_k')
                .attr('id', function (d) {
                    return 'n-' + d.ratio_cv;
                })
                .attr('value', function (d, i) {
                    return i;
                })
                .style('fill', function () {
                    return color_k;
                })
                .attr('height', 0)
                .attr('width', 0)
                .attr('transform', function (d, i) {
                    return 'translate('
                        + ((ancho - ancho_g) / 2 + sep * (i + 1) + dx * i)
                        + ','
                        + ((alto - alto_g) / 2 + alto_g - alto_g / 10)
                        + ')'
                })
                .transition().duration(1500)
                .attr('transform', function (d, i) {
                    return 'translate('
                        + ((ancho - ancho_g) / 2 + sep * (i + 1) + dx * i)
                        + ','
                        // + ((alto - alto_g) / 2 + alto_g - factor_cv * parseFloat(d.ratio_cv) - dx / 2 - alto_g / 10)
                        + ((alto - alto_g) / 2 + alto_g - factor_k * parseFloat(d.poli_kill_total) + dx / 2 - alto_g / 10)
                        // + ((alto - alto_g) / 2 + alto_g - factor_k * parseFloat(d.poli_kill_total) - dx / 2 - alto_g / 10)
                        + ')'
                })
                .attr('height', dx)
                .attr('width', dx)
                .on('end', function () {
                    d3.select(this)
                        .on('mouseover', mostrarReporte_kill)
                        .on('mouseout', quitarBorde);
                });


            // Agrega el eje x
            d3.select('#ratios')
                .selectAll('.label-x-ratio')
                .data(data).enter()
                .append('text')
                .attr('class', 'label-x-ratio')
                .text(function (d) {
                    return d.ciudad;
                })
                .style('color', 'black')
                .style('font-size', 16)
                .attr('transform', function (d, i) {
                    return 'translate('
                        + ((ancho - ancho_g) / 2 + sep * (i + 1) + dx * i)
                        + ','
                        + ((alto - alto_g) / 2 + alto_g + 10 - alto_g / 10)// + d.ciudad.length * 9)
                        + ') rotate(-90)';
                })
                .style('opacity', 0);

            let aux = [];
            data.forEach(function (d, i) {
                aux.push(d3.select('#ratios').selectAll('.label-x-ratio').nodes()[i].getBBox().width);
            });

            d3.select('#ratios')
                .selectAll('.label-x-ratio')
                .data(data)
                .attr('transform', function (d, i) {
                    return 'translate('
                        + ((ancho - ancho_g) / 2 + sep * (i + 1) + dx * i + 16 / 2)
                        + ','
                        + ((alto - alto_g) / 2 + alto_g + 10 + aux[i] - alto_g / 10)
                        + ') rotate(-90)';
                })
                .transition().duration(1500)
                .style('opacity', 1)

            let fillScale = d3.scaleOrdinal()
                .domain(["Crímenes violentos", "Asesinatos de policías"])
                .range([color_cv, color_k])
            // Agrega leyenda
            let legendA = d3.legendColor().scale(fillScale)
            d3.select("#ratios")
                .append("g")
                .attr('class', 'leyenda_ratios')
                .style("font-size", '16px')
                .attr("transform", "translate("
                    + (ancho / 2 + 230)
                    + ", "
                    + (135 - alto_g / 10)
                    + ")")
                .call(legendA)
                .style('opacity', 0)
                .transition().duration(1000)
                .style('opacity', 1);


            d3.select('#select_raza')
                .style('display', 'block')
                .style('position', 'absolute')
                .style('top', '80px')
                .style('left', '150px')
                .style('border', '2px solid black');


            // Función al poner el mouse sobre la cosa
            function mostrarReporte_kill (d, j) {
                let indice = d3.select(this)._groups[0][0].attributes[2].nodeValue;//.property('value');
                d3.select(this)
                    .style('stroke', color_k)
                    .transition().duration(250)
                    .style('stroke-width', '10px')
                    .style('stroke-opacity', 0.4);
                var grupo = d3.select('#ratios')
                    .append('g')
                    .attr('class', 'reporte_fijo');
                grupo
                    .append('rect')
                    .attr('height', 50)
                    .attr('width', 250)
                    .attr('x', function () {
                        if (indice >= 39)
                            return indice * (sep + dx) + 107 - 250 - dx - 20;
                        else
                            return indice * (sep + dx) + 107;
                    })
                    .attr('y', function () {
                        return ((alto - alto_g) / 2 + alto_g - j[raza] * factor_k - 40 - 5 - alto_g / 10);
                    })
                    .style('opacity', 0.8)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1)
                    .attr('stroke-opacity', 0.8)
                    .attr('fill', 'white');

                // const valor = parseInt(d3.select(this).property('id').substring(2));
                grupo
                    .append('text')
                    .attr('class', 'reporte_ciudad-1')
                    .text('Ciudad: ' + data[indice].ciudad)
                    .attr('transform', function () {
                        if (indice >= 39)
                            return 'translate('
                                + (indice * (sep + dx) + 107 + 4 - 250 - dx - 20)
                                + ','
                                + ((alto - alto_g) / 2 + alto_g - j[raza] * factor_k - 30 - alto_g / 10)
                                + ')';
                        else
                            return 'translate('
                                + (indice * (sep + dx) + 107 + 4)
                                + ','
                                + ((alto - alto_g) / 2 + alto_g - j[raza] * factor_k - 30 - alto_g / 10)
                                + ')';
                    });
                grupo
                    .append('text')
                    .attr('class', 'reporte_ciudad-2')
                    .text('Asesinatos de policías: ' + data[indice][raza])
                    .style('font-weight', 'bold')
                    .attr('transform', function () {
                        if (indice >= 39)
                            return 'translate('
                                + (indice * (sep + dx) + 107 + 4 - 250 - dx - 20)
                                + ','
                                + ((alto - alto_g) / 2 + alto_g - j[raza] * factor_k - 30 + 15 - alto_g / 10)
                                + ')'
                        else
                            return 'translate('
                                + (indice * (sep + dx) + 107 + 4)
                                + ','
                                + ((alto - alto_g) / 2 + alto_g - j[raza] * factor_k - 30 + 15 - alto_g / 10)
                                + ')'
                    });
                grupo
                    .append('text')
                    .attr('class', 'reporte_ciudad-3')
                    .text('Ratio de crímenes violentos: ' + data[indice].ratio_cv)
                    .attr('transform', function () {
                        if (indice >= 39)
                            return 'translate('
                                + (indice * (sep + dx) + 107 + 4 - 250 - dx - 20)
                                + ','
                                + ((alto - alto_g) / 2 + alto_g - j[raza] * factor_k - 30 + 15 * 2 - alto_g / 10)
                                + ')';
                        else
                            return 'translate('
                                + (indice * (sep + dx) + 107 + 4)
                                + ','
                                + ((alto - alto_g) / 2 + alto_g - j[raza] * factor_k - 30 + 15 * 2 - alto_g / 10)
                                + ')';
                    });
            }

            function mostrarReporte_cv (d, j) {
                let indice = d3.select(this)._groups[0][0].attributes[2].nodeValue;//.property('value');
                d3.select(this)
                    .style('stroke', color_cv)
                    .transition().duration(250)
                    .style('stroke-width', '10px')
                    .style('stroke-opacity', 0.4);
                var grupo = d3.select('#ratios')
                    .append('g')
                    .attr('class', 'reporte_fijo');
                grupo
                    .append('rect')
                    .attr('height', 50)
                    .attr('width', 250)
                    .attr('x', function () {
                        if (indice >= 39)
                            return indice * (sep + dx) + 107 - 250 - dx - 20;
                        else
                            return indice * (sep + dx) + 107;
                    })
                    .attr('y', function () {
                        return ((alto - alto_g) / 2 + alto_g - j.ratio_cv * factor_cv - 40 - 5 - alto_g / 10);
                    })
                    .style('opacity', 0.8)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1)
                    .attr('stroke-opacity', 0.8)
                    .attr('fill', 'white');

                // const valor = parseInt(d3.select(this).property('id').substring(2));
                grupo
                    .append('text')
                    .attr('class', 'reporte_ciudad-1')
                    .text('Ciudad: ' + data[indice].ciudad)
                    .attr('transform', function () {
                        if (indice >= 39)
                            return 'translate('
                                + (indice * (sep + dx) + 107 + 4 - 250 - dx - 20)
                                + ','
                                + ((alto - alto_g) / 2 + alto_g - j.ratio_cv * factor_cv - 30 - alto_g / 10)
                                + ')'
                        else
                            return 'translate('
                                + (indice * (sep + dx) + 107 + 4)
                                + ','
                                + ((alto - alto_g) / 2 + alto_g - j.ratio_cv * factor_cv - 30 - alto_g / 10)
                                + ')'
                    });
                grupo
                    .append('text')
                    .attr('class', 'reporte_ciudad-2')
                    .text('Asesinatos de policías: ' + data[indice][raza])
                    .attr('transform', function () {
                        if (indice >= 39)
                            return 'translate('
                                + (indice * (sep + dx) + 107 + 4 - 250 - dx - 20)
                                + ','
                                + ((alto - alto_g) / 2 + alto_g - j.ratio_cv * factor_cv - 30 + 15 - alto_g / 10)
                                + ')'
                        else
                            return 'translate('
                                + (indice * (sep + dx) + 107 + 4)
                                + ','
                                + ((alto - alto_g) / 2 + alto_g - j.ratio_cv * factor_cv - 30 + 15 - alto_g / 10)
                                + ')'
                    });
                grupo
                    .append('text')
                    .attr('class', 'reporte_ciudad-3')
                    .text('Ratio de crímenes violentos: ' + data[indice].ratio_cv)
                    .style('font-weight', 'bold')
                    .attr('transform', function () {
                        if (indice >= 39)
                            return 'translate('
                                + (indice * (sep + dx) + 107 + 4 - 250 - dx - 20)
                                + ','
                                + ((alto - alto_g) / 2 + alto_g - j.ratio_cv * factor_cv - 30 + 15 * 2 - alto_g / 10)
                                + ')'
                        else
                            return 'translate('
                                + (indice * (sep + dx) + 107 + 4)
                                + ','
                                + ((alto - alto_g) / 2 + alto_g - j.ratio_cv * factor_cv - 30 + 15 * 2 - alto_g / 10)
                                + ')'
                    });
            }

            function quitarBorde (data) {
                d3.select(this)
                    .transition().duration(250)
                    .style('stroke-width', '0px');
                d3.select('.reporte_fijo')
                    .remove();
            }

            d3.select('#select_raza').on('change', function () {
                const raza = d3.select(this).property('value');
                // d3.json('http://localhost:3000/api/v1/employees/vc_pk_rate_city/' + raza)
                d3.csv('data/ratios_' + raza + '.csv')
                    .then(function (d) {
                        // update_grafico_ratios(d.resultados, raza);
                        update_grafico_ratios(d, raza);
                    });
            });

            function update_grafico_ratios (data2, raza2) {
                data = data2;
                raza = raza2;
                // console.log(data);
                if (raza === 'poli_kill_total')
                    color_k = color_total;
                else if (raza === 'poli_kill_black')
                    color_k = color_black;
                else if (raza === 'poli_kill_white')
                    color_k = color_white;
                else if (raza === 'poli_kill_hispanic')
                    color_k = color_hisp;

                kills = [];
                data.forEach(function (d) {
                    kills.push(parseFloat(d[raza]));
                })
                max_k = 2 + Math.round(Math.max(...kills));
                factor_k = alto_g / (max_k + (4 * max_k / max_cv));

                eje_y_izq = [max_k, max_k * 3 / 4, max_k / 2, max_k / 4, 0];
                escala_y_izq = d3.scaleLinear().domain([0, max_k + 4 * max_k / max_cv]).range([alto_g, 0]);

                yMiEje_izq = d3.axisLeft()
                    .scale(escala_y_izq)
                    .tickSize(-ancho_g)
                    .tickValues(eje_y_izq);

                d3.select("#yMiEje_izq").transition().duration(1000)
                    .call(yMiEje_izq);

                // Agrega las barras de police killings
                d3.select('#ratios')
                    .selectAll('.barra_k')
                    .data(data)
                    .transition().duration(750)
                    .attr('transform', function (d, i) {
                        return 'translate('
                            + ((ancho - ancho_g) / 2 + sep * (i + 1) + dx * i)
                            + ','
                            + ((alto - alto_g) / 2 + alto_g - alto_g / 10)
                            + ')'
                    })
                    // .attr('height', 0)
                    .style('opacity', 0)
                    .style('fill', color_k)
                    .transition().duration(750)
                    .style('opacity', 1)
                    .attr('transform', function (d, i) {
                        return 'translate('
                            + ((ancho - ancho_g) / 2 + sep * (i + 1) + dx * i)
                            + ','
                            + ((alto - alto_g) / 2 + alto_g - factor_k * parseFloat(d[raza]) - dx / 2 - alto_g / 10)
                            + ')'
                    })
                    .attr('height', function (d) {
                        if (parseFloat(d[raza]) !== 0) return dx
                    })
                    .on('end', function () {
                        d3.select(this)
                            .on('mouseover', mostrarReporte_kill)
                            .on('mouseout', quitarBorde);
                    });


                // Agrega las barras de crimenes violentos
                d3.select('#ratios')
                    .selectAll('.barra')
                    .data(data)
                    .attr('id', function (d) {
                        return 'n-' + d[raza];
                    })
                    .transition().duration(750)
                    // .attr('height', 0)
                    .style('opacity', 0)
                    .attr('transform', function (d, i) {
                        return 'translate('
                            + ((ancho - ancho_g) / 2 + sep * (i + 1) + dx * i)
                            + ','
                            + ((alto - alto_g) / 2 + alto_g - alto_g / 10)
                            + ')'
                    })
                    .transition().duration(750)
                    .style('opacity', 1)
                    .attr('transform', function (d, i) {
                        return 'translate('
                            + ((ancho - ancho_g) / 2 + sep * (i + 1) + dx * i)
                            + ','
                            + ((alto - alto_g) / 2 + alto_g - factor_cv * parseFloat(d.ratio_cv) - dx / 2 - alto_g / 10)
                            + ')'
                    })
                    .attr('height', function (d) {
                        if (parseFloat(d.ratio_cv) !== 0) return dx
                    });


                d3.select('.rect_intro-izq').transition().duration(1000).attr('fill', color_k);

                // Agrega el eje x
                d3.select('#ratios')
                    .selectAll('.label-x-ratio')
                    .data(data)
                    .transition().duration(500)
                    .style('opacity', 0)
                    .transition().duration(1)
                    .text(function (d) {
                        return d.ciudad;
                    })
                    .on('end', function () {
                        aux = [];
                        data.forEach(function (d, i) {
                            aux.push(d3.select('#ratios').selectAll('.label-x-ratio').nodes()[i].getBBox().width);
                        });

                        d3.select('#ratios')
                            .selectAll('.label-x-ratio')
                            .data(data)
                            .attr('transform', function (d, i) {
                                return 'translate('
                                    + ((ancho - ancho_g) / 2 + sep * (i + 1) + dx * i + 16 / 2)
                                    + ','
                                    + ((alto - alto_g) / 2 + alto_g + 10 + aux[i] - alto_g / 10)
                                    + ') rotate(-90)';
                            })
                            .transition().duration(1500)
                            .style('opacity', 1)
                    });


                fillScale = d3.scaleOrdinal()
                    .domain(["Crímenes violentos", "Asesinatos de policías"])
                    .range([color_cv, color_k])
                // Agrega leyenda
                let legendA = d3.legendColor().scale(fillScale)
                d3.select('.leyenda_ratios')
                    .transition().duration(1000)
                    .style('opacity', 0);
                d3.select(".leyenda_ratios")
                    .call(legendA)
                    .transition().duration(1000)
                    .style('opacity', 1);
            }

            d3.select('.textos-ratios-1')
                .on('click', function () {
                    d3.select('.textos-ratios-2')
                        .on('click', function () {
                            d3.select('.textos-ratios-3')
                                .transition().duration(500)
                                .style('opacity', 1);
                        })
                        .transition().duration(500)
                        .style('opacity', 1);
                });
        }
    }
}

