var blog = new WordPress({
    "blogUrl":"testbonne.wordpress.com",
    "clientId":"41209",
    "createUrl":"http://wordpress-api-test.herokuapp.com/create.php"
});
$(document).ready(function(){
    if(!$("#token").val()){
        window.location = "index.html";
    }
    $("#create-post-form").submit(function(){
        blog.createPost();
        return false;
    });
});