'use strict'
//make a fetch request to own api
//ejs
let totalWeight = [];
let totalGrades = [];

function calculateGrade(){
    $('.calculate-grade').click(function(e){
        e.preventDefault();
        const totalGrades = [];
        //totalWeight = [];
        const arrayWeight = [];

        const sum = (a, b) => parseInt(a) + parseInt(b); 
        //get the value of all the input of grades
        const grades = $('.grade').map(function() {
            return $(this).val();
        })
        //get all the values of all the input of weights
        const weights = $('.weight').map(function () {
            return $(this).val();
        })
        //push the values of weights to an arrayWeight
        for (let i = 0; i < weights.length; i++) {
            arrayWeight.push(weights[i]);
        }
        //filter out all the empty array strings
        const onlyWeights = arrayWeight.filter(number => number != '')

        //multiplies the corresponding grades with weight to get totalGrades
        for(let i = 0; i < grades.length; i++){
            totalGrades.push((grades[i] * weights[i]))
        }
        //all the weights added together
        const totalWeight = onlyWeights.reduce(sum);
        //sum of weights[i] and grades[i]
        const sumMultGradeWeight = totalGrades.reduce(sum);
        //const reducetotalWeight = totalWeight.reduce(sum);
        const finalGrade = (sumMultGradeWeight / totalWeight);
        console.log(finalGrade)

    })
}

calculateGrade();

function addAssignment(){
    $(".add-assignment").click(function(e){
        const assignment = `<ul class="calc-input">
                    <li><input class="assignment" type="text" name="assignment" id="assignment"></li>
                    <li><input class="grade" type="number" name="grade-percent" id="grade-percent"></li>
                    <li><input class="weight" type="number" name="weight-percent" id="weight-percent"></li>
                </ul>`
        $(assignment).appendTo($('.calc-form'));
    }) 
}

addAssignment();


function signIn(){
    // $('.sign-in').on('submit', function(event){
    //     event.preventDefault();
    //     //window.location() = "/profile";
    //     console.log('/profile');
    // })
   console.log('testing');
}
signIn()