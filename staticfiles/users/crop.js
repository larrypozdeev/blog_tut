window.addEventListener('DOMContentLoaded', function () {
  const avatar = document.getElementById('avatar');
  const image = document.getElementById('image');
  const input = document.getElementById('id_image');
  const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value
  const imageForm = document.getElementById('profile_form')
  var $progress = $('.progress');
  var $progressBar = $('.progress-bar');

  var $modal = $('#modal');
  var cropper;

  $('[data-toggle="tooltip"]').tooltip();

  input.addEventListener('change', function (e) {
    var files = e.target.files;
    var done = function (url) {
      input.value = '';
      image.src = url;
      $modal.modal('show');
    };
    var reader;
    var file;
    var url;

    if (files && files.length > 0) {
      file = files[0];

      if (URL) {
        done(URL.createObjectURL(file));
      } else if (FileReader) {
        reader = new FileReader();
        reader.onload = function (e) {
          done(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  });

  $modal.on('shown.bs.modal', function () {
    cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 3,
    });
  }).on('hidden.bs.modal', function () {
    cropper.destroy();
    cropper = null;
  });

  document.getElementById('crop').addEventListener('click', function () {
    var initialAvatarURL;
    var canvas;

    $modal.modal('hide');

    if (cropper) {
      canvas = cropper.getCroppedCanvas({
        width: 300,
        height: 300,
      });
      initialAvatarURL = avatar.src;
      avatar.src = canvas.toDataURL();
      $progress.show();

      canvas.toBlob(function (blob) {

        var formData = new FormData(imageForm);
        formData.append('csrfmiddlewaretoken', csrf)
        formData.append('image', blob, 'avatar.jpg');
        $.ajax({
          method: 'POST',
          data: formData,
          url: imageForm.action,
          data: formData,
          processData: false,
          contentType: false,

          xhr: function () {
            var xhr = new XMLHttpRequest();

            xhr.upload.onprogress = function (e) {
              var percent = '0';
              var percentage = '0%';

              if (e.lengthComputable) {
                percent = Math.round((e.loaded / e.total) * 100);
                percentage = percent + '%';
                $progressBar.width(percentage).attr('aria-valuenow', percent).text(percentage);
              }
            };

            return xhr;
          },


          complete: function () {
            $progress.hide();
          },
        });
      });
    }
  });
});
