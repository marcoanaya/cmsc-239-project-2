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

	const count = {};

	function words(str) { 
    	return str.split(" ").reduce(function(_, word) {
    		count[word] = count.hasOwnProperty(word) ? count[word] + 1 : 1;
			return _;
    		});
		}

//	const tweets = data.map(d => words(d.content));

//	console.log(tweets);
	console.log(count);

	}
}

WordCloud.displayName = 'WordCloud';

export default WordCloud;

