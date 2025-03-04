import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesCient";

// Function to create SendEmailCommand dynamically
const createSendEmailCommand = (
  toAddress: string,
  fromAddress: string,
  subject: string,
  bodyHtml: string,
  bodyText: string
) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: bodyHtml,
        },
        Text: {
          Charset: "UTF-8",
          Data: bodyText,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [], 
  });
};

// Reusable function to send emails
export const sendEmail = async (
  toAddress: string,
  subject: string,
  bodyHtml: string,
  bodyText: string,
  fromAddress: string = "codewithvamshi07@gmail.com"
) => {
  const sendEmailCommand = createSendEmailCommand(
    toAddress,
    fromAddress,
    subject,
    bodyHtml,
    bodyText
  );

  try {
    const response = await sesClient.send(sendEmailCommand);
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending email:", error.message);

      // Check for specific SES errors
      if (error.name === "MessageRejected") {
        console.error("MessageRejected error:", error);
        return { error: "MessageRejected", details: error.message };
      }
    }
    throw error;
  }
};