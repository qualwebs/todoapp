<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Its contains all routes that not required login credentials.
|
*/

Route::group(array('prefix' => 'api/v1'), function()
{
    Route::resource('login', 'LoginController');
    Route::resource('todo', 'TodoController');
});