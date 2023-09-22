const axios = require("axios");
const cheerio = require("cheerio");

const Laptop = require("../models/laptop");

// Web Scraping using Cheerio
const scrapeLaptops = async () => {
  await Laptop.deleteMany({});
  const pageURLsArray = [];
  pageURLsArray[0] =
    "https://pricebaba.com/laptop/pricelist/all-laptops-sold-in-india";
  for (let page = 1; page < 92; page++) {
    pageURLsArray[page] = pageURLsArray[0] + "?page=" + (page + 1).toString();
  }

  for (let index = 0; index < pageURLsArray.length; index++) {
    axios.get(pageURLsArray[index]).then((response) => {
      if (response) {
        const urlsArray = [];
        const html_data = response.data;
        const $ = cheerio.load(html_data);

        const viewDetailsButtonBase =
          "#mainContent > #mainBody > div.ldng > div.pg-cntnt > div.ord-2 > div.pgcnt > div.ldng > div.stack-inline > div:nth-child(1) > #productsCnt > div.stack-inline";
        // console.log($(viewDetailsButtonBase).text())
        $(viewDetailsButtonBase).each((parentIndex, parentElem) => {
          $(parentElem)
            .children()
            .each((childId, childElem) => {
              const viewDetailsButtonHTML =
                viewDetailsButtonBase +
                "> div:nth-child(" +
                (childId + 1).toString() +
                ")> div.crd > div.crd-cntnt > div.prd-crd > div.d-none > span";
              const viewDetailsURL = $(viewDetailsButtonHTML).attr("data-href");
              if (viewDetailsURL) {
                urlsArray.push(viewDetailsURL);
              }
            });
        });
        console.log(pageURLsArray[index]);
        for (let i = 0; i < urlsArray.length; i++) {
          axios
            .get(urlsArray[i])
            .catch(function (error) {
              console.log(error.toJSON());
            })
            .then((response) => {
              if (response) {
                const html_data = response.data;
                const $ = cheerio.load(html_data);
                // console.log($);
                const laptopDetailsPathBase =
                  "#mainContent > #mainBody > div.ldng > #productPage > #specificationsTab > div.pgcnt > div.crd";
                const laptopNamePath =
                  laptopDetailsPathBase + "> div.crd-hdr > div.crd-hdng > h2";
                const laptop = new Laptop();
                laptop.Name = $(laptopNamePath).text();
                // const laptopName = $(laptopNamePath).text();

                const laptopDetailPath =
                  laptopDetailsPathBase + "> div.crd-cntnt > div.stack-inline";
                $(laptopDetailPath).each((parentIndex, parentElem) => {
                  $(parentElem)
                    .children()
                    .each((childID, childElem) => {
                      const tableBody =
                        " > div.v-al-top:nth-child(" +
                        (childID + 1).toString() +
                        ") > table > tbody";
                      const detailTable = laptopDetailPath + tableBody;
                      // console.log($(detailTable).length, $(detailTable).text())
                      $(detailTable).each((pID, pElem) => {
                        $(pElem)
                          .children()
                          .each((cID, cElem) => {
                            const tableRow =
                              detailTable +
                              " > tr:nth-child(" +
                              (cID + 1).toString() +
                              ")";
                            const rowKey = tableRow + " > td:nth-child(1)";
                            const rowValue = tableRow + " > td:nth-child(2)";
                            // console.log('Key:', $(rowKey).text());
                            // console.log('Value:', $(rowValue).text());
                            let attribute = $(rowKey).text();
                            let value = $(rowValue).text();
                            laptop[attribute] = value;
                          });
                      });
                    });
                });
                laptop.save();
                console.log("Laptop Name", laptop.Name);
              }
              // console.log(laptop);
            });
        }
      }
    });
  }
};

module.exports = { scrapeLaptops };
