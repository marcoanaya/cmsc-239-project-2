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

	const tweets = data.map(d => words(d.content));

//	console.log(tweets);
	
	var count = {};
	var length = tweets.length;
	for(var i = 0; i < length; i++) {
		count[tweets[i]] = (count[tweets[i]] || 0) + 1;
	}

	let dataw = Object.keys(count).reduce((acc, key) => {
		if (count[key] > 3000) {
			acc[key] = count[key];
		}
		return acc;
	}, {});

	console.log(dataw);


//	const tweets = data.map(d => words(d.content));

//	console.log(tweets);
	console.log(count);

	}
}

WordCloud.displayName = 'WordCloud';

export default WordCloud;

