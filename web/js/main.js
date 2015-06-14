var blog = new WordPress({
    "blogUrl":"testbonne.wordpress.com",
    "renderSelector":"#blog",
    "clientId":"41209",
    "createUrl":"http://wordpress-api-test.herokuapp.com/create.php"
});
$(document).ready(function(){
    blog.listPosts();
    $("#create").click(function(){
        blog.createPost();
    });
});