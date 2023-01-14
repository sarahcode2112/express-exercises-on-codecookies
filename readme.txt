Thank you for looking at my website project. 

Website description:        
    This is a work-in-progress website I built for learning purposes as part of a module in the TechStart program at Code University in Berlin. It includes a fake CD store, with a dynamically-generated frontend, based on a database including entries for CDs and news articles. It allows the user to perform CRUD operations with the CDs and news articles. The user can also create new user accounts, with which to login and logout (all these user accounts are called 'admin' users in the UI). While logged-in, more content and options are visible in the UI, and more POST routes can be meaningfully used. On the home page, there are some basic tools for slowing down audio recordings uploaded by the user. (In the future, I would especially like to improve that section, followed by everything else!)

Folder structure description:
    This project follows a model-view-controller (MVC) folder structure, mostly. Pages' ejs code are in 'views'. Database-related code is in 'models'. Some more complex routes' code is in app.mjs, and in a folder 'routes' - not in the 'controllers' folder. In the future, I would move all routes' code to the 'controllers' folder.


================================Setup instructions:

To setup the development environment of the website:
    -Navigate on your local machine to the folder where you want the website project files to exist.
    -Clone the repository to your local machine. One way to do this is by running this in the terminal: git clone https://github.com/sarahcode2112/express-exercises-on-codecookies.git
    -Run 'npm install' in the terminal, to install project dependencies. 
        -This should work automatically, but if problems come up: viewing the dependencies 'package.json' may help for reference about what dependencies are needed.

To start the site locally: 
    run 'npm start' in the terminal. To view the website, go to http://localhost:3000/ in a web browser.

To deploy the site: 
    run 'gcloud app deploy' in the terminal. To view the website, go to https://id2112.ey.r.appspot.com in a web browser.

To login in the website:
    A username of 'name1' and a password of 'pass1' will work to login on the website as an 'admin', on both the dev and deployed version of the website. Logging in is necessary in order to see multiple parts of the site, which are only visible to logged-in 'admin' users. Once logged in, you can create more user accounts through the UI. (All users acounts are 'admin', according to the UI; the 'admin' label is only a stylistic term on the frontend which has no real meaning in the backend.)
    The login system uses the 'passport' library. 
    I also got halfway through building a separate login system with json web tokens instead of passport. The code for the latter is still in the codebase, and it works with manually-sent requests (e.g. with Postman) but it is not supported in the UI yet.
    There is an 'add-user-data.js' file in the root of the project directory, which also works to create a new user.

Notes on database and file storage: 
    The website uses MongoDB to manage its database, and Google Cloud Storage to store audio file uploads. Right now, I access and fund both of those through my Code University email account. For collaboration, I can share access to both of those workspaces with others by request. This would be important so that others can view the online console in Google Cloud, and to be able to generally troubleshoot and work in both platforms.
    In a locally hosted development environment, it is also possible to 'upload' a file to the local destination of the '/uploads' folder. 
    The way the Google Cloud upload is built, right now: there would be a problem if more than one person were using that feature at the same time. The code only allows the one most recent file upload to sit in the Google Cloud bucket and then be streamed (it deletes all files but the most recent one uploaded file). I would improve that in future versions of this project (perhaps by linking file uploads to unique user IDs or session IDs), but this works as a prototype for now.

Note on deployment:

    The site is deployed through Google Cloud, which also is tied to my Code University email account. Same as above, I would share access to this workspace with others for collaboration purposes in the future.




================================Acknowledgements: 

Thank you to these tutorials, which helped me make this project. (I also credit more tutorials, as comments, inside specific project files):

    Main tutorial that helped to build the site:

        https://codecookies.xyz/express-tutorial/v1

    Tutorials that helped me for Express file upload:
Thank you to these tutorials, which helped me make this project. (I also credit more tutorials, as comments, inside specific project files):

    Main tutorial that helped to build the site:

        https://codecookies.xyz/express-tutorial/v1

    Tutorials that helped me for Express file upload:

        https://attacomsian.com/blog/uploading-files-nodejs-express

        https://www.npmjs.com/package/express-fileupload

    Tutorial helped me for google cloud storage setup:

        https://www.bezkoder.com/google-cloud-storage-free/#Create_Google_Cloud_Storage_Bucket
