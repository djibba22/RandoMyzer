/***************  GLOBALS GO HERE ******************/
//html targeting
const group = document.getElementById("create-group");
const groupsArea = document.getElementById("groups-area");
const alert = document.createElement("div")
      alert.classList.add("alert","alert-danger","alert-dismissible","fade","show");
let classID = 0 ; //unique identifier for the class
let classCount = 0;

/***************  FUNCTIONS GO HERE ******************/
// initialize page with saved info
const getStoredStudents = () => {
    for (let index = 0; index < localStorage.length; index++) {
        //check for an item in local storage
        if(localStorage.getItem(localStorage.key(index)) != null){
            //increment our class count variable
            const storedClass = JSON.parse(localStorage.getItem(localStorage.key(index)));
            //create the cards for the classes
            createGroupCard(storedClass.name);
            //just added to show students from local storage
            showStudents(storedClass.name,storedClass.students);
        }  
    }
}

//===== This creates a new class object to be added to the classes =====\\
const createGroup = (name) => {
    //create a new class object
    const newClass = {};
    //name the class
    newClass.name = name.toUpperCase();
    //give it a students array
    newClass.students = [];
    //save class to localStorage
    localStorage.setItem(name,JSON.stringify(newClass));
   //create a card on the page for the classroom
    createGroupCard(name); 
}



//===== This creates the Card on the Page for the Class =====\\
const  createGroupCard = (name) => {
    localStorage.getItem(name);
    const groupCardDiv = document.createElement("div")
    groupCardDiv.classList.add("col");
    //create a boostrap card
    const card = document.createElement("div");
    card.classList.add("card");
    //put the name of the group on the card
    const cardTitle = document.createElement("div");
    cardTitle.classList.add("card-header");
    cardTitle.innerText = name.toUpperCase();
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    //put a button on the card to
    const cardButton = document.createElement("button");
    cardButton.classList.add("btn", "btn-lg", "btn-success", "detail");
    cardButton.setAttribute("data",name);
    cardButton.setAttribute("id","detail");
    cardButton.setAttribute("data-toggle","modal");
    cardButton.setAttribute("data-target","#myModal");
    cardButton.innerText = "View Classroom";
    cardBody.append(cardButton);
    //put the button on the card
    card.append(cardTitle,cardBody);
    groupCardDiv.append(card);
    //append the new card to the page
    groupsArea.append(groupCardDiv);
       
}



//===== This creates a new student to be added to the class =====\\
const addStudent = (groupName,student) => {
    //add student to the object in the array
    let currentClass =  JSON.parse(localStorage.getItem(groupName));
    //add the student 
    currentClass.students.push(student);
    //Save the updated class
    localStorage.setItem(groupName,JSON.stringify(currentClass));
    //append them to the div
     showStudents(currentClass.name,currentClass.students);
    //testing
    console.log(`Showing students for Class: ${currentClass.name}`);
}

//===== This deletes a specific student =====\\
const deleteStudent = (groupName,student) => {
    let currentClass = JSON.parse(localStorage.getItem(groupName));
    let studentIndex = currentClass.students.indexOf(student);
    currentClass.students.pop(studentIndex);
    localStorage.setItem(groupName, JSON.stringify(currentClass));
    showStudents(currentClass.name,currentClass.students);
}

// this will show the students in the group
const showStudents = (className,students) => {
    const studentList = document.querySelector("#studentList");
    studentList.innerHTML = "";
    if( students.length <= 0){
       studentList.innerHTML = "This class is Empty."
    }else{
    let ul = document.createElement("ul");
    ul.classList.add("list-group");
    //build the list on the modal
    for (let index = 0; index < students.length; index++) {
        // Delete Button and Delete Icon
        let deleteBtnIcon = document.createElement('i');
        deleteBtnIcon.className = "fas fa-trash-alt";
        deleteBtnIcon.id = "deleteBtnIcon";
        let deleteBtn = document.createElement("btn");
        deleteBtn.id = "deleteStudent";
        deleteBtn.className = "btn btn-primary-outline";
        deleteBtn.append(deleteBtnIcon);

        let li = document.createElement("li");
        li.classList.add("list-group-item");
        //add the name to the list
        li.textContent = students[index];
        // add delete icon to each entry
        li.append(deleteBtn);
        //attach the li             
        ul.append(li);     
    }
     //attach the whole list of students
     studentList.append(ul);
    }
}




/***************  CLICKS GO HERE ******************/
//click handler for the create group button
document.querySelector("#create").addEventListener("click", function(event) {
    //don't submit
    event.preventDefault();
     //get the form value
     const groupName = group.value.toUpperCase();
    if(groupName.length < 1){
        alert.textContent = "You have to Name your classroom";
        document.querySelector(".header").append(alert);
        let alarm = new Audio('./sounds/buzzer.mp3');
        alarm.play();
        setTimeout(() => {
            document.querySelector(".alert").remove();
        }, 3000);
    }else{
     //play lodaing sound
     new Audio('./sounds/point_awarded2.mp3').play();
     //Function to create a card on the page for the new group
     createGroup(groupName);
    }
    //clear the input
    group.value = "";
});

//Click to show the class the Group/Class modal
document.addEventListener('click',function(e){
    //check if its the details button
    if(e.target && e.target.id == 'detail'){
        new Audio('./sounds/point_awarded.mp3').play();
        const studentList = document.querySelector("#studentList");
        studentList.innerHTML = "";
        //don't refresh the page
        event.preventDefault();
        //get the group number
        const data = e.target.getAttribute('data');
        //set the title of the card
        let title = document.querySelector(".modal-title");
        title.innerText = data.toUpperCase();
        //get the class from the DB
        let currentClass =  JSON.parse(localStorage.getItem(title.innerText));
        showStudents(currentClass.name,currentClass.students);
     }
 });

//========= CLICK FOR ADDING STUDENTS TO A CLASS ==================///
 document.addEventListener('click',function(e){
    //check if its the details button
    if(e.target && e.target.id == 'addStudent'){
        new Audio('./sounds/short_fast.mp3').play();
        //empty the card
        studentList.innerHTML = "";
        //don't refresh the page
        event.preventDefault();
        //Get the group name
        let groupName = document.querySelector(".modal-title").innerText;
        //get the value from the form//
        let newStudentInput = document.querySelector("#studentInput");
        let newStudent =  newStudentInput.value;
        if(newStudent.length > 0){
             //add student to the DB
            addStudent(groupName,newStudent);
        }else{
            alert.textContent = "You have to add a students name";
            let alarm = new Audio('./sounds/warning_harsh.mp3');
            alarm.play();
            setTimeout(() => {
               alarm.pause();
            }, 3000);
            console.log(alert)
            studentList.append(alert);  
        }
        //clear the input
        newStudentInput.value = "";
     }
 });

 //========= CLICK FOR DELETING A STUDENT FROM A CLASS ==================///
 document.addEventListener('click',function(e){
    //check if its the details button
    if(e.target && e.target.id == 'deleteBtnIcon'){
        //new Audio('./sounds/short_fast.mp3').play();
        console.log("Delete Student clicked");
        let studentName = e.target.parentElement.parentElement.textContent;
        let groupName = document.querySelector(".modal-title").innerText;
        deleteStudent(groupName, studentName);

     }
 });

//========= SAVE A CLASS TO LOCAL STORAGE ==================///
document.addEventListener('click',function(e){
    //check if its the details button
    if(e.target && e.target.id == 'saveClass'){
        //don't refresh the page
        event.preventDefault();
        //get the class room name
        let groupName = document.querySelector(".modal-title").innerText;
         //save the new version of the class with all the students
        // localStorage.setItem(groupName , );
       ;
     }
 });

 //Get random student form array
 document.querySelector("#randomStudent").addEventListener("click", function(event) {
    //don't submit
    event.preventDefault();
     //play lodaing sound
    //  new Audio('./sounds/metalDesigned.mp3').play();
     new Audio('./sounds/jackpot.mp3').play();
     //get the current class
     //Get the group name
     let groupName = document.querySelector(".modal-title").innerText;
     //get the class from the DB
     let currentClass =  JSON.parse(localStorage.getItem(groupName));
     //go through the array and get a random selection
     let randomStudent = currentClass.students[Math.floor(Math.random() * currentClass.students.length)];
     //display a loader
     document.querySelector("#studentList").innerHTML = '<img src="./images/loder.gif">';
     //set a timer for 3 seconds
     setTimeout(() => {
        new Audio('./sounds/winner.mp3').play();
        //update the page
        document.querySelector("#studentList").innerHTML = '<h1>'+ randomStudent + '</h1>'; 
     }, 4000);
});


 getStoredStudents();