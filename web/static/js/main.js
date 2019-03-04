window.onload = function () {

    var frm = $('#encode');
    frm.submit(function (e) {

        e.preventDefault();
        var formData = new FormData(this);

        $.ajax({
            type: frm.attr('method'),
            url: frm.attr('action'),
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success: function (data) {
                $("#message").hide();
                $("#img").show();
                $("#img").attr('src', 'data:image/png;base64,' + data.message);
            },
            error: function (data) {
                alert(data.responseText);
            },
        });
    });

    var frm2 = $('#decode');
    frm2.submit(function (e) {

        e.preventDefault();
        var formData = new FormData(this);

        $.ajax({
            type: frm2.attr('method'),
            url: frm2.attr('action'),
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.secret_type === 'image') {
                    $("#message").hide();
                    $("#img").show();
                    $("#img").attr('src', 'data:image/png;base64,' + data.message);
                } else {
                    $("#message").show();
                    $("#img").hide();
                    $("#message").text(data.message);
                }
            },
            error: function (data) {
                alert(data.responseText);
            },
        });
    });
};

