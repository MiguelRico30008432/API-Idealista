# Idealista Rental Notifications via Email

This application monitors rental listings in Lisbon using the Idealista API and sends email notifications whenever new houses are discovered. It is designed to check for new listings every 20 minutes and notify multiple recipients via email with the details of the properties.

## Prerequisites

- Node.js installed
- An account on [RapidAPI](https://rapidapi.com) to access the Idealista API
- A valid email account (e.g., Outlook, Gmail) for sending notifications

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project folder and install the dependencies:
   npm install
3. Create a .env file in the root directory of the project with the following information:

PORT=your_server_port
EMAILFROM=your_email@example.com
EMAILPASSWORD=your_email_password
EMAILTO=email1@example.com, email2@example.com
KEY=your_rapidapi_key

4. Start application
npm start

## API Reference
This project uses the [Idealista7 API](https://rapidapi.com/scraperium/api/idealista7) for fetching rental listings. Ensure you have a valid API key from RapidAPI and have subscribed to the Idealista7 API.