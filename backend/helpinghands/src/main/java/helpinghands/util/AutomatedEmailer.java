package helpinghands.util;

import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

/**
 * 
 *
 * @version 1.0
 * 
 */
public class AutomatedEmailer {

	/**
	 * Default email address of the organization that will always be used
	 */
	final String senderEmailID = "xxxxxxxxxxx";
	
	/**
	 * Password for the email address required for authentication
	 */
	final String senderPassword = "xxxxxxxxxx";
	
	/**
	 * Specification of the Email SMTP server
	 */
	final String emailSMTPserver = "xxxxxxxxxx";
	
	/**
	 * The email server port 
	 */
	final String emailServerPort = "xxxxxxxx";
	
	/**
	 * Email address of the recipient that will be populated on email sending
	 */
	String receiverEmailID = null;
	
	/**
	 * The subject of the email that will be modified before sending
	 */
	String emailSubject = "Test Mail";
	
	/**
	 * The content body of the email that will be modified before sending
	 */
	String emailBody = "Test Body";
	
	/**
	 * Constructor that updates the required parameters of the email before sending
	 * @param receiverEmailID
	 * @param emailSubject
	 * @param emailBody
	 * @throws Exception
	 */
	public AutomatedEmailer(String receiverEmailID, String emailSubject, String emailBody) throws Exception {
		this.receiverEmailID = receiverEmailID;
		this.emailSubject = emailSubject;
		this.emailBody = emailBody;
		Properties props = new Properties();
		props.put("mail.smtp.user", senderEmailID);
		props.put("mail.smtp.host", emailSMTPserver);
		props.put("mail.smtp.port", emailServerPort);
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.socketFactory.port", emailServerPort);
		props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
		props.put("mail.smtp.socketFactory.fallback", "false");
		SecurityManager security = System.getSecurityManager();
		// Exceptions with respect to email sending will be propagated out of the constructor
		Authenticator auth  = new SMTPAuthenticator();
		Session session = Session.getDefaultInstance(props, auth);
		MimeMessage msg = new MimeMessage(session);
		msg.setText(emailBody);
		msg.setSubject(emailSubject);
		msg.setFrom(new InternetAddress(senderEmailID));
		msg.addRecipient(Message.RecipientType.TO, new InternetAddress(receiverEmailID));
		Transport.send(msg);
	}
	
	/**
	 * 
	 *
	 * @version 1.0
	 * Inner class to ensure sender's email is authenticated
	 */
	class SMTPAuthenticator extends javax.mail.Authenticator {
		public PasswordAuthentication getPasswordAuthentication() {
			return new PasswordAuthentication(senderEmailID, senderPassword);
		}
	}
	
}
