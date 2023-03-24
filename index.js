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
//dcOutput();
//dcLowOutput();
let monthlyAvg = totalDCOutputMonthly()
//totalDCOutputYearly();
let yearlyAvg = avgDCOutput();
dcDifference(yearlyAvg, monthlyAvg);


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

//1. Determine the highest DC array output
function dcOutput(){
    let highest = hours[0];
    hours.forEach(day => {
        //console.log(day["DC Array Output"]["value"]);
        if ((highest["DC Array Output"]["value"]) < day["DC Array Output"]["value"]) {
            highest = day;
        }
    });
    //console.log(highest)
    //return highest;
    console.log(`The highest DC output was during the ${highest["Month"]} months ${highest["Day"]}th/st/rd day`);
    console.log(`${highest["DC Array Output"]["value"]} kW`);
}

//2. Determine lowest DC array output

function dcLowOutput(){
    let lowest = hours[0];
    hours.forEach(day => {
        if (lowest["DC Array Output"]["value"]===0) {
            lowest=day;
        }
        else{
        if ((lowest["DC Array Output"]["value"]) > day["DC Array Output"]["value"]&&day["DC Array Output"]["value"]!==0) {
            lowest = day;
        }
        }
       // console.log(day["DC Array Output"]["value"]);
       
    });
    //console.log(lowest)
    console.log(`The highest DC output was during the ${lowest["Month"]} months ${lowest["Day"]}th/st/rd day`);
    console.log(`${lowest["DC Array Output"]["value"]} kW`);
    return lowest;
}

//4. Determine the total DC output for the year
function totalDCOutputYearly(){
    let total = 0;
    hours.forEach(day => {
        total+=day["DC Array Output"]["value"];
    });
    console.log(`Total DC output for the year ${total}kW`);
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
    console.log(monthlyArray);
    return monthlyArray;
}

//5. Determine the monthly average DC output
function avgDCOutput(){
    let total = 0;
    hours.forEach(day => {
        total+=day["DC Array Output"]["value"];
    });
    console.log(`Avg DC output for the year ${total/12}kW`);
    return total/12;
}

//6. Determine difference from average for each month
function dcDifference(avgYearly, monthlyArray){
    monthlyArray.forEach(month => {
        console.log(`the difference from the average: ${avgYearly.toFixed(2)}kW is ${(avgYearly-month).toFixed(2)}kW`)
    });

}
