Thank you for looking at my website project. Here are some setup instructions and acknowledgements:


To setup the development environment of the website:
    -Navigate on your local machine to the folder where you want the website project files to exist.
    -Clone the repository to your local machine. One way to do this is by running this in the terminal: git clone https://github.com/sarahcode2112/express-exercises-on-codecookies.git
    -Run 'npm install' in the terminal, to install project dependencies. 
        -This should work automatically, but if problems come up: viewing the dependencies 'package.json' may help for reference about what dependencies are needed.

To start the site locally: 
    run 'npm start' in the terminal. To view the website, go to http://localhost:3000/ in a web browser.

To deploy the site: 
    run 'gcloud app deploy' in the terminal. To view the website, go to https://id2112.ey.r.appspot.com in a web browser.

To login on the website:
    A username of 'name1' and a password of 'pass1' will work to login on the website as an 'admin', on both the dev and deployed version of the website. Logging in is necessary in order to see multiple parts of the site, which are only visible to logged-in 'admin' users. (All users in the database can view these website parts after logging in; the 'admin' label is only a stylistic preference on the frontend which has no real meaning in the backend.)

Notes on database and file storage: 
    The website uses MongoDB to manage its database, and Google Cloud Storage to store audio file uploads. Right now, I access and fund both of those through my Code University email account. For collaboration, I can share access to both of those workspaces with others by request. This would be important so that others can view the online console in Google Cloud, and to be able to generally troubleshoot and work in both platforms.

Note on deployment:

    The site is deployed through Google Cloud, which also is tied to my Code University email account. Same as above, I would share access to this workspace with others for collaboration purposes in the future.




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
