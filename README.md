# Mercedes-Benz Pixels Camp Challenge

## Project name

MOCKPIXEL071

## Team members

  - Cláudio Varandas \<cvarandas@gmail.com\>
  - Ricardo Machado \<ricardo.pedras@gmail.com\>

## Project Description

Here are the main goals of our project:

  1. Experiment the Mercedes-Benz API to gather information about a given car and control certain aspects of it.
  1. Provide a communication channel that would interface with the API to make it easily usable.
  1. Make the project easily extendable to any endpoints the API had.

Worths to mention that we did not make a full integration with the API, since the idea was to
try to connect to it and see its potential.

However, the way this project is built allows the developer to extend it easily by adding new files in the
`endpoints` folder.

## How to build and run the project.

### Assumptions

* This is a NodeJS project so the steps below will assume you have NodeJS >= 6 installed.
* This project uses Slack as the chat system, therefore it assumes you have valid Slack Bot Token to provide to the system.
* This project uses API.AI for the NLP capabilities. For that we require the developer to register on [API.AI](https://www.api.ai) and get a token - via the option _NodeJS_ in the _Integrations_ section - to pass it via ENV variable.

We also provide a basic configuration of the intents on API.AI to test the base commands, feel free to add more if you feel like.

### Supported ENV variables.

This project supports the follwing environment variables to configure its behaviour:

  - API_AI_TOKEN - Token provided by the API.AI service for integration with NodeJS
  - BASE_API_URL - Base URL for Mercedes API
  - CRT_FILE_PATH - Path to the `.crt` file
  - CRT_PASSPHRASE - Certificate's passphrase
  - PEM_FILE_PATH - Path to the `.pem` file
  - KEY_FILE_PATH - Path to the `.key` file
  - SLACK_BOT_CHANNEL - Channel name where the bot will join and listen to commands
  - SLACK_BOT_TOKEN - Token of the Slack bot

All environment variables are required.

### Usage

Steps to prepare to run the project:

  1. `npm install`
  1. Run the index.js with a proper configuration. Ex:
```bash
API_AI_TOKEN="my-api-token" \
BASE_API_URL="https://api.prod.smartservices.car2go.com" \
CRT_FILE_PATH="./credentials/my-certificate.crt" \
CRT_PASSPHRASE="smartcode" \
PEM_FILE_PATH="./credentials/my-certificate.pem" \
KEY_FILE_PATH="./credentials/my-certificate-key.key" \
SLACK_BOT_CHANNEL="my-slack-channel" \
SLACK_BOT_TOKEN="my-token-of-the-slack-bot" \
node index
```
  3. Invite your slack bot to the `#my-slack-channel` as he cannot join on its own.

# Screenshots

## Slack BOT

### Attempt with the mocked VIN
[![Slack BOT](https://preview.ibb.co/mQuWqb/Screen_Shot_2017_10_07_at_14_47_41.png)](https://ibb.co/n3ULiw)

### Attempt with a real VIN pointing to a vehicle (which worked :wink:)
[![Slack BOT](https://preview.ibb.co/mB1Bqb/Screen_Shot_2017_10_07_at_14_48_40.png)](https://ibb.co/cf2vGG)


## Google Assistant App
[![Google Assistant App](https://preview.ibb.co/mkn6Ow/Screen_Shot_2017_10_02_at_16_30_12.png)](https://ibb.co/nuEmOw)

Directly embed screenshots or simply place them in a folder (eg: "project-screenshots") along with your code.

## Improvements and other ideas

We could have a better coverage of the API, but the truth is that extending to do so is not
a challenge. By identifying the correct actions via API.AI the bot works just fine by pointing
to the right _endpoint_.

One thing is that the code is not failsafe. There should be a command to set the VIN instead of
just assuming that any single alphanumeric uppercased string would be one, but for the purpose
of the demo it works.

We also implemented, after Pixels Camp 2017, a Google Assistant app connected to a Google Cloud Function to connect to the your API (see also in the screenshots).
