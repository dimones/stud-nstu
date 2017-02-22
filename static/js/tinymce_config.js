/**
 * Created by smax on 18.02.17.
 */

tinymce.init({
    selector: '.wysiwyg',
    language_url: '/static/js/langs/ru.js',
    menubar: false,
    elementpath: false,
    image_advtab: true,
    automatic_uploads: true,
    images_upload_url: 'postAcceptor.py',
    images_upload_base_path: '/',
    images_upload_credentials: false,
    plugins: [
      'advlist autolink link image imagetools lists print preview hr',
      'wordcount code fullscreen',
      'save table contextmenu template paste textcolor'
    ],
    toolbar: [
        'insertfile undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image attachfile hr | print preview fullpage | forecolor backcolor',
        'save code'
    ],
    paste_data_images: true,
    file_picker_types: 'file image',
    file_browser_callback: function(field_name, url, type, win) {
        //win.document.getElementById(field_name).value = 'my browser value';
        alert('file_browser_callback');
    },
    file_browser_callback_types: 'file image',
    file_picker_callback: function(callback, value, meta) {
        alert('file_picker_callback');
      if (meta.filetype == 'image') {
          alert('image');
        $('#upload').trigger('click')
            .on('change', function() {
          var file = this.files[0];
          var reader = new FileReader();
          reader.onload = function(e) {
            callback(e.target.result, { alt: '' });
          };
          reader.readAsDataURL(file);
        });
      }
      if (meta.filetype == 'file') {
          alert('file');
      }
    },

    setup: function (editor) {
        editor.addButton('attachfile', {
            icon: 'file',
            //image: 'http://p.yusukekamiyamane.com/icons/search/fugue/icons/calendar-blue.png',
            tooltip: "Attach File",
            onclick: function () {
                $('#upload').trigger('click')
                    .on('change', function() {
                  var file = this.files[0];
                  var reader = new FileReader();
                  reader.onload = function(e) {
                    callback(e.target.result, { alt: '' });
                  };
                  reader.readAsDataURL(file);
                });
            }
        })
    }
});