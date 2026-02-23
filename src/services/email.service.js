const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.MAIL_PORT) || 587,
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    this.from = process.env.MAIL_FROM || process.env.MAIL_USER;
  }

  /**
   * Envía email de confirmación de solicitud al reclutador
   */
  async sendRequestConfirmation(email, firstName) {
    const mailOptions = {
      from: `"Bolsa de Empleo ULEAM" <${this.from}>`,
      to: email,
      subject: 'Solicitud de registro recibida',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a2f5a, #2b4c98); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Bolsa de Empleo ULEAM</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1a2f5a; margin-top: 0;">¡Hola, ${firstName}!</h2>
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">
              Hemos recibido tu solicitud de registro como reclutador en la plataforma de 
              Bolsa de Empleo de la ULEAM.
            </p>
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">
              Nuestro equipo revisará tu información y te notificaremos por correo electrónico 
              cuando tu solicitud sea procesada.
            </p>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #64748b; margin: 0; font-size: 14px;">
                <strong>Estado:</strong> Pendiente de revisión<br/>
                <strong>Tiempo estimado:</strong> 1-3 días hábiles
              </p>
            </div>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 30px;">
              Este es un correo automático, por favor no respondas a este mensaje.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email de confirmación enviado a ${email}`);
    } catch (error) {
      console.error('Error enviando email de confirmación:', error.message);
      // No lanzamos error para no bloquear el flujo
    }
  }

  /**
   * Envía email con link de activación cuando el admin aprueba la solicitud
   */
  async sendActivationLink(email, firstName, activationToken) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const activationUrl = `${frontendUrl}/auth/activar-cuenta?token=${activationToken}`;

    const mailOptions = {
      from: `"Bolsa de Empleo ULEAM" <${this.from}>`,
      to: email,
      subject: '¡Tu cuenta ha sido aprobada! Activa tu acceso',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a2f5a, #2b4c98); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Bolsa de Empleo ULEAM</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1a2f5a; margin-top: 0;">¡Felicidades, ${firstName}!</h2>
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">
              Tu solicitud como reclutador ha sido <strong style="color: #22c55e;">aprobada</strong>. 
              Ya solo falta un paso para acceder a la plataforma.
            </p>
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">
              Haz clic en el siguiente botón para establecer tu contraseña y activar tu cuenta:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${activationUrl}" 
                 style="background: #4a82e4; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
                Activar mi cuenta
              </a>
            </div>
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                <strong>⚠️ Importante:</strong> Este enlace expirará en <strong>7 días</strong>. 
                Si no activas tu cuenta antes de esa fecha, deberás solicitar un nuevo enlace.
              </p>
            </div>
            <p style="color: #94a3b8; font-size: 13px;">
              Si el botón no funciona, copia y pega este enlace en tu navegador:<br/>
              <a href="${activationUrl}" style="color: #4a82e4; word-break: break-all;">${activationUrl}</a>
            </p>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 30px;">
              Este es un correo automático, por favor no respondas a este mensaje.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email de activación enviado a ${email}`);
    } catch (error) {
      console.error('Error enviando email de activación:', error.message);
      throw new Error('No se pudo enviar el email de activación');
    }
  }

  /**
   * Envía email de rechazo al reclutador
   */
  async sendRejectionNotification(email, firstName, reason) {
    const mailOptions = {
      from: `"Bolsa de Empleo ULEAM" <${this.from}>`,
      to: email,
      subject: 'Actualización sobre tu solicitud de registro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a2f5a, #2b4c98); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Bolsa de Empleo ULEAM</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1a2f5a; margin-top: 0;">Hola, ${firstName}</h2>
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">
              Lamentamos informarte que tu solicitud de registro como reclutador 
              no ha sido aprobada en esta ocasión.
            </p>
            ${reason ? `
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <p style="color: #991b1b; margin: 0; font-size: 14px;">
                <strong>Motivo:</strong> ${reason}
              </p>
            </div>
            ` : ''}
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">
              Si crees que esto es un error o deseas más información, puedes enviar 
              una nueva solicitud o contactarnos directamente.
            </p>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 30px;">
              Este es un correo automático, por favor no respondas a este mensaje.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email de rechazo enviado a ${email}`);
    } catch (error) {
      console.error('Error enviando email de rechazo:', error.message);
    }
  }
}

module.exports = new EmailService();
