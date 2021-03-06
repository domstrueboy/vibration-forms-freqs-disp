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


//Запись распарсенного файла:
var output = '';

for(let i=0, leni=mass.length; i<leni; i++)
{
	output+= 'Mass ' + mass[i] + ' kg:\n';
	for(let j=0, lenj=data[i].length; j<lenj; j++)
	{
		output+= 'Form#' + (j+1) + ': ;' + data[i][j].join([separator = ';']).replace(/\u002E/g, ',') + '\n';
	}
}

fs.writeFile('data/output.csv', output, 'utf8', function (err) {
      if (err) {
        console.log("failed to save output.csv");
      }
});
//////////////////////////////


$( ".main" ).append( '<br><button id="changer" class="btn btn-danger">Click me!</button>' );
$( ".main" ).append( '<div id="curve_chart"></div>' );


google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(function()
{
	var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

	var counter = 1;
	draw(counter); counter++;

	var button = $('#changer');

	button.on('click', function ()
	{
		draw(counter); counter++;

		if( counter > mass.length )
		{
			counter = 1;
		}
	});

	

	function draw(count)
	{
		var oneGraphic = data[count-1];
		var dataVisualization = [];
		dataVisualization[0] = [ 'Mass = ' + mass[count-1], 'Паразитная синфазная', 'Рабочая', 'Паразитная противофазная', 'Трубки в плоскости синф', 'Form5', 'Form6', 'Form7', 'Form8', 'Form9', 'Form10' ];

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
		    animation:{
		       	//startup: true,
			    duration: 500,
			    easing: 'out',
			},
		    width: 1850,
	        height: 900
		};

	    chart.draw(d, options);
	}    

});