// //get request
// fetch(`http://localhost:8080/grades`)
//     .then(function(response) {
//         return response.json()
//     })
//     .then(function(data){
//         console.log(data)
//         $('.display-grade').append(data[0].className);
//     })
function watchform(){
    addSemester();
    addClass();
    saveSemester();
}
watchform();



function addSemester(){
    $('.profile').on('click','.new-semester', function(e){
        const semester = $('#semester').val();
        const calculator = ` <form method="POST" action="/grades/:<%= user._id%> class="profile-calc">

            <fieldset class="no-border">
            
            <input placeholder="Fall,2018" type="text" name="semester" id="semester">
            
            <button class="save-semester">Save </button>
            
            </fieldset>
    
            <fieldset class="profile-calculator">
                <div>
                    <input placeholder="Class Name" type="text" name="class-name" id="class-name">
                    <ul class="calc-header">
                        <li>Assignment</li>
                        <li>Grade %</li>
                        <li>Weight %</li>
                    </ul>
                </div>
    
                <div class="calc-form">
                    <ul class="calc-input">
                        <li><input class="assignment" type="text" name="assignment" id="assignment" placeholder="e.g. Homework"></li>
                        <li><input class="grade" type="number" name="grade-percent" id="grade-percent"></li>
                        <li><input class="weight" type="number" name="weight-percent" id="weight-percent"></li>
                    </ul>
                    <ul class="calc-input">
                        <li><input class="assignment" type="text" name="assignment" id="assignment" placeholder="e.g. Quiz"></li>
                        <li><input class="grade" type="number" name="grade-percent" id="grade-percent"></li>
                        <li><input class="weight" type="number" name="weight-percent" id="weight-percent"></li>
                    </ul>
                    <ul class="calc-input">
                        <li><input class="assignment" type="text" name="assignment" id="assignment" placeholder="e.g. Test"></li>
                        <li><input class="grade" type="number" name="grade-percent" id="grade-percent"></li>
                        <li><input class="weight" type="number" name="weight-percent" id="weight-percent"></li>
                    </ul>
                    <ul class="calc-input">
                        <li><input class="assignment" type="text" name="assignment" id="assignment" placeholder="e.g. Finals"></li>
                        <li><input class="grade" type="number" name="grade-percent" id="grade-percent"></li>
                        <li><input class="weight" type="number" name="weight-percent" id="weight-percent"></li>
                    </ul>
                </div>
    
                <div>
                    <p class="add-assignment">+ Add Assignment</p>
                    <label class="optional" for="final Grade">Optional: What do I need to make on the finals to make a
                        <input class="final" type="number"> in
                        the class.</label>
                    <p></p>
                    <button class="calculate-grade" type="submit">Calculate Grade</button>
                    <p class="add-class">+ Add Class</p>
                </div>
    
                <div class="display-grade">
    
                </div>
    
                <div class="display-needed-grade">
    
                </div>
    
            </fieldset>
            
            <div class="add-semester">
        
            </div>

        </form>`

        
        $(calculator).appendTo($('.append-new-semester'));
    })
}

function addClass(){
    $('.append-new-semester').on('click','.add-class', function(e){
        const semester = $('#semester').val();
        console.log(semester);
        //e.target
        const addClass = `<form method="POST" action="/grades/:<%= user._id%> class="profile-calc">
    
            <fieldset class="profile-calculator">
                <div>
                    <input placeholder="Class Name" type="text" name="class-name" id="class-name">
                    
                    <ul class="calc-header">
                        <li>Assignment</li>
                        <li>Grade %</li>
                        <li>Weight %</li>
                    </ul>
                </div>
    
                <div class="calc-form">
                    <ul class="calc-input">
                        <li><input class="assignment" type="text" name="assignment" id="assignment" placeholder="e.g. Homework"></li>
                        <li><input class="grade" type="number" name="grade-percent" id="grade-percent"></li>
                        <li><input class="weight" type="number" name="weight-percent" id="weight-percent"></li>
                    </ul>
                    <ul class="calc-input">
                        <li><input class="assignment" type="text" name="assignment" id="assignment" placeholder="e.g. Quiz"></li>
                        <li><input class="grade" type="number" name="grade-percent" id="grade-percent"></li>
                        <li><input class="weight" type="number" name="weight-percent" id="weight-percent"></li>
                    </ul>
                    <ul class="calc-input">
                        <li><input class="assignment" type="text" name="assignment" id="assignment" placeholder="e.g. Test"></li>
                        <li><input class="grade" type="number" name="grade-percent" id="grade-percent"></li>
                        <li><input class="weight" type="number" name="weight-percent" id="weight-percent"></li>
                    </ul>
                    <ul class="calc-input">
                        <li><input class="assignment" type="text" name="assignment" id="assignment" placeholder="e.g. Finals"></li>
                        <li><input class="grade" type="number" name="grade-percent" id="grade-percent"></li>
                        <li><input class="weight" type="number" name="weight-percent" id="weight-percent"></li>
                    </ul>
                </div>
    
                <div>
                    <p class="add-assignment">+ Add Assignment</p>
                    <label class="optional" for="final Grade">Optional: What do I need to make on the finals to make a
                        <input class="final" type="number"> in
                        the class.</label>
                    <p></p>
                    <button class="calculate-grade" type="submit">Calculate Grade</button>
                    <p class="add-class">+ Add Class</p>
                </div>
    
                <div class="display-grade">
    
                </div>
    
                <div class="display-needed-grade">
    
                </div>
    
            </fieldset>

        </form>`

        console.log(semester);   
        $(event.target).closest("div").append(addClass); 
        $('#semester').append(addClass);

        //$(addClass).appendTo($('.append-new-class'));
    })
}

function saveSemester(){
    $('.save-semester').click(function(e){
        e.preventDefault();
    })

    $('.append-new-semester').on('click', '.save-semester', function(e) {
        e.preventDefault();
        $('.profile-calculator').toggle();
    })
}