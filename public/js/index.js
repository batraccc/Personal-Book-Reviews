function editHandler(id) {
    document.getElementById("text" + id).hidden = true;
    document.getElementById("edit" + id).hidden = true;

    document.getElementById("input" + id).hidden = false;
    document.getElementById("done" + id).hidden = false;
}