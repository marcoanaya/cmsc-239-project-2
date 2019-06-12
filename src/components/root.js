import React from 'react';
import {csv} from 'd3-fetch';
import MoodyTrolls from './moody_trolls';
import RadialChart from './radial_chart';
import HeatMap from './map';
import {merge} from 'd3-array';

const longBlock = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

class RootComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      data: null,
      loading: true
    };
  }

  componentWillMount() {
    const files = Array(3).fill().map((e, i) => {
      return csv(`https://raw.githubusercontent.com/fivethirtyeight/russian-troll-tweets/master/IRAhandle_tweets_${parseInt(i + 1, 10)}.csv`, d => {
        return {
          publishTime: (new Date(`${d.publish_date} +0000`).getHours()),
          publishDate: (new Date(`${d.publish_date} +0000`).setHours(0, 0, 0, 0)),
          region: d.region,
          accountCategory: d.account_category
        };
      });
    });
  
    Promise.all(files)
    .then(data => {
      data = merge(data);
      this.setState({
        data,
        loading: false
      });
    });
  }

  render() {
    const {
      loading,
      data
    } = this.state;

    if (loading) {
      return <h1>LOADING</h1>;
    }
    return (
      <div className="relative">
        <h1> Hello Explainable!</h1>
        <div>{`The example data was loaded! There are ${data.length} rows`}</div>
        <MoodyTrolls
          data={data}
          h={200}
          w={400}
          margin={{top: 20, right: 20, bottom: 20, left: 20}} />
        <div>{longBlock}</div>
        <RadialChart
          data={data}
          h={400}
          w={400}
          margin={{top: 20, right: 20, bottom: 20, left: 20}}
        />
        <HeatMap
          data={data}
          h={400}
          w={400}
          margin={{top: 20, right: 20, bottom: 20, left: 20}}
          />
      
        <div>{longBlock}</div>
      </div>
    );
  }
}
RootComponent.displayName = 'RootComponent';
export default RootComponent;
