// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var fs = require('fs');

var file = fs.readFileSync('data/data.csv', 'utf8');

file = file.split('\n').slice(7);

for( let i = 0, len = file.length; i < len; i++ )
{
	file[i] = file[i].split(',').slice(3);
}

var mass = [];
var data = [];

for( let i = 0, len = file.length - 1; i < len; i++ )
{
	mass[i] = file[i][0];
}

for( let i = 0, len = file.length - 1; i < len; i++ ) //номер массы
{
	file[i] = file[i].slice(1);

	data[i] = [];

	for(let j = 0; j < 10; j++ ) //номер формы
	{
		data[i][j] = [];

		for(let k = j, len = file[i].length; k < len; k+=10) // число закреплений/замеров частоты
		{
			data[i][j].push(file[i][k]);
		}

		data[i][j] = data[i][j].slice(2); //убираю первые две частоты
	}
}

console.log(data);
//data[масса][форма][закрепление/частота]

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(function()
{
	var count = 0;

	for(let oneGraphic of data){

		count++;

		$( ".main" ).append( '<div id="curve_chart' + count + '">Form ' + count + '</div>' );

		var dataVisualization = [];
		dataVisualization[0] = [ 'Mass = ' + mass[count-1], 'Form1', 'Form2', 'Form3', 'Form4', 'Form5', 'Form6', 'Form7', 'Form8', 'Form9', 'Form10' ];

		for( let i = 1, len = 10; i <= len; i++ )
		{
			dataVisualization[i] = [];
			dataVisualization[i].push(i + '');

			for( let j = 1, len = data[0][0].length; j <= len; j++)
			{
				dataVisualization[i][j] = +oneGraphic[j-1][i-1];
			}
		}

		var d = google.visualization.arrayToDataTable(dataVisualization);

	    var options = {
	        title: 'Mass = ' + mass[count-1],
	        //curveType: 'function',
	        legend: { position: 'bottom' },
	        width: 1850,
            height: 900
	    };

	    var chart = new google.visualization.LineChart(document.getElementById('curve_chart' + count));

	    chart.draw(d, options);
	    
	}
});