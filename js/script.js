window.onload = function () { 
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var fileSelected = document.getElementById('txtfiletoread');
        fileSelected.addEventListener('change', function (e) {
            var fileExtension = /text.*/;
            var fileTobeRead = fileSelected.files[0]; 
            if (fileTobeRead.type.match(fileExtension)) { 
                var fileReader = new FileReader();
                fileReader.onload = function (e) {
                    var sender = fileReader.result.match(/[-](\s\w+)+[:]/g);
                    var count = {};
                    var countEmoji = {};
                    var datetime = fileReader.result.match(/(\d+\/\d+\/\d+)([^-]*)/g);
                    var date = [];
                    var time = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    var emoji = fileReader.result.match(/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug)
                    sender.forEach(function (element, i) {
                        sender[i] = sender[i].replace("- ", "").replace(":", "");
                    });
                    sender.forEach(element => {
                        count[element] = (count[element] || 0) + 1;
                    });
                    emoji.forEach(element => {
                        countEmoji[element] = (countEmoji[element] || 0) + 1;
                    });
                    datetime.forEach(element => {
                        date.push(element.match(/\d+\/\d+\/\d+/g)[0]);
                        if (element.search(/[aA]/) != -1)
                            time[Number(element.match(/[-+]?\d+:/g)[0].replace(":", "")) % 12]++;
                        else if (element.search(/[pP]/) != -1)
                            time[Number(element.match(/[-+]?\d+:/g)[0].replace(":", "")) == 12 ? 12 : Number(element.match(/[-+]?\d+:/g)[0].replace(":", "")) + 12]++;
                    });
                    console.log(countEmoji);
                    plotSenderGraph(count);
                    plotTimeGraph(time);
                    plotEmojiGraph(countEmoji);
                    plotDayGraph(date);
                }
                fileReader.readAsText(fileTobeRead);

            }
            else {
                alert("Please select text file");
            }

        }, false);
    }
    else {
        alert("Files are not supported");
    }
}

function plotSenderGraph(count) {
    var senderName = [];
    var senderCount = [];
    console.log(count);
    for (var key in count) {
        if (count.hasOwnProperty(key)) {
            if (key.match(/http/) == null)
                senderName.push(key);
            senderCount.push(count[key]);
        }
    }

    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: senderName,
            datasets: [{
                label: '# of Messages',
                data: senderCount,
                backgroundColor: generateColors(senderName.length),
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function plotTimeGraph(time) {
    var ctx = document.getElementById("myChart1").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
            datasets: [{
                label: '# of Messages',
                data: time,
                backgroundColor: generateColors(24),
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function plotEmojiGraph(countEmoji) {
    var counter = [];
    var emoji = [];
    var count = [];
    for (var key in countEmoji) {
        if (countEmoji.hasOwnProperty(key)) {
            counter.push({emoji:key,value:countEmoji[key]});
        }
    }
    counter.sort(function (a, b) {
        return b.value - a.value
    })
    counter=counter.splice(0,5);
    counter.forEach(element => {
        emoji.push(element.emoji);
        count.push(element.value);
    });
    var ctx = document.getElementById("myChart3").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: emoji,
            datasets: [{
                label: '# of Emoji',
                data: count,
                backgroundColor: generateColors(emoji.length),
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function plotDayGraph(date){
    var day = [0,0,0,0,0,0,0];
    date.forEach(element => {
        day[moment(element,"DD/MM/YYYY").format("e")]++;
    });
    
    var ctx = document.getElementById("myChart4").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
            datasets: [{
                label: '# of Messages',
                data: day,
                backgroundColor: generateColors(7),
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    
}

function generateColors(n) {
    var bgColor = [];
    var r, g, b;
    for (let i = 0; i < Number(n); i++) {
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        b = Math.floor(Math.random() * 255);
        bgColor.push('rgba(' + String(r) + ',' + String(g) + ',' + String(b) + ', 0.5)');
    }
    return bgColor;
}