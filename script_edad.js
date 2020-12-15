function ejecuta_grafico(rango) {
    // d3.json('http://localhost:3000/api/v1/employees/edad/' + rango)
    d3.csv('data/edad_' + rango + '.csv')
        .then(function (d) {
            v_barras(d);
        });
}

function v_barras(aux) {
    // const data = aux.resultados;
    const data = aux;
    const ancho = 1000;
    const alto = 600;

    const ancho_g = ancho / 1.2;
    const alto_g = alto / 1.5;

    let n = data.length;
    let des_x = ancho_g / n / 2;

    let blacks = [];
    let totales = [];
    let rangos = [];
    let rango_num = []
    for (let i = 0; i < data.length; i++) {
        blacks.push(parseInt(data[i].n_black));
        totales.push(parseInt(data[i].n));
        rangos.push(data[i].Edad);
        // rango_num.push((ancho - ancho_g) / 2 + (ancho_g / (n + 1)) * i + des_x + 18);
        rango_num.push(i+1);
    }
    let total_tot = 0;
    let total_azul = 0;
    totales.forEach(function (numero){
        total_tot += numero;
        if (numero >= 1000) {
            total_azul += numero;
        }
    })

    const porc_azul = total_azul / total_tot * 100;
    d3.select('.total-total').text(Intl.NumberFormat('de-DE').format(total_tot));
    d3.select('.total-azul').text(Intl.NumberFormat('de-DE').format(total_azul));
    d3.select('.porc-azul').text(Math.round(porc_azul) + '%');
    let max_to = Math.max(...totales);
    let max_val = Math.round(max_to/100);
    max_val = (max_val % 2 === 0?max_val + 2: max_val + 1) * 100;

    let factor = alto_g / max_val;

    d3.select('#barras').attr('width', ancho).attr('height', alto);

    // Agrega las etiquetas de ejes
    d3.select('#barras')
        .append('text')
        .text('Rango de edad')
        .style('font-size', '20px')
        .attr('transform', 'translate(' +
            ((ancho - ancho_g) / 2 + ancho_g / 2 - 100) +
            ',' +
            ((alto - alto_g) / 2 + alto_g + 88) +
            ')');
    d3.select('#barras')
        .append('text')
        .text('Cantidad de asesinatos')
        .style('font-size', '20px')
        .attr('transform', 'translate(' +
            ((ancho - ancho_g) / 2 - 70) +
            ',' +
            ((alto - alto_g) / 2 + alto_g / 2 + 105) +
            ') rotate(-90)');

    // Agrega el rectángulo de fondo
    d3.select('#barras')
        .append('rect')
        .attr('height', alto_g)
        .attr('width', ancho_g)
        .style('fill', 'white')
        .style('stroke', 'black')
        .style('stroke-width', '1px')
        .attr('transform', function () {
            return "translate(" +
                (ancho - ancho_g) / 2 + "," + (alto - alto_g) / 2
                + ")";
        });

    let eje_y = [max_val, max_val * 3 / 4, max_val / 2, max_val / 4, 0];
    let miEscalaY1 = d3.scaleLinear().domain([0, max_val]).range([alto_g, 0]);

    let yMiEje1 = d3.axisLeft()
        .scale(miEscalaY1)
        .tickSize(-ancho_g)
        .tickValues(eje_y);

    d3.select('#barras')
        .append('line')
        .attr('class', 'linea_1000')
        .attr('x1', (ancho - ancho_g) / 2)
        .attr('y1', (alto - alto_g) / 2 + alto_g - 1000 * alto_g / max_val)
        .attr('x2', (ancho - ancho_g) / 2 + ancho_g)
        .attr('y2', (alto - alto_g) / 2 + alto_g - 1000 * alto_g / max_val)
        .attr('stroke', 'red')
        .attr('stroke-dasharray', 15)
        .attr('stroke-width', 2.5);

    d3.select("#barras")
        .append("g") //es parte de un grupo
        .attr("id", "yMiEje1")
        .style('font-size', '20px')
        .attr("transform", "translate(" + (ancho - ancho_g) / 2 + "," + (alto - alto_g) / 2 + ")")
        .call(yMiEje1);

    // Agrega las barras del total
    d3.select('#barras')
        .selectAll('.barra')
        .data(data).enter()
        .append('rect')
        .attr('class', 'barra')
        .attr('id', function (d) {
            return 'n-' + d.n_black;
        })
        .attr('value', function (d, i) {
            return i;
        })
        .style('fill', function (d) {
            if (d.n > 1000) {
                return '#4d5ec6';
            } else {
                return '#adbcff';
            }
        })
        .attr('height', function (d) {
            return factor * d.n;
        })
        .attr('width', (ancho_g / (n + 1)) / 1.5)
        .attr('transform', function (d, i) {
            return 'translate(' +
                ((ancho - ancho_g) / 2 + (ancho_g / (n + 1)) * i + des_x)
                + ','
                + ((alto - alto_g) / 2 + alto_g - factor * d.n)
                + ')'
        })
        .on('mouseover', mostrarReporte)
        .on('mouseout', quitarBorde)
    ;
    // Agrega las barras de black people
    d3.select('#barras').selectAll('.barra_black')
        .data(data).enter()
        .append('rect')
        .attr('class', 'barra_black')
        .attr('id', function (d) {
            return 'n-' + d.n;
        })
        .attr('value', function (d, i) {
            return i;
        })
        .style('fill', function () {
            return '#ff0000';
        })
        .attr('height', function (d) {
            return factor * d.n_black;
        })
        .attr('width', (ancho_g / (n + 1)) / 1.5 - 15)
        .attr('transform', function (d, i) {
            return 'translate('
                + ((ancho - ancho_g) / 2 + (ancho_g / (n + 1)) * i + des_x + 7.5 )
                + ','
                + ((alto - alto_g) / 2 + alto_g - factor * d.n_black)
                + ')'
        })
        .on('mouseover', mostrarReporte2)
        .on('mouseout', quitarBorde);

    // Agrega el eje x
    d3.select('#barras')
        .selectAll('.label-x')
        .data(data).enter()
        .append('text')
        .attr('class', 'label-x')
        .text(function (d) {
            return d.Edad;
        })
        .style('color', 'black')
        .style('font-size', 16)
        .attr('transform', function (d, i) {
            if (i === n - 1) return 'translate('
                + ((ancho - ancho_g) / 2 + (ancho_g / (n + 1)) * i + des_x + 18)
                + ','
                + (alto - (alto - alto_g) / 2 + 20 + 35 - 14)
                + ') rotate(-90)';
            else if (d.Edad.length === 3) return 'translate('
                                    + ((ancho - ancho_g) / 2 + (ancho_g / (n + 1)) * i + des_x + 18)
                                    + ','
                                    + (alto - (alto - alto_g) / 2 + 20 + 35 - 17)
                                    + ') rotate(-90)';
            else return 'translate('
                            + ((ancho - ancho_g) / 2 + (ancho_g / (n + 1)) * i + des_x + 18)
                            + ','
                            + (alto - (alto - alto_g) / 2 + 20 + 35)
                            + ') rotate(-90)';
        });

    let fillScale = d3.scaleOrdinal()
        .domain(["Total", "Mayor a 1000", "Gente negra"])
        .range(["#adbcff", "#4d5ec6", '#ff0000'])
    // Agrega leyenda
    let legendA = d3.legendColor().scale(fillScale)
    d3.select("#barras")
        .append("g")
        .style("font-size", '16px')
        .attr("transform", "translate(" + (ancho / 2 + 250) + ", 118)")
        .call(legendA);

    // Función al poner el mouse sobre la cosa
    function mostrarReporte (data) {
        d3.select(this)
            .style('stroke', 'green')
            .style('stroke-width', '10px')
            .style('stroke-opacity', 0.4)
        ;
        const black = parseInt(d3.select(this).property('id').substring(2));
        const total = data.target.height.animVal['value'] / factor;
        d3.select('.valor-total')
            .text(Intl.NumberFormat('de-DE').format(total));
        d3.select('.valor-black')
            .text(Intl.NumberFormat('de-DE').format(black));
        d3.select('.rango')
            .text(function () {
                return data.target.__data__.Edad;
            });
    }
    function mostrarReporte2 (data) {
        d3.select(this)
            .style('stroke', 'orange')
            .style('stroke-width', '10px')
            .style('stroke-opacity', 0.5)
        ;
        const black = data.target.height.animVal['value'] / factor;
        const total = parseInt(d3.select(this).property('id').substring(2));
        d3.select('.valor-total')
            .text(Intl.NumberFormat('de-DE').format(total));
        d3.select('.valor-black')
            .text(Intl.NumberFormat('de-DE').format(black));
        d3.select('.rango')
            .text(function () {
                return data.target.__data__.Edad;
            });
    }
    function quitarBorde (data) {
        d3.select(this).style('stroke', 'None');
    }

    d3.select('#select_rango').on('change', function () {
        const rango = d3.select(this).property('value');
        // d3.json('http://localhost:3000/api/v1/employees/Edad/' + rango)
        d3.csv('data/edad_' + rango + '.csv')
            .then(function (d) {
                update_grafico(d);
            });
    });

    function update_grafico (aux) {
        // var data = aux.resultados;
        var data = aux;
        n = data.length;
        des_x = ancho_g / n / 2;
        console.log(des_x);

        totales = []
        for (let i = 0; i < data.length; i++) {
            totales.push(parseInt(data[i].n));
        }
        total_azul = 0;
        totales.forEach(function (numero){
            if (numero >= 1000) {
                total_azul += numero;
            }
        })
        const porc_azul = total_azul / total_tot * 100;
        d3.select('.total-azul').text(Intl.NumberFormat('de-DE').format(total_azul));
        d3.select('.porc-azul').text(Math.round(porc_azul) + '%');
        max_to = Math.max(...totales);
        max_val = Math.round(max_to/100);
        max_val = (max_val % 2 === 0?max_val + 2: max_val + 1) * 100;
        factor = alto_g / max_val;

        eje_y = [max_val, max_val * 3 / 4, max_val / 2, max_val / 4, 0];
        miEscalaY = d3.scaleLinear().domain([0, max_val]).range([alto_g, 0]);
        yMiEje1 = d3.axisLeft()
            .scale(miEscalaY)
            .tickSize(-ancho_g)
            .tickValues(eje_y);
        d3.select("#yMiEje1")
            .transition().duration(1000)
            .call(yMiEje1);

        // Modifica la línea de 1000
        d3.select('.linea_1000')
            .transition().duration(1000)
            .attr('y1', (alto - alto_g) / 2 + alto_g - 1000 * alto_g / max_val)
            .attr('y2', (alto - alto_g) / 2 + alto_g - 1000 * alto_g / max_val)

        // Agrega las barras del total
        d3.select('#barras')
            .selectAll('.barra')
            .data(data)
            .attr('id', function (d) {
                return 'n-' + d.n_black;
            })
            .transition().duration(1000)
            .style('fill', function (d) {
                if (d.n > 1000) {
                    return '#4d5ec6';
                } else {
                    return '#adbcff';
                }
            })
            .attr('height', function (d) {
                return factor * d.n;
            })
            .attr('width', (ancho_g / (n + 1)) / 1.5)
            .attr('transform', function (d, i) {
                return 'translate(' +
                    ((ancho - ancho_g) / 2 + (ancho_g / (n + 1)) * i + des_x)
                    + ','
                    + ((alto - alto_g) / 2 + alto_g - factor * d.n)
                    + ')'
            });
        d3.select('#barras')
            .selectAll('.barra')
            .data(data).exit()
            .transition().duration(1000)
            .attr('height', 0)
            .attr('width', 0)
            .attr('transform', function (d, i) {
                return 'translate(' +
                    ((ancho - ancho_g) / 2 + (ancho_g / (n + 1)) * i + des_x + (ancho_g / (n + 1)) / 1.5 / 2)
                    + ','
                    + ((alto - alto_g) / 2 + alto_g)
                    + ')'
            });


        // Agrega las barras de black people
        d3.select('#barras')
            .selectAll('.barra_black')
            .data(data)
            .attr('id', function (d) {
                return 'n-' + d.n;
            })
            .transition().duration(1000)
            .attr('height', function (d) {
                return factor * d.n_black;
            })

            .attr('width', (ancho_g / (n + 1)) / 1.5 - 15)
            .attr('transform', function (d, i) {
                return 'translate('
                    + ((ancho - ancho_g) / 2 + (ancho_g / (n + 1)) * i + des_x + 7.5 )
                    + ','
                    + ((alto - alto_g) / 2 + alto_g - factor * d.n_black)
                    + ')'
            });
        d3.select('#barras').selectAll('.barra_black')
            .data(data).exit()
            .transition().duration(1000)
            .attr('height', 0)
            .attr('transform', function (d, i) {
                return 'translate('
                    + ((ancho - ancho_g) / 2 + (ancho_g / (n + 1)) * i + des_x + 7.5 + ((ancho_g / (n + 1)) / 1.5 - 15)/2)
                    + ','
                    + ((alto - alto_g) / 2 + alto_g)
                    + ')'
            });


        d3.select('#barras')
            .selectAll('.label-x')
            .data(data)
            .transition().duration(1000)
            .attr('class', 'label-x')
            .text(function (d) {
                return d.Edad;
            })
            .attr('transform', function (d, i) {
                if (i === n - 1) return 'translate('
                    + ((ancho - ancho_g) / 2 + (ancho_g / (n + 1)) * i + des_x + (ancho_g / (n + 1)) / 1.5 / 2)
                    + ','
                    + (alto - (alto - alto_g) / 2 + 20 + 35 - 14)
                    + ') rotate(-90)';
                else if (d.Edad.length === 3) return 'translate('
                    + ((ancho - ancho_g) / 2 + (ancho_g / (n + 1)) * i + des_x + (ancho_g / (n + 1)) / 1.5 / 2)
                    + ','
                    + (alto - (alto - alto_g) / 2 + 20 + 35 - 17)
                    + ') rotate(-90)';
                else return 'translate('
                        + ((ancho - ancho_g) / 2 + (ancho_g / (n + 1)) * i + des_x + (ancho_g / (n + 1)) / 1.5 / 2)
                        + ','
                        + (alto - (alto - alto_g) / 2 + 20 + 35)
                        + ') rotate(-90)';
            });
        d3.select('#barras')
            .selectAll('.label-x')
            .data(data).exit()
            .transition().duration(1000)
            .text('');
    }
}

ejecuta_grafico(5);