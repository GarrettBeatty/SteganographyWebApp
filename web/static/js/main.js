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
                $("#img").click(function () {
                    downloadFile(data.message, "file.png");
                })
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

function downloadFile(data, fileName) {
        var pngData = data;
        var blob = new Blob([ pngData ], {
            type : "image/png"
        });

        if (window.navigator.msSaveBlob) {
            // FOR IE BROWSER
            navigator.msSaveBlob(blob, fileName);
        } else {
            // FOR OTHER BROWSERS
            var link = document.createElement("a");
            var pngUrl = URL.createObjectURL(blob);
            link.href = pngUrl;
            link.style = "visibility:hidden";
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
}
