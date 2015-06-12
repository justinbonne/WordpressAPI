var blog = new WordPress({
    "blogUrl":"testbonne.wordpress.com",
    "renderSelector":"main"
});
$(document).ready(function(){
    blog.listPosts();
});