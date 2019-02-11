'use strict'

//req.user
const getSem = $('#get-semester')

function watchForm(){
    deleteSemester();
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
