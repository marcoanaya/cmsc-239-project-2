import React from 'react';
import ReactDOM from 'react-dom';
import {nest, entries} from 'd3-collection';
import {max} from 'd3-array';
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
      margin,
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

    this.state = {
      height: h,
      width: w,
      timezone: 0,
      region: 'Standart Time',
      sumData
    };
  }

  state = {
    height: null,
    width: null,
    sumData: null,
    region: null,
    timezone: null
  }

  componentDidMount() {
    const {
      timezone
    } = this.state;
    this.updateChart(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateChart(nextProps);
  }

  updateChart(props) {
    const {
      margin
    } = props;
    const {
      height,
      width,
      sumData,
      timezone

    } = this.state;
    if (!sumData.length) {
      return;
    }

    const outerRadius = height / 3;
    const scale = {
      x: scaleTime()
        .domain([0 + timezone, 23 + timezone])
        .range([0, 2 * 3.1415]),
  
      y: scaleLinear()
        .domain([0, max(sumData, d => d.value)])
        .range([1, outerRadius])
    };

    const graph = select(ReactDOM.findDOMNode(this.refs.plotContainer))
      .append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
    graph.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', height)
      .attr('width', width)
      .attr('fill', 'white');

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
    this.ringScale(yAxis, 3 * height / 4, 0);
    // US ring
    // this.ringScale(yAxis, 5 * height / 6, 19);

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
  
    const color = scaleOrdinal().domain(utcTimeArray).range(Array(24).fill().map((d, i) => (i < 6 || i > 19) ? '#262626' : '#c4c4c4'));
  
    const ring = pie().sort(null).value(d => d.value);
  
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
      <div className="container relative" align="right" >

        <svg width={w} height={h}>
          
          <g className="plot-container"
            ref="plotContainer"

          />

        </svg>
        {[
            {region: 'United States', val: 3},
            {region: 'Russia', val: 19},
            {region: 'Standard Time', val: 0}
        ].map(t => {
          return (<button
          key={t.region}
          onClick={() => {
            this.state.timezone = t.val;
            this.state.region = t.region;
            this.updateChart(this.props, this.state);
            // this.updateChart(this.props, this.state);
          }
        }
            
          >{t.region}</button>);
          })}
      </div>
    );
  }
}

RadialChart.displayName = 'RadialChart';

export default RadialChart;
