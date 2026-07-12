const addBtn = document.querySelector(".add-btn");

document.querySelector(".add-btn").addEventListener("click", () => {
    window.location.href = "../addvehicle/addvehicle.html";
});

const editButtons = document.querySelectorAll(".edit");

editButtons.forEach(button => {
    button.addEventListener("click", () => {
        alert("Edit Vehicle");
    });
});

const deleteButtons = document.querySelectorAll(".delete");

deleteButtons.forEach(button => {
    button.addEventListener("click", () => {
        if(confirm("Delete this vehicle?")){
            alert("Vehicle Deleted");
        }
    });
});