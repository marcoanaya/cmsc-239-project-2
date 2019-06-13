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

class SmallBarCharts extends React.Component {
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
    const filteredDataRS = data.slice(0).filter(row => {
      return (row.publishDate >= startDate && row.publishDate <= endDate && row.region === 'Russian Federation');
    });
    const filteredDataAZ = data.slice(0).filter(row => {
      return (row.publishDate >= startDate && row.publishDate <= endDate && row.region === 'Azerbaijan');
    });
    const filteredDataGE = data.slice(0).filter(row => {
        return (row.publishDate >= startDate && row.publishDate <= endDate && row.region === 'Germany');
    });
    const filteredDataIT = data.slice(0).filter(row => {
        return (row.publishDate >= startDate && row.publishDate <= endDate && row.region === 'Italy');
    });
    const filteredDataUK = data.slice(0).filter(row => {
        return (row.publishDate >= startDate && row.publishDate <= endDate && row.region === 'United Kingdom');
    });

    const sumDataRS = nest()
    .key(d => d.publishDate)
    .rollup(leaves => {
      return {
        leftPosts: sum(leaves, l => l.accountCategory === 'LeftTroll'),
        totalPosts: leaves.length
      };
    }).entries(filteredDataRS);
    const sumDataAZ = nest()
    .key(d => d.publishDate)
    .rollup(leaves => {
      return {
        leftPosts: sum(leaves, l => l.accountCategory === 'LeftTroll'),
        totalPosts: leaves.length
      };
    }).entries(filteredDataAZ);
    const sumDataGE = nest()
    .key(d => d.publishDate)
    .rollup(leaves => {
      return {
        leftPosts: sum(leaves, l => l.accountCategory === 'LeftTroll'),
        totalPosts: leaves.length
      };
    }).entries(filteredDataGE);
    const sumDataIT = nest()
    .key(d => d.publishDate)
    .rollup(leaves => {
      return {
        leftPosts: sum(leaves, l => l.accountCategory === 'LeftTroll'),
        totalPosts: leaves.length
      };
    }).entries(filteredDataIT);
    const sumDataUK = nest()
    .key(d => d.publishDate)
    .rollup(leaves => {
      return {
        leftPosts: sum(leaves, l => l.accountCategory === 'LeftTroll'),
        totalPosts: leaves.length
      };
    }).entries(filteredDataUK);

    const height = h - margin.top - margin.bottom;
    const width = w - margin.left - margin.right;

    const scale = {
      x: scaleTime()
          .domain([startDate, endDate])
          .range([0, width]),

      y: scaleLinear()
          .domain([0, 2000])
          .range([height, 0])
          .nice(),

      color: scaleLinear()
          .domain([0, 0.5, 1])
          .range([color.right, color.middle, color.left])
    };

    const axis = {
      x: axisBottom(scale.x),
      y: axisLeft(scale.y)
    };

    this.state = {
      height,
      width,
      sumDataRS,
      sumDataAZ,
      sumDataGE,
      sumDataIT,
      sumDataUK,
      axis,
      scale,
      color,
      region: 'United States',
      dataVal: 0
    };
  }

  state = {
    height: null,
    width: null,
    sumDataRS: null,
    sumDataAZ: null,
    sumDataGE: null,
    sumDataIT: null,
    sumDataUK: null,
    axis: null,
    scale: null,
    color: null,
    region: null,
    dataVal: null
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
      sumDataRS,
      sumDataAZ,
      sumDataGE,
      sumDataIT,
      sumDataUK,
      axis,
      scale,
      color,
      region,
      dataVal

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

    graph.selectAll('.label')
      .style('text-anchor', 'start')
      .style('font-size', width / 60)
      .style('font-weight', 'bold')
      .style('font-family', 'Courier')
      .style('fill', 'black');

    graph.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'white');

    // appending data points
    if (this.state.dataVal === 1) {
      console.log('1');
      graph.selectAll('.bar')
        .data(sumDataAZ).enter()
        .append('rect')
            .attr('class', 'bar')
            .attr('x', d => scale.x(d.key))
            .attr('y', d => scale.y(d.value.totalPosts))
            .attr('width', width / 1095)
            .attr('height', d => height - scale.y(d.value.totalPosts));
    } else if(this.state.dataVal === 2) {
      console.log('2');
      graph.selectAll('.bar')
        .data(sumDataGE).enter()
        .append('rect')
            .attr('class', 'bar')
            .attr('x', d => scale.x(d.key))
            .attr('y', d => scale.y(d.value.totalPosts))
            .attr('width', width / 1095)
            .attr('height', d => height - scale.y(d.value.totalPosts));
    } else if(this.state.dataVal === 3) {
      console.log('3');
      graph.selectAll('.bar')
        .data(sumDataIT).enter()
        .append('rect')
            .attr('class', 'bar')
            .attr('x', d => scale.x(d.key))
            .attr('y', d => scale.y(d.value.totalPosts))
            .attr('width', width / 1095)
            .attr('height', d => height - scale.y(d.value.totalPosts));
    } else if(this.state.dataVal === 4) {
      console.log('4');
      graph.selectAll('.bar')
        .data(sumDataUK).enter()
        .append('rect')
            .attr('class', 'bar')
            .attr('x', d => scale.x(d.key))
            .attr('y', d => scale.y(d.value.totalPosts))
            .attr('width', width / 1095)
            .attr('height', d => height - scale.y(d.value.totalPosts));
    }
    else {
      console.log('0');
      graph.selectAll('.bar')
        .data(sumDataRS).enter()
        .append('rect')
            .attr('class', 'bar')
            .attr('x', d => scale.x(d.key))
            .attr('y', d => scale.y(d.value.totalPosts))
            .attr('width', width / 1095)
            .attr('height', d => height - scale.y(d.value.totalPosts));
    }

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
          <p>select country:</p>
        </svg>
        {[
            {region: 'Russia', val: 0},
            {region: 'Azerbaijan', val: 1},
            {region: 'Germany', val: 2},
            {region: 'Italy', val: 3},
            {region: 'United Kingdom', val: 4}
        ].map(t => {
          return (<button
          className = "buttonsb"
          key={t.region}
          onClick={() => {
            this.state.region = t.region;
            this.state.dataVal = t.val;
            this.updateChart(this.props, this.state);
          }
        }
          >{t.region}</button>);
        })}

      </div>
    );
  }
}

SmallBarCharts.displayName = 'SmallBarCharts';

export default SmallBarCharts;
