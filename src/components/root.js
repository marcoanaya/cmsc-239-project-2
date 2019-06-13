import React from 'react';
import {csv} from 'd3-fetch';
import MoodyTrolls from './moody_trolls';
import RadialChart from './radial_chart';
import HeatMap from './map';
import {merge} from 'd3-array';
import SmallBarCharts from './smallbarcharts';
import WordCloud from './word_map';

const longBlock = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

const b1 = `From 2015 to 2017 the Russian Federation has been exploiting the anonymity of Twitter in 
order to create trolls farms whose sole purpose is to advance russian political 
interests abroad by posing as members of some country’s citizens. 
To combat this, Twitter banned and released the data on the accounts 
associated with these trolls, which left us with millions of tweets to aid 
in understanding the geopolitical strategies that Russia employs throughout the world. 
Who and how does Russia try to influence? What does it have to gain?`;

const b2 = `We first analyze a global choropleth map to see the overall intensity of tweets per country and to
 get a sense of where Russia mainly focuses its efforts. Each country can be moused over to give a 
 specific estimate of the number of tweets targeted at that country. With this, we see that Russia has 
 an extreme interest in the United States alongside the major powers of Europe--namely Germany, Italy, 
 and the United Kingdom--as well as countries within its orbit, such as itself, Azerbaijan, and Belarus. 
 These targets are in line with what Russia most likely currently sees as either its enemies or its allies
  which have the potential to move away from the Russian orbit, so the high intensity of tweets makes sense 
  given the underlying political interests. Though, this map does not give us much information on why or when 
  these troll campaigns ended or started. For this, we turn our attention to the five countries in particular: 
  Russia itself, Azerbaijan, Germany, Italy, and the United Kingdom.`;

const b3 = `To see a more detailed view of Russian trolls activity abroad, we now analyze a multitude of bar charts of Russian troll activity over time for each of the five countries listed above. Clicking a button corresponding to a country will present a bar graph displaying tweets targeted at that specific country over time. With a closer analysis of these charts it is possible to see what exactly Russia was trying to influence at the time of its trolling. With Russia itself, it appears that is simply trying to maintain a grip on how its citizens view the world with a constant stream of troll propaganda and the same can be said for Azerbaijan. However, with the European countries it appears Russia had an interest in influencing the national elections of the country rather than trying to maintain a constant presence, most likely to try and elect candidates who would be most favorable to their interests. But what the most targeted country, the United States?
`;

const b4 = `For the United States, Twitter released additional data on each troll’s 
tweets: whether it is posing as right-wing or left-wing, allowing for a 
more granular view of the activities and strategies of the troll accounts. 
Taking into account political affiliation, the Russian trolls seem to have been 
working towards the further polarization of American politics by selectively creating 
surges in left or right wing tweets around the times of major events such as the Charleston 
United the Right Rally (August 2017), the release of the Hollywood Access tapes (October 2016), 
and the presidential elections (November 2016). Mousing over different parts of the chart will highlight 
the key corresponding current events during a given time period that would cause a spike in Russian tweets. 
With each of these events, Russia attempted to either amplify the side currently under attack, indicated by 
the massive upsurge in right-wing activity after the Unite the Right Rally in Charleston, or infiltrate both 
sides of the political spectrum in order to further drive divide the nation alongside stark political lines. 
But how can we be certain that these are truly Russian trolls and not Americans behind these accounts?`;

const b5 = `By a timezone comparison. Clicking on each button will change the orientation of the 24 hour clock to be representative of the time zone of the country selected (with UTC as the control). Midnight in the selected time zone will always be at the 12 o’clock position. If the tweets typically coincided with the Russian day/night cycle rather than the American one, then it is likely that real Russians are behind the tweets. Looking at the plot, it is possible to see that this theory is correct. So, the tweets must be coming from abroad rather than any internal political strife that the United States has. 
`;

const b6 = `Finally, with the word cloud, we can see the buzzwords that the trolls tend to use in their tweets, as well as a glimpse into what exactly the trolls are trying to point attention to in each side of the political spectrum. We can see that there is a much greater intensity of words on the right-wing side of tweets rather than left, and this is because when cross-referencing this with the U.S troll tweets chart we can see that Russia has a particular focus on right wing tweets rather than left, coincidence with the recent surge in far-right parties and normalization. 
`;

const b7 = `Taking into account all these visualizations, we can see that Russia has taken a keen interest in the power of social media by way of its troll farms, which it uses to influence politics abroad and further its position on the global stage with a very heavy focus on the United States. However, it remains to be seen what the trolls operating now are currently doing now with the rise of far-right parties in both the United States and Europe taking ground.
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
    const files = Array(13).fill().map((e, i) => {
      return csv(`https://raw.githubusercontent.com/fivethirtyeight/russian-troll-tweets/master/IRAhandle_tweets_${parseInt(i + 1, 10)}.csv`, d => {
        return {
          publishTime: (new Date(`${d.publish_date} +0000`).getHours()),
          publishDate: (new Date(`${d.publish_date} +0000`).setHours(0, 0, 0, 0)),
          region: d.region,
          accountCategory: d.account_category,
          content: d.content
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
        <h1> 2,925,313 Russian Troll Tweets</h1>
        <div>{`By Marco Anaya, Matthew Fensterstock, and Cade Guerra`}</div>
        <p>
          <div>{b1}</div>
        </p>
        <p>
          <div>{b2}</div>
        </p>
        <HeatMap
          data={data}
          h={600}
          w={600}
          margin={{top: 0, right: 0, bottom: 0, left: 0}}
          />
        <div>{b3}</div>
        <SmallBarCharts
          data={data}
          h={300}
          w={600}
          margin={{top: 20, right: 20, bottom: 20, left: 20}}
          />
        <div>{b4}</div>
        <MoodyTrolls
          data={data}
          h={300}
          w={600}
          margin={{top: 20, right: 20, bottom: 20, left: 20}} />
        <div>{b5}</div>
        <RadialChart
          data={data}
          h={400}
          w={400}
          margin={{top: 20, right: 20, bottom: 20, left: 20}}
        />
        <div>{b6}</div>
        <WordCloud
          data={data}
          h={200}
          w={600}
          margin={{top: 20, right: 20, bottom: 20, left: 20}}
          />
        <div>{b7}</div>
        <a href="https://github.com/fivethirtyeight/russian-troll-tweets">Source</a>
      </div>
    );
  }
}
RootComponent.displayName = 'RootComponent';
export default RootComponent;
