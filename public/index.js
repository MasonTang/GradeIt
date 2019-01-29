//make a fetch request to own api
//ejs
let totalWeight = [];
let totalGrades = [];

function calculateGrade(){
    $('.calculate-grade').click(function(e){
        e.preventDefault();
        totalGrades = []
        totalWeight = []
        const sum = (a, b) => a + b; 
        //get the value of all the input of grades
        const grades = $('.grade').map(function() {
            return $(this).val();
        })
        //get all the values of all the input of weights
        const weights = $('.weight').map(function () {
            return $(this).val();
        })
        //multiplies the corresponding grades with weight to get totalGrades
        for(let i = 0; i < grades.length; i++){
            totalGrades.push((grades[i] * weights[i]))
        }

        let sumWeight = 0;

        for(let i = 0; i < weights.length; i++){
            if(weights[i] === ''){
                weights[i] === 0;
            }
            sumWeight += parseInt(weights[i])
        }
        totalWeight.push(sumWeight) 

        //const totalWeight = weights.reduce(reducer);
        const finalGrades = totalGrades.reduce(sum);
        //const reducetotalWeight = totalWeight.reduce(sum);
        console.log(weights)        
        console.log(totalWeight);
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