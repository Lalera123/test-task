## Getting started

To run the app clone project and then use:
```
$ npm install
```
```
$ npm start
```
```
$ npm run devstart (for development use)
```
### Demo user

```
  username: "serious_business",
  password: "suchPassw0rdSecure"
```
## API description

- /v1/authenticate [POST]
```
  reguest params {
    username: string,
    password: string
  }
```
```
  response {
    accessToken: string,
    refreshToken: string,
    expiresIn: string
  }
```

- /v1/authenticate/refresh_token [GET] - update access token using refresh token

```
  response {
    accessToken: string,
    refreshToken: string,
    expiresIn: string
  }
```

- /v1/payments [POST] - create new payment
```
  reguest params {
    payeeId: string,
    payerId: string,
    paymentSystem: string,
    paymentMethod: string,
    amount: real,
    currency: string,
    comment: string
  }
```
```
  response {
    id: string,
    payeeId: string,
    payerId: string,
    paymentSystem: string,
    paymentMethod: string,
    amount: real,
    currency: string,
    status: string,
    comment: string,
    created: string,
    updated: string
  }
```

- /v1/payments [GET] - get the list of payments
```
  response {
    data: array,
    count: integer
  }
```

- /v1/payments/:id [GET] - get payment's info by id
```
  response {
    id: string,
    payeeId: string,
    payerId: string,
    paymentSystem: string,
    paymentMethod: string,
    amount: real,
    currency: string,
    status: string,
    comment: string,
    created: string,
    updated: string
  }
```
