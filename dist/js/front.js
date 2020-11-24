// $(document).ready(function(){
//     $('#email').val('teacher@cts.com');
//     $('#password').val('.................');
// });





//Dispalys extra form Elements according to the role

$(document).ready(function(){
    $('#role-selection').on('change', function() {
        if ( this.value == '1')   //for student
        {
            $("#general-form,#role-student,#sign-up-footer").show('slow');
            $(".panel-heading-info").html("Registering as Student").fadeIn(500);
        }
        else
        {
            $("#role-student").hide('slow');
        }

        if(this.value=='2')    //for teacher
        {
            $("#role-teacher,#general-form,#sign-up-footer").show('slow');
            $(".panel-heading-info").html("Registering as Teacher");
        }
        else
        {
            $("#role-teacher").hide('slow');
        }


        if(this.value=='3')    //for parents
        {
            $("#role-parent,#general-form,#sign-up-footer").show('slow');
            $(".panel-heading-info").html("Registering as Parent");
        }
        else
        {
            $("#role-parent").hide('slow');
        }


        if(this.value!='1,2,3')
        {
            $("#general-form,#sign-up-footer").show('slow');

        }

        else
        {  $("#general-form,#sign-up-footer").hide('slow');}



    });

    //add new child
    $(".remove").click(function(e) {
        $(this).closest(".duplicate-child").remove().fadeOut(300);
        e.preventDefault();
    });

    $("#add-new").click(function() {
        $(".duplicate-child:last").clone(true).insertBefore(this);
        return false;
    });
});

