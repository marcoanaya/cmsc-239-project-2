import React from 'react';
import ReactDOM from 'react-dom';
import {json} from 'd3-fetch';
import {nest} from 'd3-collection';
import {geoPath, geoNaturalEarth1} from 'd3-geo';
import {schemeYlOrRd} from 'd3-scale-chromatic';
import {scaleThreshold} from 'd3-scale';
import {legendColor} from 'd3-svg-legend';
import 'd3-transition';
import {select, event} from 'd3-selection';

class HeatMap extends React.Component {
  constructor(props) {
    super(props);

    const {
      data,
      h,
      w,
      margin
    } = this.props;

    const countriesiso = {
      'United States': 'USA',
      Italy: 'ITA',
      'United Arab Emirates': 'ARE',
      Japan: 'JPN',
      Israel: 'ISR',
      Azerbaijan: 'AZE',
      Egypt: 'EGY',
      'United Kingdom': 'GBR',
      'Russian Federation': 'RUS',
      Turkey: 'TUR',
      Iraq: 'IRQ',
      Germany: 'DEU',
      France: 'FRA',
      Ukraine: 'UKR',
      Serbia: 'SRB',
      'Hong Kong': 'HKG',
      Austria: 'AUT',
      Belarus: 'BLR',
      Malaysia: 'MYS',
      Spain: 'ESP',
      Samoa: 'WSM',
      India: 'IND',
      Afghanistan: 'AFG',
      'Saudi Arabia': 'SAU',
      'Iran, Islamic Republic of': 'IRN',
      Mexico: 'MEX',
      Canada: 'CAN',
      Greece: 'GRC',
      'Czech Republic': 'CZE',
      Finland: 'FIN',
      Latvia: 'LVA',
      Estonia: 'EST',
      Sweden: 'SWE',
      Denmark: 'DNK',
      Switzerland: 'CHE'
    };

    const getCountryCode = (name) => {
      if (countriesiso.hasOwnProperty(name)) {
        return countriesiso[name];
      }
      return name;
    }

    const postsByRegion = nest()
    .key(d => d.region)
    .rollup(leaves => {
      return {
        totalPerRegion: leaves.length
      };
    })
    .entries(data);

    let postsByRegionAbb = postsByRegion.map(d => {
      return {key: getCountryCode(d.key), value: d.value.totalPerRegion};
    });
  
    postsByRegionAbb = postsByRegionAbb.splice(2);

    this.state = {
      height: h,
      width: w,
      currCountry: "USA",
      currTotal: "0",
      postsByRegionAbb
    };
  }

  state = {
    height: null,
    width: null,
    currCountry: null,
    currTotal: null,
    postsByRegionAbb: null
  }

  componentDidMount() {
    const {
      currCountry,
      currTotal
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
      currCountry,
      currTotal,
      postsByRegionAbb

    } = this.state;
    if (!data.length) {
      return;
    }

    const graph = select(ReactDOM.findDOMNode(this.refs.plotContainer))
      .append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    const projection = geoNaturalEarth1()
      .scale(width / 2 / Math.PI)
      .translate([width / 2, height / 2]);
    const path = geoPath()
      .projection(projection);

    const colorScheme = schemeYlOrRd[7];
    colorScheme.unshift('#eee');
    const colorScale = scaleThreshold()
      .domain([1, 11, 101, 1001, 10001, 100001, 1000001])
      .range(colorScheme);

    const labels = ['0', '1-10', '11-100', '101-1000', '1001-10000', '10001-100000',
      '100001-1000000', '>1000000'];

    graph.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width / 6}, ${height / 2})`);
    graph.append('text')
      .attr('class', 'caption')
      .attr('x', width / 6)
      .attr('y', height / 2 - 10)
      .text('Tweets');
    graph.selectAll('.caption')
      .style('fill', 'black')
      .style('text-anchor', 'start')
      .style('font-weight', 'bold');
    const legend = legendColor()
      .labels(d => (labels[d.i]))
      .shapePadding(4)
      .scale(colorScale);
    graph.select('.legend')
      .style('font-size', '12')
      .call(legend);
    
    json('http://enjalot.github.io/wwsd/data/world/world-110m.geojson').then(jsonfile => {
      jsonfile.features = jsonfile.features.filter(d => d.id !== 'ATA');
      graph.selectAll('path')
        .data(jsonfile.features)
        .enter().append('path')
          .attr('fill', d => {
            const country = postsByRegionAbb.find(e => e.key === d.id);
            d.total = country ? country.value : 0;
            return colorScale(d.total);
          })
          .attr('d', path)
          .style('stroke', 'LightGray')
          .style('stroke-width', '.5')
          .on("mouseover", d => {  
            console.log(d.total);
            this.setState({currCountry: d.id, currTotal: d.total});
          });
    });
  }

  render() {
    const {
      h,
      w
    } = this.props;
    const {
      // interactivity things
      currCountry,
      currTotal
    } = this.state;
    return (
      <div className="container relative">
        <h1>{currCountry + " " + currTotal}</h1>
        <svg width={w} height={h}>
          
          <g className="plot-container"
            ref="plotContainer"

          />
        </svg>
        
      </div>
    );
  }
}

HeatMap.displayName = 'HeatMap';

export default HeatMap;
