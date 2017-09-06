const csv = require('csv');

const fs = require('fs');
const parse = require('csv-parse');

const program = require('commander');
const inquirer = require('inquirer');

program
    .version('1.0.0')
    .parse(process.argv);

var filename = '';

getListCSV()


var parser = parse({
    delimiter: '\t',
    trim: true,
    skip_empty_line: true,
    skip_lines_with_empty_values: true
}, function (err, data) {

    var obj = {}

    for (var i in data) {
        var d = data[i];
        var eqNo = d[0];
        var chuteNo = d[1];
        var lineNo = eqNo.substring(0, 2);

        if (i == 0) {
            obj[`${lineNo}-unload-miss`] = {
                load_count: Number(eqNo.substring(2)),
                unload_count: Number(eqNo.substring(2))
            }
            obj[`${lineNo}-load-miss`] = {
                load_count: Number(eqNo.substring(2)),
                unload_count: Number(eqNo.substring(2))
            }
        }

        obj[eqNo] = {
            chute_full: Math.round(Math.random()) == 0 ? "N" : "Y",
            equip_use_yn: Math.round(Math.random()) == 0 ? "N" : "Y",
            error_code: Math.round(Math.random()) == 0 ? "0000" : "1001"
        }

        if (chuteNo) {
            obj[`chute-${eqNo}`] = {
                "load_count": Number(eqNo.substring(2)),
                "unload_count": Number(eqNo.substring(2))
            }
        }
    }

    obj["alarms"] = [{
        "equip_name": "1번 라인 WHEEL SORTER",
        "error_desc": "통신 에러",
        "timestamp": "2017/06/11 19:58:08"
    }, {
        "equip_name": "2번 라인 ITS",
        "error_desc": "통신 에러",
        "timestamp": "2017/06/11 19:48:33"
    }, {
        "equip_name": "2번 라인 WHEEL SORTER",
        "error_desc": "통신 에러",
        "timestamp": "2017/06/11 19:48:33"
    }, {
        "equip_name": "2번 라인 ITS",
        "error_desc": "통신 에러",
        "timestamp": "2017/06/11 19:46:22"
    }, {
        "equip_name": "1번 라인 WHEEL SORTER",
        "error_desc": "통신 에러",
        "timestamp": "2017/06/11 19:46:22"
    }, {
        "equip_name": "2번 라인 WHEEL SORTER",
        "error_desc": "통신 에러",
        "timestamp": "2017/06/11 19:46:22"
    }];

    obj[`line${lineNo}_status`] = {
        "camera_left_error": "OK",
        "camera_ready": "OK",
        "camera_right_error": "ER",
        "camera_top_error": "OK",
        "its_comm_state": "ER",
        "line_mode": "1",
        "sorter_run_mode": "Running",
        "sorter_speed": 120
    }

    obj[`line${lineNo}_total`] = {
        "load_count": 1212,
        "unload_count": 1212
    }

    obj["chart_unload"] = obj["chart_load"] = [{
        "line01": 0,
        "line02": 0,
        "work_time": "03"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "04"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "05"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "06"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "07"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "08"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "09"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "10"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "11"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "12"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "13"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "14"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "15"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "16"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "17"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "18"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "19"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "20"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "21"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "22"
    }, {
        "line01": 5000,
        "line02": 6000,
        "line03": 100,
        "work_time": "23"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "00"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "01"
    }, {
        "line01": 0,
        "line02": 0,
        "work_time": "02"
    }]

    var regex = /(.+)(.csv)$/
    var newFilename = regex.exec(filename)[1] + '.json';
    obj = sortObject(obj);
    writeFile(newFilename, JSON.stringify(obj, ' ', '  '));
});



function inquir(files) {
    inquirer.prompt([{
        type: "list",
        name: "filename",
        message: "CSV Filename:",
        choices: function () {
            return files
        }
    }]).then(function (answers) {
        filename = answers.filename;
        fs.createReadStream('./' + filename).pipe(parser);
    
    });
}


function getListCSV() {
    var regex = /\.(csv)$/;
    fs.readdir('./', (err, files) => {
        var csvFiles = files.filter(file => {
            return regex.test(file)
        });

        inquir(csvFiles);
    });
}



function writeFile(fileName, outputString) {
    var outputFileFullName = fileName

    fs.writeFile(outputFileFullName, outputString, {
        encoding: 'utf8',
        flag: 'w'
    }, (err, fd) => {
        if (err && err.code != 'EEXIST') {
            throw err;
        }

        console.info(outputFileFullName + " file created.")
    });
}

function sortObject(object, desc) {
    var sortable = [];
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            sortable.push({
                key: key,
                value: object[key]
            })
        }
    }

    sortable.sort((a, b) => {
        var isSmallerThanB = a.key < b.key ? -1 : 1;

        if (desc)
            isSmallerThanB = -isSmallerThanB

        return isSmallerThanB
    })

    var sorted = {};
    sortable.forEach(o => {
        sorted[o.key] = o.value;
    })

    return sorted;
}