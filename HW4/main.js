//Define data
const crime = d3.csv("us_statewide_crime.csv");

crime.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.Unemployed = +d.Unemployed;
    });
    data.sort((a, b) => b.Unemployed - a.Unemployed);

    // Code in here
    let width = 1250, height = 900;

    let margin = {
        top: 30,
        bottom: 50,
        left: 150,
        right: 30
    }

    let unemp_max = d3.max(data, d => d.Unemployed); //get the highest unemployment rate and make max x value

    let svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', '#e9f7f2')

    let yScale = d3.scaleBand()
        .domain(data.map(d => d.State))
        .range([margin.top, height - margin.bottom])
        .padding(0.1);

    let yAxis = svg.append('g')  
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    let xScale = d3.scaleLinear() 
        .domain([0, unemp_max]) 
        .range([margin.left, width - margin.right]);

    let xAxis = svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    let bar = svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', margin.left) 
        .attr('y', d => yScale(d.State)) 
        .attr('width', d => xScale(d.Unemployed) - margin.left)
        .attr('height', yScale.bandwidth())
        .attr('fill', 'steelblue');

     yAxis.append('text')  
        .attr('x', -90)   
        .attr('y', (height+margin.bottom)/2)
        .style('stroke', 'black')
        .style('font-size', '16px')
        .text('State');

    xAxis.append('text')
        .attr('x', (width - margin.right)/2) 
        .attr('y', 30)
        .style('stroke', 'black')
        .style('font-size', '16px')
        .text('Unemployment Rate');

    //add interactive
    bar.on('click', function() {
        let currentColor = d3.select(this).attr('fill');
        let newColor = currentColor === 'steelblue' ? 'red' : 'steelblue';
        d3.select(this)
            .attr('fill', newColor);
    });

});