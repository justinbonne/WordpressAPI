var blog = new WordPress({
    "blogUrl":"testbonne.wordpress.com",
    "clientId":"41209",
    "createUrl":"http://wordpress-api-test.herokuapp.com"
});
$(document).ready(function(){
    $("#create-post-form").submit(function(){
        blog.createPost();
        return false;
    });
});