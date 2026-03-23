tinymce.init({
  selector: 'textarea.textarea-mce',
  license_key: 'gpl',

  menubar: 'file edit view insert format',

  plugins: 'image',

  toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | image',

  file_picker_types: 'image',

  // file_picker_callback: function (callback, value, meta) {
  //   if (meta.filetype === 'image') {
  //     const input = document.createElement('input');
  //     input.type = 'file';
  //     input.accept = 'image/*';

  //     input.onchange = function () {
  //       const file = this.files[0];
  //       const reader = new FileReader();

  //       reader.onload = function () {
  //         const id = 'blobid' + new Date().getTime();
  //         const blobCache = tinymce.activeEditor.editorUpload.blobCache;
  //         const base64 = reader.result.split(',')[1];
  //         const blobInfo = blobCache.create(id, file, base64);
  //         blobCache.add(blobInfo);

  //         callback(blobInfo.blobUri(), { title: file.name });
  //       };

  //       reader.readAsDataURL(file);
  //     };

  //     input.click();
  //   }
  // }
  
  images_upload_handler: async (blobInfo) => {
    const formData = new FormData();
    formData.append('file', blobInfo.blob());
    // the upload preset is configured in Cloudinary settings
    // it also defines the folder where the images will be stored in Cloudinary
    formData.append('upload_preset', 'tinymce_upload');

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dxwondugr/image/upload',
      {
        method: "POST",
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();
    return data.secure_url;
  }

});