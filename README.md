# Only Node 💯

To run the project make sure you have MySQL installed and copy the .env.example file to .env.

You'll also need to add a secret key to the .env file:
JWT_SECRET='your_secret_key_here'

After adding all environment variables, run the following commands:

```bash
npm i # install all packages
npm run dev
```

At this point, your API should be running at localhost:8000

To test the api, you can send a request to the `/sign-up` endpoint, with a body like this:
```json
{
    "email": "thelastofus@gmail.com",
    "password": "Lara1#"
}
```
You should get a response with a jwt token, now you just need to set the Authorization header:
`Authorization: Bearer ${token}`

## :memo: License
This project is licensed under the MIT license. See the [LICENSE](./LICENSE.md) file for more details.
