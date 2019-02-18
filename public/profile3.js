'use strict'


const getSem = $('#get-semester')

function watchForm(){
    deleteSemester();
    deleteClass();
    deleteAssignment();
}
watchForm();

function deleteSemester(){
    
    $('#get-semester').on('click', 'button.remove', function(e){

        let dataId = $(this).attr('data-id');
        const semesterId = {
            semesterId: dataId
        };
        const closestul = $(this).closest('ul');

        $.ajax({
            type:'Delete',
            url: '/api/semester',
            data: semesterId,
            success: function(){
                closestul.remove();
            },
            error: function () {
                alert('error saving error');
            }
        })
    })
}

function deleteClass() {

    $('#get-class').on('click', '.remove', function (e) {

        let dataId = $(this).attr('data-id');
        const classId = {
            classId: dataId
        };
        const closestul = $(this).closest('ul');

        $.ajax({
            type: 'Delete',
            url: '/api/class',
            data: classId,
            success: function () {
                closestul.remove();
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
        let classId = $(this).attr('class-id');
        const assignmentId = {
            assignmentId: dataId
        };
        const closestul = $(this).closest('.assignment-grid');

        $.ajax({
            type: 'Delete',
            url: '/api/assignment',
            data: assignmentId,
            success: function () {
                closestul.remove();
                location.href = `/assignment/${classId}`
            },
            error: function () {
                alert('error saving error');
            }
        })
    })
}

