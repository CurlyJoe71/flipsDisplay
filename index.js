
let raw;
let stringified;
let parsedData;
let managersObj;
let officeArr;
let repsObj;
let managerTableData = [];
let officeTableData = [];
let repsTableData = [];
let managersOffice;
let today = new Date();
// let day = today.getDate();
//manually assigned start date of July 13
let startDate = new Date('2020-07-13');
let startDay = startDate.getDate();
// let month = today.getMonth();
// let year = today.getFullYear();
// let firstOfMonth = new Date(year, month, 1);
let minFlips = Math.floor(startDay * 0.2);
// console.log(today, day, minFlips);

$.support.cors = true;

firstBy=(function(){function e(f){f.thenBy=t;return f}function t(y,x){x=this;return e(function(a,b){return x(a,b)||y(a,b)})}return e})();

const sortReps = () => {
    let success = JSON.parse(parsedData).filter(flip => flip.Flipped === true)
        .sort((a, b) => a.Office.localeCompare(b.Office));
    // console.log('success flips: ', success);
    let fail = JSON.parse(parsedData).filter(flip => flip.Flipped === false)
        .sort((a, b) => a.Office.localeCompare(b.Office));
    // console.log('failed opps', fail);

    repsObj = [];
    let j = 0;
    for (var i = 0; i < JSON.parse(parsedData).length; i++) {
        // console.log('object.values', Object.values(managersObj));
        if($.inArray(JSON.parse(parsedData)[i]["CSR"], repsObj.map(m=>m.CSR))<0 //&& JSON.parse(parsedData)[i]["Manager"] !== "Unknown"
        ){
            repsObj[j] = {
                CSR:JSON.parse(parsedData)[i]["CSR"], 
                Office:JSON.parse(parsedData)[i]["Office"],
                Name:JSON.parse(parsedData)[i]["EmployeeName"]
            };
            j++;
        }
    }

    // console.log('repsObj: ', repsObj);

    repsObj.map((r, i) => {
        repsObj[i] = [];
        repsObj[i].push(r.CSR)
        repsObj[i].push(getRepsCount(r.CSR, success));
        repsObj[i].push(getRepsCount(r.CSR, fail));
        repsObj[i].push(repsObj[i][1] + repsObj[i][2]);
        repsObj[i].push((repsObj[i][1] / repsObj[i][3]).toFixed(2));
        repsObj[i].push(r.Office);
        repsObj[i].push(r.Name);
    })
    
    // console.log('repsObj', repsObj);
    
    repsObj.sort(
        firstBy(function(a, b) {return b[4] - a[4]})
        .thenBy(function(a, b) {return b[1] - a[1]})
        )

        repsObj = repsObj.filter(min => min[3] >= minFlips);
        let topScores = repsObj.map(r => r[4]).filter((s, i, arr) => arr.indexOf(s) === i);
        console.log('topScores: ', topScores);

    for (let i = 0; i < repsObj.length; i++) {
        // console.log('starting table update', managerTableData[i][0]);
        if (repsObj[i][4] === topScores[0]) {
            $("#repsTableBody").append(
                `<tr class="first-place">
                    <th scope='row' class='text-center'>${repsObj[i][0]}</th>
                    <td class='text-center'>${repsObj[i][6]}</td>
                    <td class='text-center'>${repsObj[i][1]}</td>
                    <td class='text-center'>${repsObj[i][3]}</td>
                    <td class='text-center'>${(repsObj[i][4] * 100).toFixed(0)}</td>
                </tr>`
            );
        }
        else if (repsObj[i][4] === topScores[1]) {
            $("#repsTableBody").append(
                `<tr class="second-place">
                    <th scope='row' class='text-center'>${repsObj[i][0]}</th>
                    <td class='text-center'>${repsObj[i][6]}</td>
                    <td class='text-center'>${repsObj[i][1]}</td>
                    <td class='text-center'>${repsObj[i][3]}</td>
                    <td class='text-center'>${(repsObj[i][4] * 100).toFixed(0)}</td>
                </tr>`
            );
        }
        else if (repsObj[i][4] === topScores[2]) {
            $("#repsTableBody").append(
                `<tr class="third-place">
                    <th scope='row' class='text-center'>${repsObj[i][0]}</th>
                    <td class='text-center'>${repsObj[i][6]}</td>
                    <td class='text-center'>${repsObj[i][1]}</td>
                    <td class='text-center'>${repsObj[i][3]}</td>
                    <td class='text-center'>${(repsObj[i][4] * 100).toFixed(0)}</td>
                </tr>`
            );
        }
        else {
            $("#repsTableBody").append(
                `<tr>
                    <th scope='row' class='text-center'>${repsObj[i][0]}</th>
                    <td class='text-center'>${repsObj[i][6]}</td>
                    <td class='text-center'>${repsObj[i][1]}</td>
                    <td class='text-center'>${repsObj[i][3]}</td>
                    <td class='text-center'>${(repsObj[i][4] * 100).toFixed(0)}</td>
                </tr>`
            );
        }
    }
}

const sortOffice = () => {
    let success = JSON.parse(parsedData).filter(flip => flip.Flipped === true)
        .sort((a, b) => a.Office.localeCompare(b.Office));
    // console.log('success flips: ', success);
    let fail = JSON.parse(parsedData).filter(flip => flip.Flipped === false)
        .sort((a, b) => a.Office.localeCompare(b.Office));
    // console.log('failed opps', fail);

    officeArr = [];
    let j = 0;
    for (var i = 0; i < JSON.parse(parsedData).length; i++) {
        // console.log('object.values', Object.values(managersObj));
        if($.inArray(JSON.parse(parsedData)[i]["Office"], officeArr)<0 && JSON.parse(parsedData)[i]["Manager"] !== "Unknown"){
            officeArr[j] = JSON.parse(parsedData)[i]["Office"];
            j++;
        }
    }
    // console.log('officeArr:', officeArr);

    officeArr.map((o, i) => {
        officeTableData[i] = [];
        officeTableData[i].push(o)
        officeTableData[i].push(getOfficeCount(o, success));
        officeTableData[i].push(getOfficeCount(o, fail));
        officeTableData[i].push(officeTableData[i][1] + officeTableData[i][2]);
        officeTableData[i].push((officeTableData[i][1] / officeTableData[i][3]).toFixed(2));
        // console.log('officeTableData', officeTableData);
    })

    officeTableData.sort(
        firstBy(function(a, b) {return b[4] - a[4]})
        .thenBy(function(a, b) {return b[1] - a[1]})
    )

    let topScores = officeTableData.map(r => r[4]).filter((s, i, arr) => arr.indexOf(s) === i);
    console.log('topScores: ', topScores);

    for (let i = 0; i < officeTableData.length; i++) {
        // console.log('starting table update', managerTableData[i][0]);
        if (officeTableData[i][4] === topScores[0]) {
            $("#officeTableBody").append(
                `<tr class="first-place">
                    <th scope='row' class='text-center'>${officeTableData[i][0]}</th>
                    <td class='text-center'>${officeTableData[i][1]}</td>
                    <td class='text-center'>${officeTableData[i][3]}</td>
                    <td class='text-center'>${(officeTableData[i][4] * 100).toFixed(0)}</td>
                </tr>`
            );
        }
        else if (officeTableData[i][4] === topScores[1]) {
            $("#officeTableBody").append(
                `<tr class="second-place">
                    <th scope='row' class='text-center'>${officeTableData[i][0]}</th>
                    <td class='text-center'>${officeTableData[i][1]}</td>
                    <td class='text-center'>${officeTableData[i][3]}</td>
                    <td class='text-center'>${(officeTableData[i][4] * 100).toFixed(0)}</td>
                </tr>`
            );
        }
        else if (officeTableData[i][4] === topScores[2]) {
            $("#officeTableBody").append(
                `<tr class="third-place">
                    <th scope='row' class='text-center'>${officeTableData[i][0]}</th>
                    <td class='text-center'>${officeTableData[i][1]}</td>
                    <td class='text-center'>${officeTableData[i][3]}</td>
                    <td class='text-center'>${(officeTableData[i][4] * 100).toFixed(0)}</td>
                </tr>`
            );
        }
        else {
            $("#officeTableBody").append(
                `<tr>
                    <th scope='row' class='text-center'>${officeTableData[i][0]}</th>
                    <td class='text-center'>${officeTableData[i][1]}</td>
                    <td class='text-center'>${officeTableData[i][3]}</td>
                    <td class='text-center'>${(officeTableData[i][4] * 100).toFixed(0)}</td>
                </tr>`
            );
        }
    }
}

const sortDataManager = data => {
    // console.log('starting sortData', data);
    let success = JSON.parse(parsedData).filter(flip => flip.Flipped === true)
        .sort((a, b) => a.CSR.localeCompare(b.CSR));
    // console.log('success flips: ', success);
    let fail = JSON.parse(parsedData).filter(flip => flip.Flipped === false)
        .sort((a, b) => a.CSR.localeCompare(b.CSR));
    // console.log('failed opps', fail);

    managersObj = [];
    let j = 0;
    for (var i = 0; i < JSON.parse(parsedData).length; i++) {
        // console.log('object.values', Object.values(managersObj));
        if($.inArray(JSON.parse(parsedData)[i]["Manager"], managersObj.map(m=>m.Manager))<0 && JSON.parse(parsedData)[i]["Manager"] !== "Unknown"){
            managersObj[j] = {Manager:JSON.parse(parsedData)[i]["Manager"], Office:JSON.parse(parsedData)[i]["Office"]};
            j++;
        }
    }

    managersObj.map((m, i) => {
        managerTableData[i] = [];
        managerTableData[i].push(m.Manager)
        managerTableData[i].push(getManagerCount(m.Manager, success));
        managerTableData[i].push(getManagerCount(m.Manager, fail));
        managerTableData[i].push(managerTableData[i][1] + managerTableData[i][2]);
        managerTableData[i].push((managerTableData[i][1] / managerTableData[i][3]).toFixed(2));
        managerTableData[i].push(m.Office)
        // console.log('managerTable', managerTableData);
    })

    managerTableData.sort(
        firstBy(function(a, b) {return b[4] - a[4]})
        .thenBy(function(a, b) {return b[1] - a[1]})
    )
    
    let topScores = managerTableData.map(r => r[4]).filter((s, i, arr) => arr.indexOf(s) === i);
    console.log('topScores: ', topScores);

    for (let i = 0; i < managerTableData.length; i++) {
        // console.log('starting table update', managerTableData[i][0]);
        if (managerTableData[i][4] === topScores[0]) {
            $("#managerTableBody").append(
                `<tr class="first-place">
                    <th scope='row' class='text-center'>${managerTableData[i][0]}</th>
                    <td class='text-center'>${managerTableData[i][1]}</td>
                    <td class='text-center'>${managerTableData[i][3]}</td>
                    <td class='text-center'>${(managerTableData[i][4] * 100).toFixed(0)}</td>
                </tr>`
            );
        }
        else if (managerTableData[i][4] === topScores[1]) {
            $("#managerTableBody").append(
                `<tr class="second-place">
                    <th scope='row' class='text-center'>${managerTableData[i][0]}</th>
                    <td class='text-center'>${managerTableData[i][1]}</td>
                    <td class='text-center'>${managerTableData[i][3]}</td>
                    <td class='text-center'>${(managerTableData[i][4] * 100).toFixed(0)}</td>
                </tr>`
            );
        }
        else if (managerTableData[i][4] === topScores[2]) {
            $("#managerTableBody").append(
                `<tr class="third-place">
                    <th scope='row' class='text-center'>${managerTableData[i][0]}</th>
                    <td class='text-center'>${managerTableData[i][1]}</td>
                    <td class='text-center'>${managerTableData[i][3]}</td>
                    <td class='text-center'>${(managerTableData[i][4] * 100).toFixed(0)}</td>
                </tr>`
            );
        }
        else {
            $("#managerTableBody").append(
                `<tr>
                    <th scope='row' class='text-center'>${managerTableData[i][0]}</th>
                    <td class='text-center'>${managerTableData[i][1]}</td>
                    <td class='text-center'>${managerTableData[i][3]}</td>
                    <td class='text-center'>${(managerTableData[i][4] * 100).toFixed(0)}</td>
                </tr>`
            );
        }
    }
}

getRepsCount = (rep, object) => {
    let c = 0;
    for (var i = 0; i < object.length; i++) {
        if (object[i].CSR === rep) {
            c++;
        }
    }
    return c;
}

getOfficeCount = (office, object) => {
    let c = 0;
    for (var i = 0; i < object.length; i++) {
        if (object[i].Office === office) {
            c++;
        }
    }
    return c;
}

getManagerCount = (manager, object) => {
    let c = 0;
    for (var i = 0; i < object.length; i++) {
        if (object[i].Manager === manager) {
            c++;
        }
    }
    return c;
}

$.ajax({
    url: "https://agile-depths-42034.herokuapp.com/",
    // url: "http://localhost:7581",
    dataType: 'json',
    method: 'GET',
    crossDomain: true,
    async: false,
    headers: {
        'Content-Type': 'application/json',
        'Accepts': '*/*'
    },
    dataFilter: (data) => {
        // console.log('dataFilter data: ', data);
        stringified = JSON.stringify(data);
        // console.log('datafilter string', stringified);
        return stringified;
    },
    success: (data) => {
        parsedData = JSON.parse(JSON.stringify(data));
        console.log('success: ', parsedData);
    },
    error: (x, y, z) => {
        console.log('y, z error: ', y, z);
    },
    complete: (x, y) => {
        // console.log('complete y:', y);
    }
}).done(() => {
    console.log('done');
    // console.log('all done:', parsedData);
    sortDataManager(parsedData);
    sortOffice(parsedData);
    sortReps(parsedData);
})
