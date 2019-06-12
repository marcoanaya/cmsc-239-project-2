import React from 'react';
import ReactDOM from 'react-dom';
import {nest} from 'd3-collection';
import {sum} from 'd3-array';
import {hsl} from 'd3-color';
import {timeMonth, timeYear} from 'd3-time';
import {timeFormat} from 'd3-time-format';
import {line} from 'd3-shape';
import {format} from 'd3-format';
import {scaleLinear, scaleTime} from 'd3-scale';
import {axisLeft, axisBottom, axisRight} from 'd3-axis';
import {select} from 'd3-selection';

class MoodyTrolls extends React.Component {
  constructor(props) {
    super(props);

    const {
      data,
      h,
      w,
      margin
    } = this.props;

    const startDate = new Date('1/1/2015 UTC');
    const endDate = new Date('1/1/2018 UTC');
    const color = {
      right: hsl(360, 1, 0.30),
      middle: hsl(300, 0, 0.70),
      left: hsl(240, 1, 0.30)
    };

    const filteredData = data.filter(row => {
      return ['LeftTroll', 'RightTroll'].includes(row.accountCategory) &&
             (row.publishDate >= startDate && row.publishDate <= endDate);
    });
    console.log(filteredData);
    const sumData = nest()
    .key(d => d.publishDate)
    .rollup(leaves => {
      return {
        leftPosts: sum(leaves, l => l.accountCategory === 'LeftTroll'),
        totalPosts: leaves.length
      };
    }).entries(filteredData);

    const height = h - margin.top - margin.bottom;
    const width = w - margin.left - margin.right;

    const legendH = height / 4;
    const legendW = width / 40;

    const scale = {
      x: scaleTime()
          .domain([startDate, endDate])
          .range([0, width]),
  
      y: scaleLinear()
          .domain([0, 14000])
          .range([height, 0])
          .nice(),
  
      color: scaleLinear()
          .domain([0, 0.5, 1])
          .range([color.right, color.middle, color.left]),
      legend: scaleLinear()
        .domain([0, 8])
        .range([legendH, 0])
    };

    const axis = {
      x: axisBottom(scale.x),
      y: axisLeft(scale.y),
      legend: axisRight()
      .scale(scale.legend)
      .ticks(5)
      .tickFormat((d, i) => {
        return [
          'All Left Trolls',
          '75% Left Trolls',
          'Equal',
          '75% Right Trolls',
          'All Right Trolls'
        ][i];
      })
      
    };

    this.state = {
      height,
      width,
      legendH,
      legendW,
      sumData,
      axis,
      scale,
      color
    };
  }

  state = {
    height: null,
    width: null,
    legendH: null,
    legendW: null,
    sumData: null,
    axis: null,
    scale: null,
    color: null
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
      legendH,
      legendW,
      sumData,
      axis,
      scale,
      color

    } = this.state;
    if (!data.length) {
      return;
    }

    const graph = select(ReactDOM.findDOMNode(this.refs.plotContainer))
      .append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
    const xAxis = graph.append('g').attr('transform', `translate(0, ${height})`);

    xAxis.append('g')
      .attr('class', 'x-axis-month')
      .call(axis.x
        .tickFormat(timeFormat('%b'))
        .ticks(timeMonth))
      .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', -8)
        .attr('dy', -4)
        .attr('transform', 'rotate(-65)');

    xAxis.append('g')
      .attr('class', 'x-axis-year')
      .call(axis.x
        .tickFormat(timeFormat('%Y'))
        .ticks(timeYear))
      .selectAll('text')
        .style('text-anchor', 'end')
        .style('font-weight', 'bold')
        .attr('dx', -(width / 40))
        .attr('dy', -4)
        .attr('transform', 'rotate(-65)');

    xAxis.append('text')
      .attr('class', 'label')
      .attr('x', width + 5)
      .attr('y', 0)
      .text('Date');

    graph.append('g')
        .attr('class', 'y-axis')
        .call(axis.y)
      .append('text')
        .attr('class', 'label')
        .attr('x', 0)
        .attr('y', 0)
        .text('Total Posts');

    graph.selectAll('.tick')
      .style('font-size', width / 120)
      .style('font-family', 'Courier');

    // appending legend
    const key = graph.append('g').attr('transform', `translate(${8 * width / 9}, 0)`);

    const legend = key.append('defs')
      .append('svg:linearGradient')
        .attr('id', 'gradient')
        .attr('x1', '100%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%')
        .attr('spreadMethod', 'pad');

    // creating 'stops' for gradient legend
    Object.values(color).map((d, i) => {
      return legend.append('stop')
        .attr('offset', `${(50 * i)}%`)
        .attr('stop-color', d)
        .attr('stop-opacity', 1);
    });

    key.append('rect')
      .attr('width', legendW)
      .attr('height', legendH)
      .style('fill', 'url(#gradient')
      .attr('transform', `translate(${0}, ${height / 15})`);

    key.append('g')
        .attr('class', 'legend-axis')
        .attr('transform', `translate(${legendW}, ${height / 15})`)
        .call(axis.legend)
      .append('text')
        .attr('class', 'label')
        .attr('x', -legendW)
        .attr('y', -(height / 15) - 2)
        .style('text-anchor', 'start')
        .style('font-family', 'Courier')
        .text('Tweet Content');

    key.selectAll('text')
      .style('fill', 'black')
      .style('font-family', 'Courier')
      .style('font-size', width / 80);

    graph.selectAll('.label')
      .style('text-anchor', 'start')
      .style('font-size', width / 60)
      .style('font-weight', 'bold')
      .style('font-family', 'Courier')
      .style('fill', 'black');

    // appending data points
    graph.selectAll('.bar')
      .data(sumData).enter()
      .append('rect')
          .attr('class', 'bar')
          .attr('x', d => scale.x(d.key))
          .attr('y', d => scale.y(d.value.totalPosts))
          .attr('width', width / 1095)
          .attr('height', d => height - scale.y(d.value.totalPosts))
          .style('fill', d => scale.color(d.value.leftPosts / d.value.totalPosts));
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

MoodyTrolls.displayName = 'MoodyTrolls';

export default MoodyTrolls;
