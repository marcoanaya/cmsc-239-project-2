import React from 'react';
import ReactDOM from 'react-dom';
import ReactWordcloud from 'react-wordcloud';

class WordCloud extends React.Component {
	constructor(props) {
		super(props);

		const {
		data,
		h,
		w,
		margin,
		} = this.props;

		function words(str) { 
			return str.split(" ").reduce(function(_, word) {
				return _;
			});
		}
				//l;fdjfdlk
		const trollType = 'LeftTroll';
		const filterData = (trollType) => {
			const filteredData = data.filter(row => {
				return trollType === row.accountCategory;
			})

			const tweets = filteredData.map(d => words(d.content));
	
		//	console.log(tweets);
			
			var count = {};
			var length = tweets.length;
			for(var i = 0; i < length; i++) {
				count[tweets[i]] = (count[tweets[i]] || 0) + 1;
			}
			const badWords = ['The', 'This', 'I', 'RT', 'Now', 'You', 'If', 'I\m', 'What', 'Why', 'VIDEO:' ];
			let dataw = Object.keys(count).reduce((acc, key) => {
				if (count[key] > 800 && !badWords.includes(key)) {
					acc.push({text: key, value: count[key]});
				}
				return acc;
			}, []);
			return dataw;
		}


		const leftData = filterData('LeftTroll');
		const rightData = filterData('RightTroll');

		const options = {
			colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
			enableTooltip: true,
			deterministic: false,
			fontFamily: 'impact',
			fontSizes: [5, 60],
			fontStyle: 'normal',
			fontWeight: 'normal',
			padding: 1,
			rotations: 3,
			rotationAngles: [0, 90],
			scale: 'sqrt',
			spiral: 'archimedean',
			transitionDuration: 1000,
		  };
		console.log(leftData);
		console.log(rightData);
		this.state = {
			leftData,
			rightData,
			options,
			trollType
		}
		


	}
	state = {dataw: null, options: null, trollType: null};

	render() {
		const {h, w} = this.props;
		const {
			leftData,
			rightData,
			options,
			trollType
		} = this.state;
		return (
			<div className="container relative">
			<div>
			{[
				'LeftTroll', 'RightTroll'
			].map(t => {
			  return (<button
			  key={t}
			  onClick={() => {
				this.setState({trollType: t});
				// this.updateChart(this.props, this.state);
			  }
			}
				
			  >{t}</button>);
			  })}
			</div>
			<ReactWordcloud words={(trollType === 'LeftTroll') ? leftData : rightData} options={options}/>
			
			</div>
		);
	}
}

WordCloud.displayName = 'WordCloud';

export default WordCloud;

