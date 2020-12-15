// d3.json('http://localhost:3000/api/v1/employees/genero/')
d3.csv('data/genero_1.csv')
    .then(function (d) {
        // console.log(d);
        v_gender(d);
    });
function v_gender(aux) {
    // const data = aux.resultados.slice(0, 2);
    const data = aux.slice(0, 2);

    // const pixeles = window.screen.width - 50 * 2 - 15 * 2;
    const pixeles = window.screen.width;

    const ancho = "100%";
    const alto = 500;

    const n_tot = parseInt(data[0].n) + parseInt(data[1].n);

    const color_f = '#1c99db';
    const color_f_hover = '#1978a9';
    const color_m = '#ff7e33';
    const color_m_hover = '#d26423';

    d3.select('#gender').attr('height', 300).attr('width', ancho);
    d3.select('#f_img').style('position', 'absolute').style('top', '50px').style('left', '37%');
    d3.select('#m_img').style('position', 'absolute').style('top', '50px').style('left', '50%');
    let i = 0
    d3.select('#gender').on('click', function () {
        if (i === 0) {
            i = 1;
            // d3.json('http://localhost:3000/api/v1/employees/genero_raza/White')
            d3.csv('data/genero_2.csv')
                .then(function (d) {
                    var data2 = d.slice(0, 2);
                    // var data2 = d.resultados.slice(0, 2);
                    var n_white = parseInt(data2[0].n) + parseInt(data2[1].n);

                    // d3.json('http://localhost:3000/api/v1/employees/genero_raza/Black')
                    d3.csv('data/genero_3.csv')
                        .then(function (d) {
                            // var data3 = d.resultados.slice(0, 2);
                            var data3 = d.slice(0, 2);
                            var n_black = parseInt(data3[0].n) + parseInt(data3[1].n);

                            d3.select('#f_img').transition().duration(2000).style('left', '4%');
                            d3.select('#m_img').transition().duration(2000).style('left', '80%');
                            d3.select('#gender').transition().duration(2000).attr('height', alto)

                            function overRect (d, i) {
                                let indice = d3.select(this).property('id');
                                d3.select(this)
                                    .style('z-index', 100)
                                    .transition().duration(500)
                                    .attr('fill', function () {
                                        if (i.genero === 'Male') return color_m_hover;
                                        else if (i.genero === 'Female') return color_f_hover;
                                    })
                                    .attr('height', function () {
                                        if (indice === 'rect_1') return 80;
                                        else return 40;
                                    })
                                    .attr('width', function () {
                                        if (indice === 'rect_1')
                                            return ((i.n * 100 / n_tot) * 56 / 100 + 1) + "%";
                                        else if (indice === 'rect_2')
                                            return ((i.n * 100 / n_white) * 56 / 100 + 1) + "%";
                                        else
                                            return ((i.n * 100 / n_black) * 56 / 100 + 1) + "%";
                                    })
                                    .attr('y', function () {
                                        if (indice === 'rect_1') return '90px';
                                        else if (indice === 'rect_2') return '295px';
                                        else return '435px';
                                    })
                                    .attr('x', function () {
                                        if (i.genero === 'Female') {
                                            return (22 - 1) + "%";
                                        } else if (i.genero === 'Male') {
                                            if (indice === 'rect_1')
                                                return (78 - (i.n * 100 / n_tot) * 56 / 100) + "%";
                                            else if (indice === 'rect_2')
                                                return (78 - (i.n * 100 / n_white) * 56 / 100) + "%";
                                            else if (indice === 'rect_3')
                                                return (78 - (i.n * 100 / n_black) * 56 / 100) + "%";
                                        }
                                    });
                            }
                            function outRect (d, i) {
                                let indice = d3.select(this).property('id');
                                // console.log(i);
                                d3.select(this)
                                    .style('z-index', 1)
                                    .transition().duration(500)
                                    .attr('fill', function () {
                                        if (i.genero === 'Male') return color_m;
                                        else if (i.genero === 'Female') return color_f;
                                    })
                                    .attr('height', function () {
                                        if (indice === 'rect_1') return 60;
                                        else return 30;
                                    })
                                    .attr('width', function () {
                                        if (indice === 'rect_1')
                                            return ((i.n * 100 / n_tot) * 56 / 100) + "%";
                                        else if (indice === 'rect_2')
                                            return ((i.n * 100 / n_white) * 56 / 100) + "%";
                                        else
                                            return ((i.n * 100 / n_black) * 56 / 100) + "%";
                                    })
                                    .attr('y', function () {
                                        if (indice === 'rect_1') return '100px';
                                        else if (indice === 'rect_2') return '300px';
                                        else return '440px';
                                    })
                                    .attr('x', function () {
                                        if (i.genero === 'Female') {
                                            return "22%";
                                        } else if (i.genero === 'Male') {
                                            if (indice === 'rect_1')
                                                return (78 - (i.n * 100 / n_tot) * 56 / 100) + "%";
                                            else if (indice === 'rect_2')
                                                return (78 - (i.n * 100 / n_white) * 56 / 100) + "%";
                                            else if (indice === 'rect_3')
                                                return (78 - (i.n * 100 / n_black) * 56 / 100) + "%";
                                        }
                                    });
                            }

                            // Añade la primera fila de rectángulos
                            d3.select('#gender')
                                .selectAll('#rect_1')
                                .data(data).enter()
                                .append('rect')
                                .attr('id', function (d, i) {
                                    return 'rect_1';
                                })
                                .on('mouseover', overRect)
                                .on('mouseout', outRect)
                                .attr('height', '60')
                                .attr('width', '0')
                                .attr('y', '100px')
                                .attr('x', function (d, i) {
                                    if (i === 0) {
                                        return (22 + (d.n * 100 / n_tot) * 56 / 100) + "%";
                                    } else if (i === 1) {
                                        return (78 - (d.n * 100 / n_tot) * 56 / 100) + "%";
                                    }
                                })
                                .attr('fill', function (d, i) {
                                    if (i === 0) return color_f;
                                    else if (i === 1) return color_m;
                                })
                                .transition().duration(3000)
                                .attr('x', function (d, i) {
                                    if (i === 0) return '22%';
                                    else if (i === 1) return (78 - (d.n * 100 / n_tot) * 56 / 100) + "%";
                                })
                                .attr('width', function (d) {
                                    return (d.n * 100 / n_tot) * 56 / 100 + "%";
                                });

                            // Texto del porcentaje
                            d3.select('#gender')
                                .selectAll('text_genero_1')
                                .data(data).enter()
                                .append('text')
                                .attr('class', 'text_genero_1')
                                .style('font-size', function (d, i) {
                                    if (i === 0) {
                                        return '40px';
                                    } else if (i === 1) {
                                        return '50px';
                                    }
                                })
                                .attr('y', '55px')
                                .text(function (d, i) {
                                    return Math.round((d.n * 100 / n_tot) * 100) / 100 + '%';
                                })
                                .style('font-weight', 'bold')
                                .style('opacity', 0)
                                .attr('fill', function (d, i) {
                                    if (i === 0) return color_f;
                                    else if (i === 1) return color_m;
                                });

                            let aux = [];
                            data.forEach(function (d, i) {
                                aux.push(d3.select('#gender').selectAll('.text_genero_1').nodes()[i].getBBox().width);
                            });
                            // console.log(aux);
                            d3.select('#gender')
                                .selectAll('.text_genero_1')
                                .data(data)
                                .attr('x', function (d, i) {
                                    if (i === 0) return '22%';
                                    else if (i === 1) return (78 - aux[i] * 100 / pixeles) + '%';
                                })
                                .transition().duration(3000)
                                .style('opacity', 1)

                            // Texto del valor
                            d3.select('#gender')
                                .selectAll('text_genero_2')
                                .data(data).enter()
                                .append('text')
                                .attr('class', 'text_genero_2')
                                .text(function (d, i) {
                                    if (i <= 1) return Intl.NumberFormat('de-DE').format(d.n);
                                })
                                .style('font-size', '25px')
                                .attr('y', '85px')
                                .style('opacity', 0)
                                .attr('fill', function (d, i) {
                                    if (i === 0) return color_f;
                                    else if (i === 1) return color_m;
                                });

                            aux = [];
                            data.forEach(function (d, i) {
                                aux.push(d3.select('#gender').selectAll('.text_genero_2').nodes()[i].getBBox().width);
                            });
                            d3.select('#gender')
                                .selectAll('.text_genero_2')
                                .data(data)
                                .attr('x', function (d, i) {
                                    if (i === 0) return '22%';
                                    else if (i === 1) return (78 - aux[i] * 100 / pixeles) + '%';
                                })
                                .transition().duration(3000)
                                .style('opacity', 1);

                            // Agrega etiqueta total
                            d3.select('#gender')
                                .append('text')
                                .attr('class', 'label_genero_1')
                                .attr('y', '55px')
                                .style('font-size', '30px')
                                .text('Población general')
                                .style('opacity', 0);

                            aux = [];
                            aux.push(d3.select('#gender').selectAll('.label_genero_1').node().getBBox().width);

                            d3.select('.label_genero_1')
                                .attr('x', (50 - (aux[0] * 100 / pixeles) / 2) + '%')
                                .transition().duration(3000)
                                .style('opacity', 1);









                            // Añade la segunda fila de rectángulos
                            d3.select('#gender')
                                .selectAll('#rect_2')
                                .data(data2).enter()
                                .append('rect')
                                .attr('id', function (d, i) {
                                    return 'rect_2';
                                })
                                .on('mouseover', overRect)
                                .on('mouseout', outRect)
                                .attr('height', '30')
                                .attr('width', '0')
                                .attr('y', '300px')
                                .attr('x', function (d, i) {
                                    if (i === 0) {
                                        return (22 + (d.n * 100 / n_white) * 56 / 100) + "%";
                                    } else if (i === 1) {
                                        return (78 - (d.n * 100 / n_white) * 56 / 100) + "%";
                                    }
                                })
                                .attr('fill', function (d, i) {
                                    if (i === 0) return color_f;
                                    else if (i === 1) return color_m;
                                })
                                .transition().delay(1000).duration(2000)
                                .attr('x', function (d, i) {
                                    if (i === 0) return '22%';
                                    else if (i === 1) return (78 - (d.n * 100 / n_white) * 56 / 100) + "%";
                                })
                                .attr('width', function (d, i) {
                                    if (i <= 1)
                                        return (d.n * 100 / n_white) * 56 / 100 + "%";
                                });

                            // Texto del porcentaje
                            d3.select('#gender')
                                .selectAll('text_genero_3')
                                .data(data2).enter()
                                .append('text')
                                .attr('class', 'text_genero_3')
                                .style('font-size', function (d, i) {
                                    if (i === 0) return '25px';
                                    else if (i === 1) return '30px';
                                })
                                .attr('y', '265px')
                                .text(function (d, i) {
                                    return Math.round((d.n * 100 / n_white) * 100) / 100 + '%';
                                })
                                .style('font-weight', 'bold')
                                .style('opacity', 0)
                                .attr('fill', function (d, i) {
                                    if (i === 0) return color_f;
                                    else if (i === 1) return color_m;
                                });

                            aux = [];
                            data2.forEach(function (d, i) {
                                aux.push(d3.select('#gender').selectAll('.text_genero_3').nodes()[i].getBBox().width);
                            });
                            d3.select('#gender')
                                .selectAll('.text_genero_3')
                                .data(data2)
                                .attr('x', function (d, i) {
                                    if (i === 0) return '22%';
                                    else if (i === 1) return (78 - aux[i] * 100 / pixeles) + '%';
                                })
                                .transition().delay(1000).duration(3000)
                                .style('opacity', 1);

                            // Texto del valor
                            d3.select('#gender')
                                .selectAll('text_genero_4')
                                .data(data2).enter()
                                .append('text')
                                .attr('class', 'text_genero_4')
                                .text(function (d, i) {
                                    if (i <= 1) return Intl.NumberFormat('de-DE').format(d.n);
                                })
                                .attr('y', '285px')
                                .style('font-size', function (d, i) {
                                    if (i === 0) return '15px';
                                    else if (i === 1) return '18px';
                                })
                                .style('opacity', 0)
                                .attr('fill', function (d, i) {
                                    if (i === 0) return color_f;
                                    else if (i === 1) return color_m;
                                });

                            aux = [];
                            data2.forEach(function (d, i) {
                                aux.push(d3.select('#gender').selectAll('.text_genero_4').nodes()[i].getBBox().width);
                            });
                            d3.select('#gender')
                                .selectAll('.text_genero_4')
                                .data(data2)
                                .attr('x', function (d, i) {
                                    if (i === 0) return '22%';
                                    else if (i === 1) return (78 - aux[i] * 100 / pixeles) + '%';
                                })
                                .transition().delay(1000).duration(2000)
                                .style('opacity', 1);

                            // Agrega etiqueta gente blanca
                            d3.select('#gender')
                                .append('text')
                                .attr('class', 'label_genero_2')
                                .attr('y', '265px')
                                .style('font-size', '25px')
                                .text('Gente blanca')
                                .style('opacity', 0);

                            aux = [];
                            aux.push(d3.select('#gender').selectAll('.label_genero_2').node().getBBox().width);

                            d3.select('.label_genero_2')
                                .attr('x', (50 - (aux[0] * 100 / pixeles) / 2) + '%')
                                .transition().delay(1000).duration(2000)
                                .style('opacity', 1);







                            // Añade la tercera fila de rectángulos
                            d3.select('#gender')
                                .selectAll('#rect_3')
                                .data(data3).enter()
                                .append('rect')
                                .attr('id', function (d, i) {
                                    return 'rect_3';
                                })
                                .on('mouseover', overRect)
                                .on('mouseout', outRect)
                                .attr('height', '30')
                                .attr('width', '0')
                                .attr('y', '440px')
                                .attr('x', function (d, i) {
                                    if (i === 0)
                                        return (22 + (d.n * 100 / n_black) * 56 / 100) + "%";
                                    else if (i === 1)
                                        return (78 - (d.n * 100 / n_black) * 56 / 100) + "%";
                                })
                                .attr('fill', function (d, i) {
                                    if (i === 0) return color_f;
                                    else if (i === 1) return color_m;
                                })
                                .transition().delay(2000).duration(2000)
                                .attr('x', function (d, i) {
                                    if (i === 0) return '22%';
                                    else if (i === 1) return (78 - (d.n * 100 / n_black) * 56 / 100) + "%";
                                })
                                .attr('width', function (d) {
                                    return (d.n * 100 / n_black) * 56 / 100 + "%";
                                });

                            // Texto del porcentaje
                            d3.select('#gender')
                                .selectAll('text_genero_5')
                                .data(data3).enter()
                                .append('text')
                                .attr('class', 'text_genero_5')
                                .style('font-size', function (d, i) {
                                    if (i === 0) return '25px';
                                    else if (i === 1) return '30px';
                                })
                                .attr('y', '405px')
                                .text(function (d) {
                                    return Math.round((d.n * 100 / n_black) * 100) / 100 + '%';
                                })
                                .style('font-weight', 'bold')
                                .style('opacity', 0)
                                .attr('fill', function (d, i) {
                                    if (i === 0) return color_f;
                                    else if (i === 1) return color_m;
                                });

                            aux = [];
                            data3.forEach(function (d, i) {
                                aux.push(d3.select('#gender').selectAll('.text_genero_5').nodes()[i].getBBox().width);
                            });
                            d3.select('#gender')
                                .selectAll('.text_genero_5')
                                .data(data3)
                                .attr('x', function (d, i) {
                                    if (i === 0) return '22%';
                                    else if (i === 1) return (78 - aux[i] * 100 / pixeles) + '%';
                                })
                                .transition().delay(2000).duration(2000)
                                .style('opacity', 1);

                            // Texto del valor
                            d3.select('#gender')
                                .selectAll('text_genero_6')
                                .data(data3).enter()
                                .append('text')
                                .attr('class', 'text_genero_6')
                                .text(function (d, i) {
                                    if (i <= 1) return Intl.NumberFormat('de-DE').format(d.n);
                                })
                                .attr('y', '425px')
                                .style('font-size', function (d, i) {
                                    if (i === 0) return '15px';
                                    else if (i === 1) return '18px';
                                })
                                .style('opacity', 0)
                                .attr('fill', function (d, i) {
                                    if (i === 0) return color_f;
                                    else if (i === 1) return color_m;
                                });

                            aux = [];
                            data3.forEach(function (d, i) {
                                aux.push(d3.select('#gender').selectAll('.text_genero_6').nodes()[i].getBBox().width);
                            });
                            d3.select('#gender')
                                .selectAll('.text_genero_6')
                                .data(data3)
                                .attr('x', function (d, i) {
                                    if (i === 0) return '22%';
                                    else if (i === 1) return (78 - aux[i] * 100 / pixeles) + '%';
                                })
                                .transition().delay(2000).duration(2000)
                                .style('opacity', 1);

                            // Agrega etiqueta gente negra
                            d3.select('#gender')
                                .append('text')
                                .attr('class', 'label_genero_3')
                                .attr('y', '405px')
                                .style('font-size', '25px')
                                .text('Gente negra')
                                .style('opacity', 0);

                            aux = [];
                            // console.log(d3.select('#gender').selectAll('.label_genero_3').node().getBBox().width)
                            aux.push(d3.select('#gender').selectAll('.label_genero_3').node().getBBox().width);

                            d3.select('.label_genero_3')
                                .attr('x', (50 - (aux[0] * 100 / pixeles) / 2) + '%')
                                .transition().delay(2000).duration(2000)
                                .style('opacity', 1);
                        });
                });
        }
    });
}
