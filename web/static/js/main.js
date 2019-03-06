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
                var a = document.createElement("a");
                var blob = b64toBlob(data.message, 'image/png');
                var blobUrl = URL.createObjectURL(blob);
                a.href = blobUrl;
                a.download = 'file.png';
                a.click();
                window.URL.revokeObjectURL(blobUrl);

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

    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }
};

