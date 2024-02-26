// Load the data
const penguins = d3.csv("penguins.csv");

// Once the data is loaded, proceed with plotting
penguins.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.bill_length_mm = +d.bill_length_mm;
        d.flipper_length_mm = +d.flipper_length_mm;
    });

    // Define the dimensions and margins for the SVG
    let width = 960, height = 500;
    let margin = {
        top: 10,
        bottom: 60,
        right: 90,
        left: 60
    };

    // Create the SVG container
    let scattersvg = d3.select('#scatterplot')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .style('background', 'lightblue');
    
    // Set up scales for x and y axes
    let y_min = d3.min(data, d => d.flipper_length_mm)-5;
    let y_max = d3.max(data, d => d.flipper_length_mm)+5;
    let x_min = d3.min(data, d => d.bill_length_mm)-5;
    let x_max = d3.max(data, d => d.bill_length_mm)+5;


        
     // Set up scales for x and y axes
    let yScale = d3.scaleLinear()
            .domain([y_min, y_max])
            .range([height-margin.bottom, margin.top]); // Adjusted range for yScale
        
    let xScale = d3.scaleLinear()
            .domain([x_min, x_max])
            .range([margin.left, width-margin.right]);

    const colorScale = d3.scaleOrdinal()
        .domain(data.map(d => d.species))
        .range(d3.schemeCategory10);

    // Add scales     
    let yAxis = scattersvg
            .append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft().scale(yScale));

    let xAxis = scattersvg
            .append('g')
            .attr('transform', `translate(0, ${height-margin.bottom})`)
            .call(d3.axisBottom().scale(xScale));

    // Add circles for each data point
    let circle = scattersvg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')  //for each data point, be appeneded with a circle
            .attr('cx', d => xScale(d.bill_length_mm))
            .attr('cy', d => yScale(d.flipper_length_mm)) //geting y position based on rating
            .attr('r', 5)
            .attr('fill', d => colorScale(d.species));
    

    // Add x-axis label
    let x_label = scattersvg.append('text')
                    .attr('x', width / 2)
                    .attr('y', height - margin.bottom/2)
                    .attr('text-anchor', 'middle')
                    .text('Bill Length (mm)');
    

    // Add y-axis label
    let y_label = scattersvg.append('text')
                    .attr('transform', 'rotate(-90)')
                    .attr('x', -height / 2)
                    .attr('y', margin.left/2 -5)
                    .attr('text-anchor', 'middle')
                    .text('Flipper Length (mm)');
    

    // Add legend
    const legend = scattersvg.selectAll(".legend")
        .data(colorScale.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

    let legend_circle = legend.append("circle")
                    .attr("cx", width - margin.right)
                    .attr("cy", 10)
                    .attr("r", 5)
                    .style("fill", d => colorScale(d));

    let legend_key = legend.append("text")
                    .attr("x", width - margin.right + 10)
                    .attr("y", 10)
                    .attr("dy", "0.32em")
                    .text(d => d);

});

penguins.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.bill_length_mm = +d.bill_length_mm;
        d.flipper_length_mm = +d.flipper_length_mm;
    });
    

    // Define the dimensions and margins for the SVG
    let width = 960, height = 500;
    let margin = {
        top: 10,
        bottom: 60,
        right: 90,
        left: 60
    };

    // Create the SVG container
    let svg = d3.select('#boxplot')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .style('background', 'lightblue');
    
    // Set up scales for x and y axes
    let y_min = d3.min(data, d => d.flipper_length_mm)-5;
    let y_max = d3.max(data, d => d.flipper_length_mm)+5;

    let xScale = d3.scaleBand()
        .domain(data.map(d => d.species))
        .range([margin.left, width - margin.right])
        .padding(0.2);

    let yScale = d3.scaleLinear()
        .domain([y_min, y_max])
        .range([height-margin.bottom, margin.top]);
    

    // Add scales
    let xAxis = svg.append('g')
                .attr('transform', `translate(0, ${height-margin.bottom})`)
                .call(d3.axisBottom().scale(xScale))
                
    let yAxis = svg
                .append('g')
                .attr('transform', `translate(${margin.left}, 0)`)
                .call(d3.axisLeft().scale(yScale))
    

    // Add x-axis label
    let x_label = svg.append('text')
                    .attr('x', width / 2)
                    .attr('y', height - margin.bottom/2)
                    .attr('text-anchor', 'middle')
                    .text('Species');
    

    // Add y-axis label
    let y_label = svg.append('text')
                    .attr('transform', 'rotate(-90)')
                    .attr('x', -height / 2)
                    .attr('y', margin.left/2 -5)
                    .attr('text-anchor', 'middle')
                    .text('Flipper Length (mm)');
    

    const rollupFunction = function(groupData) {
        const values = groupData.map(d => d.flipper_length_mm).sort(d3.ascending);
        const q1 = d3.quantile(values, 0.25)
        const q3 = d3.quantile(values, 0.75)
        const median = d3.quantile(values, 0.50)
        const iqr = q3-q1;
        return {q1, q3, median, iqr};
    };

    const quartilesBySpecies = d3.rollup(data, rollupFunction, d => d.species);  
    //This line of code is rolling up the data by species and then applying the rollup function to each group which calculates q1, q3, the median and the IQR for each group

    quartilesBySpecies.forEach((quartiles, species) => { //for each species, this is getting the x position using the x scale and then gets the boxwidth 
        const x = xScale(species);
        const boxWidth = xScale.bandwidth();
    
        // Draw vertical lines
        let vert_line = svg.append('line')
            .attr('x1', x + boxWidth/2)
            .attr('x2', x + boxWidth/2)
            .attr('y1', yScale(quartiles.q1 - 1.5 * quartiles.iqr))
            .attr('y2', yScale(quartiles.q3 + 1.5 * quartiles.iqr))
            .attr('stroke', 'black');
        
        // Draw box
        let box = svg.append('rect')
            .attr('x', x)
            .attr('y', yScale(quartiles.q3))
            .attr('width', boxWidth)
            .attr('height', yScale(quartiles.q1) - yScale(quartiles.q3))
            .attr('stroke', 'black')
            .style('fill', 'blue');
        
        // Draw median line
        let med_line = svg.append('line')
            .attr('x1', x)
            .attr('x2', x + boxWidth)
            .attr('y1', yScale(quartiles.median))
            .attr('y2', yScale(quartiles.median))
            .attr('stroke', 'black');
        
    });
});