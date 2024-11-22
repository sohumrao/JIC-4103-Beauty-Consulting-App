# Setting up the backend

## Install dependencies

```bash
npm install
```

## Set up environment variables

Create a `config.env` file in `server` directory

```bash
MONGO_URI=<MONGODB_URI>
EXPO_PUBLIC_GEOCODING_API_KEY=<Mapquest_API_KEY>
EMAIL_ADDRESS=support@axel.com
```

# Running the server

```bash
npm start
```

# Testing locally with mailpit SMTP server

1. Install mailpit (on macOS with homebrew)

```bash
brew install mailpit
```

2. Start the server

```bash
brew services start mailpit
```

3. Visit http://localhost:8025 to see the mailpit web interface
