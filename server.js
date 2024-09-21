require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const nodemailer = require("nodemailer");
const app = express();
const PORT = process.env.PORT;
const APIKey = process.env.KEY;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let currentDate = new Date();
let adverts = [];

setInterval(async () => {
  currentDate = new Date();

  try {
    console.log(`20 minutes after`);
    await callAPI();
  } catch (error) {
    console.log(error);
  }
}, 1200000);

async function callAPI() {
  try {
    const response = await axios.get(
      "https://idealista7.p.rapidapi.com/listhomes",
      {
        params: {
          order: "lowestprice",
          operation: "rent",
          locationId: "0-EU-PT-11-06",
          maxItems: 40,
          locationName: "Lisboa",
          numPage: 1,
          location: "pt",
          locale: "pt",
          maxPrice: 1100,
          minSize: 40,
          bedrooms0: false,
          bedrooms1: true,
          bedrooms2: true,
          bedrooms3: true,
          bedrooms4: true,
          sinceDate: "T",
        },
        headers: {
          "X-RapidAPI-Key": APIKey,
          "X-RapidAPI-Host": "idealista7.p.rapidapi.com",
        },
        timeout: 10000,
      }
    );

    if (response.data) {
      let sendEmail = false;

      for (let line of response.data.elementList) {
        if (!adverts.includes(line.propertyCode)) {
          adverts.push(line.propertyCode);
          sendEmail = true;
        }
      }

      if (sendEmail) prepareEmail(response.data);
      else console.log("No new houses");
    } else console.log("No data available");
  } catch (error) {
    console.log(`Error calling API`);
  }
}

function prepareEmail(data) {
  try {
    let emailText =
      "<table border='1'><tr><th>ID da casa</th><th>URL</th><th>Foto</th><th>Tamanho (m2)</th><th>Nº Quartos</th><th>Nº Casas de banho</th><th>Munícipio</th><th>Morada</th><th>Preço</th></tr>";
    for (let item of data.elementList) {
      emailText += `<tr><td>${item.propertyCode}</td><td><a href="${item.url}">Abrir link</a></td><td><img src="${item.thumbnail}" width="200" height="200"></td><td>${item.size}</td><td>${item.rooms}</td><td>${item.bathrooms}</td><td>${item.municipality}</td><td>${item.address}</td><td>${item.price}</td></tr>`;
    }
    emailText += "</table>";

    sendEmail(emailText);
  } catch (error) {
    console.log("Error formatting data:", error);
  }
}

function sendEmail(emailText) {
  try {
    const transporter = nodemailer.createTransport({
      service: "outlook",
      auth: {
        user: process.env.EMAILFROM,
        pass: process.env.EMAILPASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAILFROM,
      to: process.env.EMAILTO,
      subject: `Foram encontradas novas casas no Idealista no dia ${currentDate.toLocaleDateString()}`,
      text: "",
      html: emailText,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log(`API called at: ${currentDate}`);
        console.log(`Number Of Adverts: ${adverts.length}`);
        console.log(`Adverts list: ${adverts}`);
        console.log("Email sent: " + info.response);
        console.log("");
      }
    });
  } catch (error) {
    console.log("Email error:", error);
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);

  try {
    callAPI();
  } catch (error) {
    console.log(error);
  }
});
