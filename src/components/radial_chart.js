import React from 'react';
import ReactDOM from 'react-dom';
import {nest, entries} from 'd3-collection';
import {max} from 'd3-array';
import {hsl} from 'd3-color';
import {timeMonth, timeYear} from 'd3-time';
import {timeFormat} from 'd3-time-format';
import {lineRadial, pie, arc} from 'd3-shape';
import {format} from 'd3-format';
import {scaleLinear, scaleTime, scaleOrdinal} from 'd3-scale';
import {axisLeft, axisBottom, axisRight} from 'd3-axis';
import {select} from 'd3-selection';

class RadialChart extends React.Component {
  constructor(props) {
    super(props);

    const {
      data,
      h,
      w,
      margin
    } = this.props;


    const filteredData = data.filter(d => d.region === 'United States');

    const sumData = nest()
      .key(d => d.publishTime)
      .sortKeys((a, b) => (Number(a) < Number(b)) ? -1 : 1)
      .rollup(leaves => leaves.length)
      .entries(filteredData);

    data.forEach(d => {
      d.key = Number(d.key);
    });
    const outerRadius = h / 3;
    const scale = {
      x: scaleTime()
        .domain([0, 23])
        .range([0, 2 * 3.1415]),
  
      y: scaleLinear()
        .domain([0, max(sumData, d => d.value)])
        .range([1, outerRadius])
    };

    

    this.state = {
      height: h,
      width: w,
      sumData,
      scale
    };
  }

  state = {
    height: null,
    width: null,
    sumData: null,
    scale: null
  }

  componentDidMount() {
    const {
    } = this.state;
    this.updateChart(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateChart(nextProps);
  }

  updateChart(props) {
    const {
      data,
      margin
    } = props;
    const {
      height,
      width,
      sumData,
      scale

    } = this.state;
    if (!data.length) {
      return;
    }



    const graph = select(ReactDOM.findDOMNode(this.refs.plotContainer))
      .append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    const g = graph.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    const yAxis = g.append('g')
                  .attr('text-anchor', 'middle');

    const ticks = yAxis.selectAll('g')
                        .data(scale.y.ticks(5))
                        .enter().append('g');

    ticks.append('circle')
            .attr('fill', 'none')
            .attr('stroke', '#606060')
            .attr('r', scale.y);

    const line = lineRadial()
        .angle(d => scale.x(d.key))
        .radius(d => scale.y(d.value));
    console.log(scale);
    g.append('path')
        .datum(sumData)
        .attr('fill', 'none')
        .attr('stroke', '#E52222')
        .attr('stroke-width', '3px')
        .attr('d', line);

    ticks.append('text')
      .attr('y', d => scale.y(d))
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(d => (d / 1000));

    // Russia ring
    this.ringScale(yAxis, 3 * height / 4, 3);
    // US ring
    this.ringScale(yAxis, 5 * height / 6, 19);

  }
  ringScale(g, innerRadius, timeShift) {
    const utcTimeArray = Array(24).fill().map((d, i) => new Date(2000, 1, 1, i).toLocaleTimeString());
    const timeArray = Array(24).fill().map((d, i) => {
      return new Date(2000, 1, 1, (i + timeShift) % 24).toLocaleTimeString();
    });
    const data = {};
    timeArray.map((d) => {
      data[d] = 1;
      return data;
    });
  
    const color = scaleOrdinal()
                    .domain(utcTimeArray)
                    .range(Array(24).fill().map((d, i) => (i < 6 || i > 21) ? 'DarkGray' : 'LightGray'));
  
    const ring = pie()
      .sort(null)
      .value(d => d.value);
  
    const dataReady = ring(entries(data));
  
    const hour = arc()
      .innerRadius(innerRadius * 0.5)
      .outerRadius((innerRadius * 0.5) + 20);
  
    g.selectAll('allSlices')
        .data(dataReady).enter()
          .append('path')
            .attr('d', hour)
            .attr('fill', d => color(d.data.key))
            .style('stroke', 'white')
            .style('storke-width', '2px');
  }

  render() {
    const {
      h,
      w
    } = this.props;
    const {
      // interactivity things
    } = this.state;
    return (
      <div className="container relative">
        <svg width={w} height={h}>
          
          <g className="plot-container"
            ref="plotContainer"

          />
        </svg>
        
      </div>
    );
  }
}

RadialChart.displayName = 'RadialChart';

export default RadialChart;
