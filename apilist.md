#dev tinder api
authRouter
-post /signup
-post /login
-post /logout

profileRouter
-get /profile/view
-patch /profile/edit
-patch /profile/password

conectionRequestRouter
-post /request/send/intrested/:userId
-post /request/send/ignore/:userId
-post /request/send/accepted/:userId
-post /request/send/rejected/:userId
-get /user/connection

userRouter
-get /user/requests
-get /user/feed. = Gets you the profile of other users platform

status: ignore,intrested,accept,rejected


deployment of backend server

update DB password
assow ec2 instance on mongo server
npm install pm2 -g
pm2 start npm -- start
pm2 logs
pm2 flush <name>,pm2 stop <name>, pm2 delete <name>


assign port to /api via nginx

 sudo nano /etc/nginx/sites-available/default


server_name <your ip/domain>;  

 location /api/ {
        proxy_pass http://localhost:3000/;   # note the trailing slash!
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }




 restart nginx 

 sudo systemctl restart nginx

