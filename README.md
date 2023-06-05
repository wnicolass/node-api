# API Without Packages 💯

Okay, that's not 100% true... I used Sequelize to connect to the database.

This project was made with some Node experimental features, so to run the project make sure you have Node at least on v19.* and MySQL installed.

Copy the .env.example file to .env, note that you'll also need to add a jwt secret key to the .env file:
`JWT_SECRET='your_secret_key_here'`

To get a jwt secret with ease, generate a random 32-byte hexadecimal string with the openssl rand command:
```bash
openssl rand -hex 32
```

After adding all environment variables, run the following commands:

```bash
npm i # install all packages
npm run dev
```

At this point, your API should be running at localhost:8000

To test the api, you can send a post request to the `/sign-up` endpoint, with a body like this:
```json
{
    "username": "ellie",
    "email": "thelastofus@joel.com",
    "password": "Abby1#"
}
```

With the account created, send a post request to the `/sign-in` endpoint:
```json
{
    "email": "thelastofus@gmail.com",
    "password": "Abby1#"
}
```

You should get a response with a jwt token, like this:
```json
{
    "access_token": "some-gibberish"
}
```

Now send a GET request to the `/` endpoint with the header: `Authorization: Bearer some-gibberish`, where "some-gibberish" is the JWT token you've got from the `sign-in` endpoint. You should get a response like this:
```json
{
    "username": "ellie"
}
```

This was just to check that the simple login flow is working 🙂
## :memo: License
This project is licensed under the MIT license. See the [LICENSE](./LICENSE.md) file for more details.
