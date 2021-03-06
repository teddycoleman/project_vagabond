// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery.turbolinks
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require turbolinks

$( document ).on("turbolinks:load",function() {
    //Remove all data-disable-with attributes on turbolinks load
    $.each($("[data-disable-with]"), function(index, el) {
        $(el).removeAttr("data-disable-with");
    });

  hideDisplaysExceptFirstOne();
  $('.back-arrow').on('click', scrollBackThroughDisplays);
  $('.forward-arrow').on('click', scrollForwardThroughDisplays);

  $('h1').on('click', function(){
  	$(location).attr('href', "/")
  });

  $('#new_user').on('submit', signUp);
  $('#login_form').on('submit', signIn);
  $('#new_post').on('submit', newPost);

  $('#user-edit-button').on('click', function() {
    $('#user-edit').toggle();
    $('#user-info').toggle();
    $('#user-edit-button').toggle();
  });

	$('#cancel-edit-button').on('click', function() {
    $('#user-edit').toggle();
    $('#user-info').toggle();
    $('#user-edit-button').toggle();
  });

	$('.post-edit-button').on('click', function() {
	  $(this).closest('.user-post').find('.edit-post-text-form').toggle();
	  $(this).closest('.user-post').find('.user-post-info').toggle();
	  $(this).closest('.user-post').find('.post-footer').toggle();
	});

	$('#login-link').on('click', function(event){
  	event.preventDefault();
  	$('#sign-up-modal').modal('toggle');
  	$('#login-modal').modal('toggle');
  });

  $('#sign-up-link').on('click', function(event){
  	event.preventDefault();
  	$('#login-modal').modal('toggle');
  	$('#sign-up-modal').modal('toggle');
  });
});


var cityIndex = 0

function hideDisplaysExceptFirstOne(){
  var cityArray = $('.city-display');
  if (cityArray.length > 1) {
    for (i = 0; i < cityArray.length; i++){
      if(i !== cityIndex){
        $(cityArray[i]).toggle();
      }
    }
  }
}

function scrollBackThroughDisplays(){
  var cityArray = $('.city-display');
  $(cityArray[cityIndex]).toggle();
  if(cityIndex > 0){
    cityIndex--;
  }
  else{
    cityIndex = cityArray.length - 1;
  }
  $(cityArray[cityIndex]).toggle();
}

function scrollForwardThroughDisplays(){
  var cityArray = $('.city-display');
  $(cityArray[cityIndex]).toggle();
  if(cityIndex < cityArray.length - 1){
    cityIndex++;
  }
  else {
    cityIndex = 0;
  }
  $(cityArray[cityIndex]).toggle();
}

function show_sign_up_modal(){
	$('#sign-up-modal').toggle();
	$('#sign-up-modal').toggle();
}

function signIn(event){
	event.preventDefault();

	var data = {
		email: $('#email').val(),
		password: $('#password').val()
	};

	$.ajax({
		url: "/sessions/verify_login",
		type: "POST",
		data: data,
		success: function(){
			$('#login_form')[0].submit();
		},
		error: function(){
			$(':submit').prop("disabled", false);
			$('.error').remove()
			$('#login-modal').find('.modal-body').prepend("<p class='error'>Incorrect username or password</p>");
			$('#login_form').find('#password').val('');
		}
	});
}

function signUp(event){
	event.preventDefault();
	var data = {
		user: {
			first_name: $('#user_first_name').val(),
			last_name: $('#user_last_name').val(),
			current_city: $('#user_current_city').val(),
			profile_image: $('#user_profile_image').val(),
			profile_image: $('#user_profile_image').val(),
			email: $('#user_email').val(),
			password: $('#user_password').val()
		}
	};
	$.ajax({
		url: "/users/validate_user",
		type: "POST",
		data: data,
		success: function(){
			$('#new_user')[0].submit();
		},
		error: function(){
			$(':submit').prop("disabled", false);
			$('.error').remove()
			$('#sign-up-modal').find('.modal-body').prepend("<p class='error'>please fix errors in the form and resubmit</p>")
		}
	});
}

function newPost(event){
	event.preventDefault();
	var data = {
		post: {
			title: $('#new-post-modal').find('#post_title').val(),
			post_text: $('#new-post-modal').find('#post_post_text').val(),
			city_id: $('#new-post-modal').find('#post_city_id').val()
		}
	};
	console.log(data)

    //Disable the button on submit
    $(':submit').prop("disabled", true);

	$.ajax({
		url: "/posts/new_post",
		type: "POST",
		data: data,
		success: function(json){
			$('#new_post')[0].submit();
		},
		error: function(){
			$('.error').remove();
            //Re-enable the submit button if validations fail
			$(':submit').prop("disabled", false);
			$('#new-post-modal').find('.modal-body').prepend("<p class='error'>please fix issues with post and resubmit</p>")
		}
	});
}
