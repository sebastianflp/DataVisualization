d3.json('500k.json')
    .then(d => {
        view_mapa(d);
    });

function view_mapa(countries) {
    // 29 hawaii
    // 19 alaska
    // 16 Puerto Rico

    // d3.json('https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway+Mountain+View,+CA&key=AIzaSyBRMWSmTz-Ajez_uToL_Ve9g2ZLGkkRDwo')
    //     .then(d => {
    //         console.log(d);
    //         return;
    //     })
    console.log(countries);
    let lista_densidad = [];
    let densidad = {};
    countries.features.forEach(d => {
        densidad[d.properties.NAME] = d.properties.CENSUSAREA;
        lista_densidad.push(d.properties.CENSUSAREA);
    })

    d3.select('#mapa').attr('width', '100%').attr('height', 500)
        // var projection = d3.geoMercator()
    var projection = d3.geoAlbersUsa()
        .translate([window.innerWidth / 2 - 50, 250])

    var geoPath = d3.geoPath().projection(projection);

    var realFeatureSize = d3.extent(lista_densidad, d => {
        return +d
    });
    console.log("Mínimo y Máximo: ");
    console.log(realFeatureSize);

    //https://github.com/d3/d3-scale#scaleQuantize
    // var newFeatureColor = d3.scaleQuantize()
    //     .domain(realFeatureSize)
    //     .range(['#C3CAFF', '#485EFF']);
        // .range(colorbrewer.BuPu[7]);
    function newFeatureColor (t) {
        return d3.interpolateBlues(t);
    }

    d3.select("#mapa").selectAll("path")
        .data(countries.features).enter()
        .append("path")
        .attr("d", geoPath)
        .attr("id", d => d.id)
        .attr("class", "countries")
        .style("fill", d => {
            return newFeatureColor((densidad[d.properties.NAME] - realFeatureSize[0]) / (realFeatureSize[1] - realFeatureSize[0]))
        })
        .style("stroke", d => d3.rgb(newFeatureColor(d3.geoArea(d))).darker());

}

