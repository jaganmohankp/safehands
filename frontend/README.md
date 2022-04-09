# Bunanas Web Application

The Foodbank Application was developed to serve as a front-facing interface meant for Helping Hands Singapore staff, volunteers and beneficiaries. It handles the end-to-end inventory management process of Helping Hands.

## Pre-requisites for running the environments

At the time of this project implementation, node version 8.0.0 and npm version 5.5.1 were used. It may be compatible with older versions, and if you wish to install older versions please do check for compatibility against angular compiler version 4.4.6.

## Local Environments

Before running any commands, ensure that your libraries are installed by executing on command line `npm install`. Once done, you have two options depending on what kind of environment you wish to enter: completely local (all data drawn from local JSON files - I have made mock JSON files for display purposes), or with connection to the servers. You will mainly use step (1) and step (3), for reasons explained later.

1. Execute on command line `ng serve` for a local deployment. All data will be drawn from local JSON files located under "assets/mock" folder.

2. Execute on command line `ng serve --prod` for a local deployment but with connection to AWS servers. According to angular developers, this function is still unstable and should not be used for be used for production. It is also a hassle to switch between local testing and server testing as you need to close the compiler and re-run the other environment, which takes some time. For another way to establish such a connection, please follow step 3.

3. Execute on command line `ng serve` for a local deployment. Open the "environments/environment.ts" file and change the "production" variable to "true". This enables connection to AWS servers. Do remember to change back to "false" once integration testing with the backend is done.

## Building the project and pushing to AWS

There should be 2 servers ( "development / test" and "production" ). Go to the "config/services.ts" file, and change the PRODUCTION constant to "true / false" depending on your deployment requirements. Do change the host IP addresses if you are pushing to a different server.

Once you are done setting up the configurations, simply execute on command line `npm build --aot -prod`. Wait for all the files to compile, then copy the files in the "dist" folder into the S3 bucket. Make sure to delete the files in the S3 bucket first.

Regarding setting up of the S3 bucket to deploy the application on the AWS server, I will not go into detail as there are several good tutorials online that already explains how to do so. It is a simple process, and the guide I used was "https://medium.com/codefactory/angular2-s3-love-deploy-to-cloud-in-6-steps-3f312647a659".

## Project Directory Explanation

Most of the page view development should take place under app/views. For more general components, you can place them in app/components. If you are familiar with angular, the directives, guards, pipes folders should be self-explanatory. The utils folder should contain reusable functions you which to store.

In app/services, these services act as a wrapper which allows you to connect to the backend APIs, where the URLs are located in "config/services.ts". For further development, you should add URLs for both local and servers. For local, make a JSON file of the response you expect to get from the backend, and store it under "assets/mock", and use that directory.

Css styles are located under "assets/styles" and images are located in "assets/images".

In the "config" folder, as mentioned before, there exists "config/services.ts", and it contains all the URLs necessary for establishing connection to the servers and local JSON files. There is also a "config/globals.ts" file which exports a "Globals" variable, which I have used for standardising the constants used in this project. The "routes.ts" file simply contains the routes needed for the application.
