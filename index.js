import * as fs from 'node:fs';
const hours = [];
//console.log(hours);
//reading the CSV
let file = fs.readFileSync("pvwatts_hourly_data.csv", 'utf-8');
//Removing all "" because otherwise all values will be '"0"' and that can't be parseFloat-ed
file = file.replace(/"/g, '');
//Splitting the file into an array of rows
let fileArray = file.split("\n");
//Removing the first line
fileArray.shift(1, -1);
csvReader(fileArray);
//console.log(hours[0]);
//dailyDcOutput();
//dcLowOutput();
//let monthlyAvg = totalDCOutputMonthly()
//totalDCOutputYearly();
// let yearlyAvg = avgDCOutput();
// dcDifference(yearlyAvg, monthlyAvg);
//dcStructure();
// monthyAscendingOrder();
// monthyDescendingOrder();



//Formating the CSV file and pusing it into hours
function csvReader(array){
    //removing the last element, but because there seems to be an empy row at the end we need to remove the last 2
    array.splice(-2);

    //Creating an object for each day
    array.forEach(element => {
        //console.log(element)
        let elementArray = element.split(",");
        //console.log(elementArray)
        let obj = {
            'Month': parseFloat(elementArray[0]),
            'Day': parseFloat(elementArray[1]),
            'Hour': parseFloat(elementArray[2]),
            'Beam Irradiance': {
                'value': parseFloat(elementArray[3]),
                'unit': 'W/m^2'
            },
            'Diffuse Irradiance': {
                'value': parseFloat(elementArray[4]),
                'unit': 'W/m^2'
            },
            'Ambient Temperature': {
                'value': parseFloat(elementArray[5]),
                'unit': 'C'
            },
            'Wind Speed': {
                'value': parseFloat(elementArray[6]),
                'unit': 'm/s'
            },
            'Albedo': parseFloat(elementArray[7]),
            'Plane of Array Irradiance': {
                'value': parseFloat(elementArray[8]),
                'unit': '(W/m^2)'
            },
            'Cell Temperature': {
                'value': parseFloat(elementArray[9]),
                'unit': 'C'
            },
            'DC Array Output': {
                'value': parseFloat(elementArray[10]),
                'unit': 'W'
            },
            'AC System Output': {
                'value': parseFloat(elementArray[11].slice(0,-1)),
                'unit': 'W'
            }
        };
        hours.push(obj);
    });
};

//1. Determine the highest DC array output FIXED
function dailyDcOutput(){
    let highest = 0;
    let highestDay = {'Month': 1, 'Day':1};
    //Giving highest the first day
    for (let i = 0; i < 24; i++) {
        highest+=hours[i]["DC Array Output"]["value"];
    }
    //Creating a current day with the first hours value, and a curr output with 0w
    let currDay = hours[0];
    let currDayOutput = 0;
    hours.forEach(hour => {
        //Going trough all days by checking if the current hours day and month value are the same
        if(hour["Day"] === currDay["Day"] && hour["Month"] === currDay["Month"]){
            currDayOutput += hour["DC Array Output"]["value"];
            //console.log(currDayOutput)
        }
        //If the day is different we check if the output is higher, if it is we replace the values in highestday and highest
        //then set the output back to 0 and THEN replace currentDay with the next day
        else{  
            if(currDayOutput>highest){
                highest = currDayOutput;
                highestDay["Month"] = currDay["Month"];
                highestDay["Day"] = currDay["Day"]; 
            }
            currDayOutput = 0;
            currDay = hour;
        }
    });
    //console.log(highest)
    //return highest;
    console.log(`The highest DC output was during the ${highestDay["Month"]} months ${highestDay["Day"]}th/st/rd day`);
    console.log(`${highest} kW`);
}

//2. Determine lowest DC array output FIXED

function dcLowOutput(){ //I'm lazy, but use your brain to replace the word high with low
    let highest = 0;
    let highestDay = {'Month': 1, 'Day':1};
    //Giving highest the first day
    for (let i = 0; i < 24; i++) {
        highest+=hours[i]["DC Array Output"]["value"];
    }
    //Creating a current day with the first hours value, and a curr output with 0w
    let currDay = hours[0];
    let currDayOutput = 0;
    hours.forEach(hour => {
        //Going trough all days by checking if the current hours day and month value are the same
        if(hour["Day"] === currDay["Day"] && hour["Month"] === currDay["Month"]){
            currDayOutput += hour["DC Array Output"]["value"];
            //console.log(currDayOutput)
        }
        //If the day is different we check if the output is higher, if it is we replace the values in highestday and highest
        //then set the output back to 0 and THEN replace currentDay with the next day
        else{  
            if(currDayOutput<highest){
                highest = currDayOutput;
                highestDay["Month"] = currDay["Month"];
                highestDay["Day"] = currDay["Day"]; 
            }
            currDayOutput = 0;
            currDay = hour;
        }
    });
    //console.log(highest)
    //return highest;
    console.log(`The lowest DC output was during the ${highestDay["Month"]} months ${highestDay["Day"]}th/st/rd day`);
    console.log(`${highest} kW`);
}

//4. Determine the total DC output for the year
function totalDCOutputYearly(){
    let total = 0;
    hours.forEach(day => {
        total+=day["DC Array Output"]["value"];
    });
    //console.log(`Total DC output for the year ${total}kW`);
    return total;
}

//3. Determine the total DC output for each month
function totalDCOutputMonthly(){
    let monthlyArray = [];
    //console.log(monthlyArray.length)
    hours.forEach(day => {
        if(monthlyArray.length<day["Month"]){
            monthlyArray.push(day["DC Array Output"]["value"])
        }
        else monthlyArray[day["Month"]-1]+=day["DC Array Output"]["value"];
    });
    //console.log(monthlyArray);
    return monthlyArray;
}

//5. Determine the monthly average DC output
function avgDCOutput(){
    let total = 0;
    hours.forEach(day => {
        total+=day["DC Array Output"]["value"];
    });
    //console.log(`Avg DC output for the year ${total/12}kW`);
    return total/12;
}

//6. Determine difference from average for each month
function dcDifference(avgYearly, monthlyArray){
    monthlyArray.forEach(month => {
        console.log(`the difference from the average: ${avgYearly.toFixed(2)}kW is ${(avgYearly-month).toFixed(2)}kW`)
    });
}

//7. Create a complex data structure for DC Array output for each month
function dcStructure(){
    //σ = sum of numbers
    const dcArrayOutputByMonths = {
        // 'avg' : 0,
        // '1' : {
        //     'month': 'January',
        //     'σ':0
        // }
    };
    dcArrayOutputByMonths["avg"] = avgDCOutput();
    hours.forEach(hour => {
        if(hour["Month"] in dcArrayOutputByMonths){
            dcArrayOutputByMonths[hour["Month"]]['σ']+=hour["DC Array Output"]["value"];
        }
        else{
            dcArrayOutputByMonths[hour["Month"]]={
                "month" : numToMonth(hour["Month"]),
                'σ' : hour["DC Array Output"]["value"]
            }
        }
    });
    //console.log(dcArrayOutputByMonths);
    return dcArrayOutputByMonths;
}
function numToMonth(value){
    let returnValue = '';
    switch (value) {
        case 1:
            returnValue = "January";
            break;
        case 2:
            returnValue = "February";
            break;
        case 3:
            returnValue = "March";
            break;
        case 4:
            returnValue = "April";
            break;
        case 5:
            returnValue = "May";
            break;
        case 6:
            returnValue = "June";
            break;
        case 7:
            returnValue = "July";
            break;
        case 8:
            returnValue = "August";
            break;
        case 9:
            returnValue = "September";
            break;
        case 10:
            returnValue = "October";
            break;
        case 11:
            returnValue = "November";
            break;
        case 12:
            returnValue = "December";
            break;
        default:
            break;
    }
    return returnValue;
}



//8. Put the previous values into an array and sort them in ascending order
function monthyAscendingOrder(){
    let monthlyArray = [];
    let monthlyObject = dcStructure();
    //console.log(monthlyObject);
    for (const key in monthlyObject) {
        console.log(key)
        if(key!=="avg"){
            monthlyArray.push(monthlyObject[key]);
        }
    }
    monthlyArray.sort((a,b) => a['σ']-b['σ']);
    console.log(monthlyArray)
}

//9. Put the previous values into an array and sort them in descending order
function monthyDescendingOrder(){
    let monthlyArray = [];
    let monthlyObject = dcStructure();
    //console.log(monthlyObject);
    for (const key in monthlyObject) {
        console.log(key)
        if(key!=="avg"){
            monthlyArray.push(monthlyObject[key]);
        }
    }
    monthlyArray.sort((a,b) => b['σ']-a['σ']);
    console.log(monthlyArray)
}

//10. Determine the total DC output for each day, it's almost the same as the 3rd task so I'm skipping it for now

//11. Put the previous values into an array and sort them in ascending order, almost the same as 8 so skipping for now
//12. Put the previous values into an array and sort them in descending order, almost the same as 8 so skipping for now
