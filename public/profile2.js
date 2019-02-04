function watchForm(){
    addClass();
    addSemester();
    addAssignment();
    saveSemester();
    editSemester();
    saveClass();
    editClass();
}

watchForm();

function addAssignment() {
    $('body').on('click', '.new-assignment', (e) => {
        $(e.target).siblings('.assignmentslist').append(`
      <li class="assignment-item">
                <form action="#" class="assignment-form">
                  <input type="text" placeholder="assignment">
                  <input type="text" placeholder="weight">
                  <input type="text" placeholder="grades">
                  <input type="submit" value="Save"/>
                </form>
              </li>
    `);
    });
}

function addClass() {
    $('body').on('click', '.new-class', (e) => {
        $(e.target).siblings('.classDetails').append(`
    <form class="class-form">
          <p>
            <input type="text" placeholder="Class Name">
            <input type="submit" value="Save"/>
          </p>
        </form>
          
          <h3>Assignments:</h3>
          <div class="assignments">
            <ul class="assignmentslist">
              <li class="assignment-item">
                <form action="#" class="assignment-form">
                  <input type="text" placeholder="assignment">
                  <input type="text" placeholder="weight">
                  <input type="text" placeholder="grades">
                  <input type="submit" value="Save"/>
                </form>
              </li>
            </ul>
            <button class="new-assignment">Add New Assignment</button>
          </div>
    `)
    });
}

function addSemester(){
    $('body').on('click', '.new-semester', (e) => {
        $(e.target).siblings('.grades').append(`
      <div class="semester">

      <form class="semester-form">
        <input type="text" placeholder="Semester"/>
        <input type="submit" value="Save"/>
      </form>

      <h2 class="semester-name"></h2>
      <div class="classDetails">

        <form class="class-form">
          <p>
            <input type="text" placeholder="Class Name">
            <input type="submit" value="Save"/>
          </p>
        </form>
          
          <h3>Assignments:</h3>
          <div class="assignments">
            <ul class="assignmentslist">
              <li class="assignment-item">
                <form action="#" class="assignment-form">
                  <input type="text" placeholder="assignment">
                  <input type="text" placeholder="weight">
                  <input type="text" placeholder="grades">
                  <input type="submit" value="Save"/>
                </form>
              </li>
            </ul>
            <button class="new-assignment">Add New Assignment</button>
          </div>
      </div>
      <button class="new-class">Add New Class</button>
    </div>
`)
    });
}

function saveSemester() {
    $('body').on('submit', '.semester-form', (e) => {
        e.preventDefault();
        let name = $(e.target).children('input[type="text"]').val();
        // save it to the db w/ an ajax call
        $(e.target).hide();
        $(e.target).siblings('.semester-name').html(name + " | <button class='edit-semester'>Edit</button>").show();
    });
}

function editSemester(){
    $('body').on('click', '.edit-semester', (e) => {
        let name = $(e.target).parent().html().split('|')[0];
        $(e.target).parent().hide();
        $(e.target).parent().siblings('.semester-form').show();
        $(e.target).parent().siblings('.semester-form').children('input[type="text"]').val(name);
    });
}

function saveClass(){
    $('body').on('submit', '.class-form', (e) => {
        e.preventDefault();
        let name = $(e.target).children('input[type="text"]').val();
        // save it to the db w/ an ajax call
        $(e.target).hide();
        $(e.target).siblings('.class-name2').html(name + " | <button class='edit-class'>Edit</button>").show();
    });
}

function editClass() {
    $('body').on('click', '.edit-class', (e) => {
        let name = $(e.target).parent().html().split('|')[0];
        $(e.target).parent().hide();
        $(e.target).parent().siblings('.class-form').show();
        $(e.target).parent().siblings('.class-form').children('input[type="text"]').val(name);
    });
}