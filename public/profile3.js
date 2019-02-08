'use strict'

//req.user
const getSem = $('#get-semester')

function watchForm(){
    getSemester();
    postSemester();
    deleteSemester();
    renderClass();
}
watchForm();

function getSemester(){
    $.ajax({
        type:'GET',
        url:`/api/semester`,
        success: function(semesters) {
            
            $.each(semesters, function(i, semester) {
                console.log(semester)
                getSem.append(`
                <li class="addSemesterLayout">
                ${semester.semester}
                <button data-id='${semester._id}' class="remove">X</button>
                </li>`)
            })
        },
        error:function() {
            alert('error loading orders')
        }
    })
}

function postSemester() {
    $('#add-semester').on('click', function() {

        const semesterInput = {
            semester: $('#input-semester').val()
        };

        $.ajax({
            type: 'POST',
            url: '/api/semester',
            data: semesterInput,
            success: function(newSem){
                console.log(newSem)
                getSem.append(`
                <li class="addSemesterLayout">
                ${newSem.semester}
                <button data-id='${newSem.user}' semester-id='${newSem.semesterId}' class="remove">X</button>
                </li>`);
            },
            error: function() {
                alert('error saving error')
            }
        });
    });
}

function deleteSemester(){
    
    $('#get-semester').on('click', 'button', function(e){

        let dataId = $(this).attr('data-id');
        const semesterId = {
            semesterId: dataId
        };
        const closestli = $(this).closest('li');

        $.ajax({
            type:'Delete',
            url: '/api/semester',
            data: semesterId,
            success: function(){
                closestli.remove();
            },
            error: function () {
                alert('error saving error');
            }
        })
    })
}

function renderClass(){
    $('#get-semester').on('click', '.addSemesterLayout', function(e){
        console.log('hi')


        $.ajax({
            type: 'GET',
            url: `/class`,
            data: data,
            success: function (semesters) {
                
            },
            error: function () {
                alert('error loading orders')
            }
        })
    })
}