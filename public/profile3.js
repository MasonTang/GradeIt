'use strict'


const getSem = $('#get-semester')

function watchForm(){
    deleteSemester();
    deleteClass();
    deleteAssignment();
}
watchForm();

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

function deleteClass() {

    $('#get-class').on('click', 'button', function (e) {

        let dataId = $(this).attr('data-id');
        const classId = {
            classId: dataId
        };
        const closestli = $(this).closest('li');

        $.ajax({
            type: 'Delete',
            url: '/api/class',
            data: classId,
            success: function () {
                closestli.remove();
            },
            error: function () {
                alert('error saving error');
            }
        })
    })
}

function deleteAssignment() {

    $('#get-assignment').on('click', 'button', function (e) {

        let dataId = $(this).attr('data-id');
        const assignmentId = {
            assignmentId: dataId
        };
        const closestli = $(this).closest('li');

        $.ajax({
            type: 'Delete',
            url: '/api/assignment',
            data: assignmentId,
            success: function () {
                closestli.remove();
            },
            error: function () {
                alert('error saving error');
            }
        })
    })
}