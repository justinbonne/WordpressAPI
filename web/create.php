<?php 
$curl = curl_init( 'https://public-api.wordpress.com/oauth2/token' );
curl_setopt( $curl, CURLOPT_POST, true );
curl_setopt( $curl, CURLOPT_POSTFIELDS, array(
    'client_id' => '41209',
    'redirect_uri' => 'http://wordpress-api-test.herokuapp.com/create.php',
    'client_secret' => '23yKp368A3Dq7O2TrwcAJA5iEDTa4f1nrxGm1nT30XJvwSUF8MuuSDLdnM2lQmov',
    'code' => $_GET['code'], // The code from the previous request
    'grant_type' => 'authorization_code'
) );
curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1);
$auth = curl_exec( $curl );
$secret = json_decode($auth);
$access_key = $secret->access_token;
 ?>
<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>WordPress Blog</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/bootstrap.theme.min.css">
        <link rel="stylesheet" href="css/font-awesome.min.css">
        <script src="js/modernizr-2.8.3.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
            <div class="modal fade" id="loadingModal" tabindex="-1" role="loading" aria-labelledby="myModalLabel" aria-hidden="true">
            <div>
                <i class="fa fa-cog fa-spin"></i>
                <p>Loading...</p>
            </div>
        </div>
        <header role="banner">
            <h1>
                Submit Post 
            </h1>
        </header>
        <main role="main" class="container">
            <form id="create-post-form">
                <input type="hidden" id="token" value="<?php echo $access_key ?>">
                <div class="row">
                    <div class="col-sm-12 form-group">
                        <label class="control-label" for="title">Title</label>
                        <input type="text" class="form-control" id="title" >
                    </div>
                    <div class="col-sm-12 form-group">
                        <label class="control-label" for="description">Description</label>
                        <textarea id="content" class="form-control" rows="5">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </textarea>
                    </div>
                </div>
                 <div class="row">
                    <div class="col-sm-12 text-center form-group">
                        <input class="btn btn-default" type="submit"
                         value="Submit">
                     </div>
            </form>
        </main>

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/jquery-1.11.3.min.js"><\/script>')</script>
        <script src="js/bootstrap.min.js"></script>
        <script src="js/wordpress.js"></script>
        <script src="js/create.js"></script>
    </body>
</html>
