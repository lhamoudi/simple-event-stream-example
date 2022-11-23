## Reporting Impact
Simple example of Event Stream webhook to log the event payload

## Pre-Requisites
* An active Twilio account
* npm version 5.0.0 or later installed (type `npm -v` in your terminal to check)
* Node.js version 12 or later installed (type `node -v` in your terminal to check)
* [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart#install-twilio-cli) along with the [Serverless CLI Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins). Run the following commands to install them:
  
  ```bash
  # Install the Twilio CLI (refer to docs for better ways to install vs npm)
  npm install twilio-cli -g
  # Install the Serverless Plugin
  twilio plugins:install @twilio-labs/plugin-serverless
  twilio plugins:install @twilio-labs/plugin-flex
  ```

### Setup
1. Clone this repo to your local development environment
1. Change to the root directory of the repo and install the dependencies
    ```bash
    npm install
    ```

### Serverless Function Deploy
1. Verify your Twilio CLI is using the Twilio account you want to test with. Run the following command and note which Twilio account has `Active` as `true`
    ```bash
    twilio profiles:list
    ```
1. If you need to change the active Twilio account, run the following command with the desired profile name
    ```bash
    twilio profiles:use PROFILE
    ```
1. If you do not yet have a Twilio CLI profile for the desired Twilio account, run the following command to connect to that account and give it your desired profile name
    ```bash
    twilio profiles:create --profile=PROFILE
    ```
1. With your desired Twilio Flex account profile active in the Twilio CLI, change to the root directory of the repo and deploy the Twilio Serverless Functions and Assets
    ```bash
    twilio serverless:deploy
    ```
1. When the deployment completes, copy the following Deployment Details that will be used in subsequent setup and configuration steps
    * `Domain`
    * `Functions` URL that ends in `/simple-event-stream-example`
    * `Service SID` if you want to tail logs via CLI later

## Event Stream Webhook

This is the crux of the example - the Function that serves as the Event Stream webhook. To configure the Function as an Event Stream webhook, do the following:

1. Create an Event Stream webhook sink via CLI
    e.g.
    ```
    twilio api:events:v1:sinks:create --description 'Simple Event Stream Webhook Sink' --sink-configuration '{"destination":"https://simple-event-stream-example-1234-dev.twil.io/event-handler","method":"POST","batch_events":true}' --sink-type webhook
    ```
    (replace the Domain with the value you copied in the Serverless Function Deploy section above)

    NOTE the generated SID for the Sink
1. Create an Event Stream Subscription for the Webhook Sink 
    e.g. in this case we are subscribing to Video Log Analyzer events. Others can be found [here](https://www.twilio.com/docs/events/event-types)
    ```
    twilio api:events:v1:subscriptions:create --description 'Simple Event Stream Webhook Subscription to Video Log Analyzer Events' --sink-sid DGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX --types '{"type":"com.twilio.taskrouter.reservation.accepted","schema_version":1}' --types '{"type":"com.twilio.video.insights.log-analyzer.room-summary","schema_version":1}' --types '{"type":"com.twilio.video.insights.log-analyzer.participant-summary","schema_version":1}'
    ```
    (populate the `--sink-sid` value with the SID generated in previous step)


## TEST

You can test by opening the Function via Console's Functions and Assets, and enabling live logging to inspect the log messages as the events arrive.

Alternatively you can use CLI to grab the Serverless logs
```
twilio serverless:logs --service-sid=ZSxxx --tail
```
  (replace the Service SID with the value you copied in the Serverless Function Deploy section above)