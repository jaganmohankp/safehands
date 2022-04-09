# Bunanas Server

The Bunanas Application was developed to serve as a front-facing interface meant for Food Bank Singapore staff, volunteers and beneficiaries. It handles the end-to-end inventory management process of Food Bank.
This is the back-end server that supports the front-end application.

## Pre-requisites for running the environments

At the time of this project implementation, Java SDK version 1.8 was used. The rest of the library dependencies can be updated and managed using Maven.

## How to build & host with a DB hosted on the cloud

1. Replace your AWSCredentials in AmazonManager under foodbank.util.
2. Replace the REPORT_BUCKET variable in AmazonManager under foodbank.util with your own S3 Bucket.
3. Replace the senderEmailID, senderPassword, emailSMTPserver and emailServerPort variable in AutomatedEmailer under foodbank.util with your own emailer configuration.
4. Replace the HOST_ADDRESS with your frontend address in LoginServiceImpl under foodbank.login.server.impl
5. Replace the settings within the application.properties file with your own Amazon RDS settings. We used the free tier server and opened all ports.
6. Rebuild your entire application by using your IDE, right-click maven install
7. Use some FTP to connect to your EC2 instance and place the jar file within
8. Use putty to connect to your EC2 instance, and run: nohup java -jar xxxxxxxxx.jar
9. To view logs, use tail nohup.out -f

## Project Directory Explanations

The project was built with the respective modules in mind. You will find that the packages are named according to what they are in-charge of.